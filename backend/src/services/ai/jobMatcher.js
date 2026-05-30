const { GoogleGenerativeAI } = require("@google/generative-ai");
const prisma = require("../../config/prisma");
const config = require("../../config");
const { JOB_MATCHING_PROMPT } = require("./promptTemplates");

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

const PROFILE_INCLUDE = {
  academicRecords: { include: { subjectMarks: true } },
  interests: true,
  careerGoals: true,
  strengths: true,
  weaknesses: true,
  skills: { include: { skill: true } },
  certifications: true,
  user: { select: { firstName: true, lastName: true } },
};

async function fetchStudentProfile(userId) {
  const profile = await prisma.studentProfile.findUnique({
    where: { userId },
    include: PROFILE_INCLUDE,
  });

  if (!profile) {
    const err = new Error("Student profile not found. Please complete your profile first.");
    err.statusCode = 404;
    throw err;
  }

  return profile;
}

function calculateSkillMatchScore(studentSkills, jobSkills) {
  if (!jobSkills || jobSkills.length === 0) return { score: 1, matched: [], missing: [] };

  const skillMap = new Map();
  for (const ss of studentSkills) {
    skillMap.set(ss.skill.name.toLowerCase(), ss.level);
  }

  const matched = [];
  const missing = [];

  for (const jobSkill of jobSkills) {
    const studentLevel = skillMap.get(jobSkill.toLowerCase());
    if (studentLevel !== undefined) {
      matched.push({ skill: jobSkill, studentLevel, requiredLevel: 5 });
    } else {
      missing.push({ skill: jobSkill, requiredLevel: 5, studentLevel: 0 });
    }
  }

  const score = jobSkills.length > 0 ? matched.length / jobSkills.length : 0;
  return { score, matched, missing };
}

function calculateExperienceFit(studentProfile, jobExperience) {
  if (!jobExperience) return 0.5;

  const records = studentProfile.academicRecords || [];
  const current = records.find((r) => r.isCurrent) || records[0];
  const yearMap = {
    FRESHMAN: 0,
    SOPHOMORE: 1,
    JUNIOR: 2,
    SENIOR: 3,
    GRADUATE: 4,
    POST_GRADUATE: 5,
  };
  const studentYear = current ? (yearMap[current.year] || 0) : 0;

  const expLower = jobExperience.toLowerCase();
  if (expLower.includes("fresher") || expLower.includes("entry") || expLower.includes("0-1")) {
    return studentYear <= 2 ? 0.9 : 0.6;
  }
  if (expLower.includes("1-3") || expLower.includes("junior") || expLower.includes("1 to 3")) {
    return studentYear >= 2 && studentYear <= 3 ? 0.9 : 0.5;
  }
  if (expLower.includes("3-5") || expLower.includes("mid") || expLower.includes("3 to 5")) {
    return studentYear >= 3 ? 0.7 : 0.3;
  }
  if (expLower.includes("5+") || expLower.includes("senior") || expLower.includes("5 to")) {
    return studentYear >= 4 ? 0.6 : 0.2;
  }
  return 0.5;
}

function calculateLocationFit(studentCity, studentCountry, jobLocation) {
  if (!jobLocation) return 0.5;

  const jobLoc = jobLocation.toLowerCase();
  if (jobLoc.includes("remote") || jobLoc.includes("work from home") || jobLoc.includes("wfh")) {
    return 1.0;
  }
  if (jobLoc.includes("hybrid")) return 0.8;

  if (studentCity && jobLoc.includes(studentCity.toLowerCase())) return 1.0;
  if (studentCountry && jobLoc.includes(studentCountry.toLowerCase())) return 0.7;

  if (jobLoc.includes("bangalore") || jobLoc.includes("bengaluru")) return 0.6;
  if (jobLoc.includes("mumbai") || jobLoc.includes("pune")) return 0.6;
  if (jobLoc.includes("delhi") || jobLoc.includes("gurgaon") || jobLoc.includes("noida")) return 0.6;
  if (jobLoc.includes("hyderabad")) return 0.6;
  if (jobLoc.includes("chennai")) return 0.6;

  return 0.3;
}

function calculateInterestAlignment(studentInterests, jobCategory, jobTitle) {
  if (!studentInterests || studentInterests.length === 0) return 0.5;

  const interestStr = studentInterests.map((i) => i.name.toLowerCase()).join(" ");
  const jobStr = `${(jobCategory || "").toLowerCase()} ${(jobTitle || "").toLowerCase()}`;

  const jobWords = jobStr.split(/\s+/).filter((w) => w.length > 3);
  let matches = 0;
  for (const word of jobWords) {
    if (interestStr.includes(word)) matches++;
  }

  return jobWords.length > 0 ? Math.min(1, matches / Math.ceil(jobWords.length / 2)) : 0.5;
}

function formatSkillsForPrompt(studentSkills) {
  if (!studentSkills || studentSkills.length === 0) return "No skills listed yet.";
  return studentSkills
    .map((ss) => `- ${ss.skill.name} (Level: ${ss.level}/10, Category: ${ss.skill.category}${ss.yearsExp ? `, ${ss.yearsExp} years experience` : ""})`)
    .join("\n");
}

function formatJobsForPrompt(jobs) {
  if (!jobs || jobs.length === 0) return "No job listings available.";
  return jobs
    .map(
      (j) =>
        `- ID: ${j.id}\n  Title: ${j.title}\n  Company: ${j.company}\n  Location: ${j.location || "Not specified"}\n  Type: ${j.type || "Full-time"}\n  Experience: ${j.experience || "Not specified"}\n  Skills: ${Array.isArray(j.skills) ? j.skills.join(", ") : j.skills || "Not specified"}\n  Category: ${j.category}\n  Salary: ${j.salaryRange || "Not disclosed"}\n  Description: ${(j.description || "").substring(0, 300)}`
    )
    .join("\n\n");
}

async function callGemini(prompt) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.3,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 8192,
    },
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) || text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("AI returned invalid JSON response");
  }

  const jsonStr = jsonMatch[1] || jsonMatch[0];
  return JSON.parse(jsonStr.trim());
}

function getGPA(profile) {
  const records = profile.academicRecords;
  if (!records || records.length === 0) return "Not available";
  const current = records.find((r) => r.isCurrent) || records[0];
  if (current.gpa) return `${current.gpa}`;
  if (current.percentage) return `${current.percentage}%`;
  return "Not available";
}

function getFieldOfStudy(profile) {
  const records = profile.academicRecords;
  if (!records || records.length === 0) return "Not specified";
  const current = records.find((r) => r.isCurrent) || records[0];
  return current.fieldOfStudy || "Not specified";
}

function getAcademicYear(profile) {
  const records = profile.academicRecords;
  if (!records || records.length === 0) return "Not specified";
  const current = records.find((r) => r.isCurrent) || records[0];
  return current.year || "Not specified";
}

function getResumeSummary(profile) {
  const parts = [];
  if (profile.certifications && profile.certifications.length > 0) {
    parts.push(`Certifications: ${profile.certifications.map((c) => c.name).join(", ")}`);
  }
  if (profile.strengths && profile.strengths.length > 0) {
    parts.push(`Key strengths: ${profile.strengths.map((s) => s.name).join(", ")}`);
  }
  if (profile.bio) {
    parts.push(`Bio: ${profile.bio.substring(0, 200)}`);
  }
  return parts.length > 0 ? parts.join("; ") : "No resume data available";
}

function mergeAIScoresWithCalcScores(aiJob, calcScores) {
  if (!aiJob) return calcScores;

  return {
    overallMatchScore: aiJob.overallMatchScore || calcScores.overallMatchScore,
    skillMatchScore: aiJob.skillMatchScore || calcScores.skillMatchScore,
    interestAlignmentScore: aiJob.interestAlignmentScore || calcScores.interestAlignmentScore,
    experienceFitScore: aiJob.experienceFitScore || calcScores.experienceFitScore,
    locationFitScore: aiJob.locationFitScore || calcScores.locationFitScore,
    matchedSkills: aiJob.matchedSkills || calcScores.matchedSkills,
    missingSkills: aiJob.missingSkills || calcScores.missingSkills,
    reasoning: aiJob.reasoning || "",
    applicationTips: aiJob.applicationTips || [],
    growthPotential: aiJob.growthPotential || "",
    riskFactors: aiJob.riskFactors || [],
  };
}

async function storeJobMatches(userId, matchedJobs) {
  const stored = [];
  for (const match of matchedJobs) {
    const existing = await prisma.recommendation.findFirst({
      where: {
        userId,
        type: "JOB",
        title: match.title,
        description: { contains: match.jobId },
      },
    });

    if (!existing) {
      const record = await prisma.recommendation.create({
        data: {
          userId,
          type: "JOB",
          title: match.title,
          description: match.reasoning,
          confidence: match.overallMatchScore,
          reasoning: {
            jobId: match.jobId,
            company: match.company,
            matchedSkills: match.matchedSkills,
            missingSkills: match.missingSkills,
            applicationTips: match.applicationTips,
            growthPotential: match.growthPotential,
            riskFactors: match.riskFactors,
          },
          metadata: {
            overallMatchScore: match.overallMatchScore,
            skillMatchScore: match.skillMatchScore,
            recommendedAt: new Date().toISOString(),
          },
          expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
      });
      stored.push(record);
    }
  }
  return stored;
}

async function matchJobs(userId, jobFilters = {}) {
  const profile = await fetchStudentProfile(userId);
  const studentSkills = profile.skills || [];

  const jobWhere = { isActive: true };
  if (jobFilters.category) jobWhere.category = jobFilters.category;
  if (jobFilters.type) jobWhere.type = jobFilters.type;
  if (jobFilters.location) {
    jobWhere.location = { contains: jobFilters.location, mode: "insensitive" };
  }
  if (jobFilters.experience) {
    jobWhere.experience = { contains: jobFilters.experience, mode: "insensitive" };
  }

  let jobs = await prisma.job.findMany({
    where: jobWhere,
    take: 50,
    orderBy: { postedAt: "desc" },
  });

  if (jobFilters.skills && jobFilters.skills.length > 0) {
    jobs = jobs.filter((j) => {
      const jobSkills = (j.skills || []).map((s) => s.toLowerCase());
      return jobFilters.skills.some((s) => jobSkills.includes(s.toLowerCase()));
    });
  }

  if (jobs.length === 0) {
    console.log("[JobMatcher] No active jobs in database. Dynamically seeding realistic jobs matching student profile...");
    const preferredCity = profile.city || "Mumbai";
    const preferredCountry = profile.country || "India";
    const targetCityStr = preferredCity.charAt(0).toUpperCase() + preferredCity.slice(1);
    
    const mockJobsData = [
      {
        title: "Associate Software Engineer",
        company: "TCS (Tata Consultancy Services)",
        location: `${targetCityStr}, ${preferredCountry}`,
        url: "https://www.linkedin.com/jobs/view/associate-software-engineer-tcs",
        salaryRange: "₹4.5 - ₹6.5 LPA",
        experience: "0-2 years (Fresher)",
        skills: ["Java", "SQL", "JavaScript", "React", "Python"],
        category: "Technology",
        type: "full-time",
      },
      {
        title: "Frontend Web Developer",
        company: "Razorpay",
        location: `Remote, ${preferredCountry}`,
        url: "https://www.linkedin.com/jobs/view/frontend-developer-razorpay",
        salaryRange: "₹8.0 - ₹12.0 LPA",
        experience: "0-3 years (Fresher / Junior)",
        skills: ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Tailwind"],
        category: "Technology",
        type: "full-time",
      },
      {
        title: "Full Stack Engineer (MERN)",
        company: "CRED",
        location: `Bangalore, Karnataka, ${preferredCountry}`,
        url: "https://www.linkedin.com/jobs/view/fullstack-mern-cred",
        salaryRange: "₹12.0 - ₹18.0 LPA",
        experience: "1-4 years",
        skills: ["JavaScript", "React", "Node.js", "Express.js", "MongoDB", "PostgreSQL"],
        category: "Technology",
        type: "full-time",
      },
      {
        title: "Junior Data Analyst",
        company: "Mu Sigma",
        location: `${targetCityStr}, ${preferredCountry}`,
        url: "https://www.indeed.com/viewjob/junior-data-analyst-musigma",
        salaryRange: "₹5.0 - ₹7.5 LPA",
        experience: "0-1 years",
        skills: ["Python", "SQL", "Excel", "Data Visualization", "Statistics"],
        category: "Technology",
        type: "full-time",
      },
      {
        title: "Machine Learning Engineer Associate",
        company: "Flipkart",
        location: `Hybrid - Bangalore, ${preferredCountry}`,
        url: "https://www.naukri.com/job/ml-engineer-flipkart",
        salaryRange: "₹14.0 - ₹20.0 LPA",
        experience: "0-3 years",
        skills: ["Python", "Machine Learning", "TensorFlow", "PyTorch", "SQL", "Data Science"],
        category: "Technology",
        type: "full-time",
      },
      {
        title: "Associate Product Manager",
        company: "Zomato",
        location: `Gurgaon, Haryana, ${preferredCountry}`,
        url: "https://www.jobhai.com/job/associate-pm-zomato",
        salaryRange: "₹10.0 - ₹15.0 LPA",
        experience: "0-2 years",
        skills: ["Project Management", "Agile", "Scrum", "Communication", "Problem Solving"],
        category: "Business",
        type: "full-time",
      },
      {
        title: "UX/UI Designer",
        company: "Unacademy",
        location: `Remote, ${preferredCountry}`,
        url: "https://www.linkedin.com/jobs/view/uxui-designer-unacademy",
        salaryRange: "₹6.0 - ₹10.0 LPA",
        experience: "0-3 years",
        skills: ["Figma", "UI/UX Design", "Wireframing", "Product Design", "Design"],
        category: "Creative",
        type: "full-time",
      },
      {
        title: "Digital Marketing Specialist",
        company: "Zeta Global",
        location: `Mumbai, Maharashtra, ${preferredCountry}`,
        url: "https://www.indeed.com/viewjob/marketing-specialist-zeta",
        salaryRange: "₹6.5 - ₹9.0 LPA",
        experience: "1-3 years",
        skills: ["Digital Marketing", "Communication", "SEO", "Content Strategy"],
        category: "Creative",
        type: "full-time",
      }
    ];

    await prisma.job.createMany({
      data: mockJobsData,
      skipDuplicates: true,
    });

    jobs = await prisma.job.findMany({
      where: jobWhere,
      take: 50,
      orderBy: { postedAt: "desc" },
    });
  }

  if (jobs.length === 0) {
    return {
      matchedJobs: [],
      message: "No jobs found matching your criteria. Try adjusting your filters.",
      totalJobsAnalyzed: 0,
    };
  }

  const preScoredJobs = jobs.map((job) => {
    const skillMatch = calculateSkillMatchScore(studentSkills, job.skills || []);
    const experienceFit = calculateExperienceFit(profile, job.experience);
    const locationFit = calculateLocationFit(profile.city, profile.country, job.location);
    const interestAlignment = calculateInterestAlignment(profile.interests, job.category, job.title);

    const overallScore =
      skillMatch.score * 0.35 +
      interestAlignment * 0.25 +
      experienceFit * 0.2 +
      locationFit * 0.2;

    return {
      job,
      calcScores: {
        overallMatchScore: Math.round(overallScore * 100) / 100,
        skillMatchScore: Math.round(skillMatch.score * 100) / 100,
        interestAlignmentScore: Math.round(interestAlignment * 100) / 100,
        experienceFitScore: Math.round(experienceFit * 100) / 100,
        locationFitScore: Math.round(locationFit * 100) / 100,
        matchedSkills: skillMatch.matched,
        missingSkills: skillMatch.missing,
      },
    };
  });

  preScoredJobs.sort((a, b) => b.calcScores.overallMatchScore - a.calcScores.overallMatchScore);
  const topJobs = preScoredJobs.slice(0, 15);

  const prompt = JOB_MATCHING_PROMPT.replace("{{studentName}}", `${profile.user.firstName} ${profile.user.lastName}`)
    .replace("{{academicYear}}", getAcademicYear(profile))
    .replace("{{fieldOfStudy}}", getFieldOfStudy(profile))
    .replace("{{gpa}}", getGPA(profile))
    .replace("{{city}}", profile.city || "Not specified")
    .replace("{{state}}", profile.state || "Not specified")
    .replace("{{country}}", profile.country || "India")
    .replace("{{currentSkills}}", formatSkillsForPrompt(studentSkills))
    .replace("{{certifications}}", profile.certifications.length > 0 ? profile.certifications.map((c) => `- ${c.name} (${c.issuer})`).join("\n") : "No certifications")
    .replace("{{careerGoals}}", profile.careerGoals.length > 0 ? profile.careerGoals.map((g) => `- ${g.title}${g.description ? `: ${g.description}` : ""}`).join("\n") : "No career goals set")
    .replace("{{interests}}", profile.interests.length > 0 ? profile.interests.map((i) => `- ${i.name}${i.category ? ` (${i.category})` : ""}`).join("\n") : "No interests listed")
    .replace("{{strengths}}", profile.strengths.length > 0 ? profile.strengths.map((s) => `- ${s.name}${s.evidence ? `: ${s.evidence}` : ""}`).join("\n") : "No strengths listed")
    .replace("{{resumeSummary}}", getResumeSummary(profile))
    .replace("{{availableJobs}}", formatJobsForPrompt(topJobs.map((t) => t.job)))
    .replace("{{category}}", jobFilters.category || "All")
    .replace("{{jobType}}", jobFilters.type || "All")
    .replace("{{locationPreference}}", jobFilters.location || "No preference")
    .replace("{{experienceLevel}}", jobFilters.experience || "Any")
    .replace("{{salaryRange}}", jobFilters.salaryRange || "No preference");

  let aiResult;
  try {
    aiResult = await callGemini(prompt);
  } catch (aiErr) {
    console.error("[JobMatcher] AI call failed, using calculation-only mode:", aiErr.message);
    aiResult = { matchedJobs: [], summary: {}, skillDevelopmentPlan: [] };
  }

  const aiJobMap = new Map();
  for (const aiJob of aiResult.matchedJobs || []) {
    aiJobMap.set(aiJob.jobId, aiJob);
  }

  const matchedJobs = topJobs.map(({ job, calcScores }) => {
    const aiJob = aiJobMap.get(job.id);
    const merged = mergeAIScoresWithCalcScores(aiJob, calcScores);

    return {
      jobId: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      experience: job.experience,
      salaryRange: job.salaryRange,
      category: job.category,
      url: job.url,
      postedAt: job.postedAt,
      ...merged,
    };
  });

  matchedJobs.sort((a, b) => b.overallMatchScore - a.overallMatchScore);

  const strongMatches = matchedJobs.filter((j) => j.overallMatchScore >= 0.7).length;
  const moderateMatches = matchedJobs.filter((j) => j.overallMatchScore >= 0.4 && j.overallMatchScore < 0.7).length;
  const weakMatches = matchedJobs.filter((j) => j.overallMatchScore < 0.4).length;

  let storedMatches = [];
  try {
    storedMatches = await storeJobMatches(userId, matchedJobs.slice(0, 5));
  } catch (storeErr) {
    console.error("[JobMatcher] Failed to store job matches:", storeErr.message);
  }

  return {
    matchedJobs,
    summary: aiResult.summary || {
      totalJobsAnalyzed: jobs.length,
      strongMatches,
      moderateMatches,
      weakMatches,
      topRecommendation: matchedJobs.length > 0 ? matchedJobs[0].reasoning : "No strong matches found",
    },
    skillDevelopmentPlan: aiResult.skillDevelopmentPlan || [],
    storedMatches: storedMatches.length,
    totalJobsAnalyzed: jobs.length,
    generatedAt: new Date().toISOString(),
  };
}

module.exports = { matchJobs };
