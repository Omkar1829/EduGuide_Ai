const { GoogleGenerativeAI } = require("@google/generative-ai");
const prisma = require("../../config/prisma");
const config = require("../../config");
const { COURSE_RECOMMENDATION_PROMPT } = require("./promptTemplates");

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

function identifySkillGaps(studentSkills, careerGoals) {
  const currentSkillMap = new Map();
  for (const ss of studentSkills) {
    currentSkillMap.set(ss.skill.name.toLowerCase(), {
      level: ss.level,
      category: ss.skill.category,
    });
  }

  const careerKeywords = new Map();
  const goalTitles = careerGoals.map((g) => g.title.toLowerCase());
  const goalDescs = careerGoals.map((g) => (g.description || "").toLowerCase());

  const careerSkillHints = {
    frontend: ["HTML", "CSS", "JavaScript", "React", "Vue", "Angular", "TypeScript", "Tailwind", "UI/UX"],
    backend: ["Node.js", "Express", "Python", "Java", "Django", "Flask", "REST API", "GraphQL"],
    fullstack: ["JavaScript", "React", "Node.js", "Database", "API", "DevOps"],
    data: ["Python", "SQL", "Machine Learning", "Statistics", "Pandas", "NumPy", "Data Visualization"],
    ml: ["Python", "TensorFlow", "PyTorch", "Deep Learning", "NLP", "Computer Vision"],
    cloud: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Terraform"],
    mobile: ["React Native", "Flutter", "Swift", "Kotlin", "iOS", "Android"],
    devops: ["Docker", "Kubernetes", "Jenkins", "Git", "Linux", "CI/CD", "Monitoring"],
    cybersecurity: ["Network Security", "Penetration Testing", "Cryptography", "Firewall", "SIEM"],
    design: ["Figma", "Adobe XD", "Photoshop", "Illustrator", "UI/UX", "Wireframing"],
    management: ["Agile", "Scrum", "Project Management", "Leadership", "Communication"],
  };

  const suggestedSkills = new Set();
  for (const goal of [...goalTitles, ...goalDescs]) {
    for (const [field, skills] of Object.entries(careerSkillHints)) {
      if (goal.includes(field)) {
        skills.forEach((s) => suggestedSkills.add(s));
      }
    }
  }

  const gaps = [];
  for (const skill of suggestedSkills) {
    const current = currentSkillMap.get(skill.toLowerCase());
    if (!current) {
      gaps.push({ skill, requiredLevel: 5, currentLevel: 0, gap: 5 });
    } else if (current.level < 5) {
      gaps.push({
        skill,
        requiredLevel: 5,
        currentLevel: current.level,
        gap: 5 - current.level,
      });
    }
  }

  for (const [skill, data] of currentSkillMap) {
    if (data.level < 3) {
      const already = gaps.find((g) => g.skill.toLowerCase() === skill);
      if (!already) {
        gaps.push({
          skill: data.level > 0 ? skill.charAt(0).toUpperCase() + skill.slice(1) : skill,
          requiredLevel: 5,
          currentLevel: data.level,
          gap: 5 - data.level,
        });
      }
    }
  }

  gaps.sort((a, b) => b.gap - a.gap);
  return gaps.slice(0, 15);
}

function formatSkillsForPrompt(studentSkills) {
  if (!studentSkills || studentSkills.length === 0) return "No skills listed yet.";
  return studentSkills
    .map((ss) => `- ${ss.skill.name} (Level: ${ss.level}/10, Category: ${ss.skill.category}${ss.yearsExp ? `, ${ss.yearsExp} years experience` : ""})`)
    .join("\n");
}

function formatCoursesForPrompt(courses) {
  if (!courses || courses.length === 0) return "No courses available in the catalog.";
  return courses
    .map(
      (c) =>
        `- ID: ${c.id}\n  Title: ${c.title}\n  Provider: ${c.provider}\n  Category: ${c.category}\n  Level: ${c.level || "Not specified"}\n  Duration: ${c.duration || "Not specified"}\n  Price: ${c.price != null ? `${c.currency || "INR"} ${c.price}` : "Free"}\n  Rating: ${c.rating || "N/A"}\n  Description: ${(c.description || "").substring(0, 200)}`
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

async function storeRecommendations(userId, recommendations) {
  const stored = [];
  for (const rec of recommendations) {
    const existing = await prisma.recommendation.findFirst({
      where: {
        userId,
        type: "COURSE",
        title: rec.title,
        description: { contains: rec.courseId },
      },
    });

    if (!existing) {
      const record = await prisma.recommendation.create({
        data: {
          userId,
          type: "COURSE",
          title: rec.title,
          description: rec.reasoning,
          confidence: rec.matchScore,
          reasoning: {
            courseId: rec.courseId,
            provider: rec.provider,
            expectedOutcome: rec.expectedOutcome,
            timeInvestment: rec.timeInvestment,
            skillGapsAddressed: rec.skillGapsAddressed,
            careerAlignment: rec.careerAlignment,
            priority: rec.priority,
          },
          metadata: {
            matchScore: rec.matchScore,
            recommendedAt: new Date().toISOString(),
          },
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
      stored.push(record);
    }
  }
  return stored;
}

function detectLearningStyle(profile) {
  const interests = profile.interests.map((i) => i.name.toLowerCase()).join(" ");
  const strengths = profile.strengths.map((s) => s.name.toLowerCase()).join(" ");
  const allText = `${interests} ${strengths}`;

  if (allText.includes("video") || allText.includes("visual") || allText.includes("design")) {
    return "visual";
  }
  if (allText.includes("reading") || allText.includes("writing") || allText.includes("research")) {
    return "reading_writing";
  }
  if (allText.includes("hands-on") || allText.includes("project") || allText.includes("lab")) {
    return "kinesthetic";
  }
  if (allText.includes("discussion") || allText.includes("presentation") || allText.includes("audio")) {
    return "auditory";
  }
  return "mixed";
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

async function recommendCourses(userId, filters = {}) {
  const profile = await fetchStudentProfile(userId);
  const studentSkills = profile.skills || [];
  const careerGoals = profile.careerGoals || [];

  const skillGaps = identifySkillGaps(studentSkills, careerGoals);
  const learningStyle = detectLearningStyle(profile);

  const courseWhere = { isActive: true };
  if (filters.category) courseWhere.category = filters.category;
  if (filters.level) courseWhere.level = filters.level;
  if (filters.maxPrice !== undefined) {
    courseWhere.price = { lte: Number(filters.maxPrice) };
  }
  if (filters.provider) {
    courseWhere.provider = { contains: filters.provider, mode: "insensitive" };
  }

  let courses = await prisma.course.findMany({
    where: courseWhere,
    take: 50,
    orderBy: [{ rating: "desc" }, { enrolledCount: "desc" }],
  });

  if (courses.length === 0) {
    console.log("[CourseRecommender] No courses in database. Dynamically seeding high-quality course catalog...");
    const mockCoursesData = [
      {
        title: "Python for Data Science & Machine Learning",
        description: "Learn Python programming, data cleaning, visualization, and machine learning models from scratch with hands-on projects.",
        provider: "Coursera",
        url: "https://www.coursera.org/specializations/statistics-play-python",
        duration: "8 weeks",
        level: "beginner",
        category: "Technology",
        price: 0,
        currency: "INR",
        rating: 4.8,
        enrolledCount: 15600,
      },
      {
        title: "Complete React Developer (React 19 & Redux)",
        description: "Master React, Redux Toolkit, Hooks, Router, and build production-grade web applications with modern Tailwind UI styling.",
        provider: "Udemy",
        url: "https://www.udemy.com/course/complete-react-developer-zero-to-mastery/",
        duration: "6 weeks",
        level: "intermediate",
        category: "Technology",
        price: 499,
        currency: "INR",
        rating: 4.9,
        enrolledCount: 24500,
      },
      {
        title: "UI/UX Design Fundamentals with Figma",
        description: "Learn UX principles, user research, wireframing, high-fidelity prototyping, and responsive layouts inside Figma.",
        provider: "Udemy",
        url: "https://www.udemy.com/course/ui-ux-web-design-figma-photoshop/",
        duration: "10 weeks",
        level: "beginner",
        category: "Design",
        price: 699,
        currency: "INR",
        rating: 4.7,
        enrolledCount: 12100,
      },
      {
        title: "Machine Learning A-Z: Hands-On Python & R",
        description: "Build robust machine learning algorithms, deep learning neural networks, and natural language processing models.",
        provider: "Udemy",
        url: "https://www.udemy.com/course/machinelearning/",
        duration: "12 weeks",
        level: "advanced",
        category: "Technology",
        price: 599,
        currency: "INR",
        rating: 4.8,
        enrolledCount: 38900,
      },
      {
        title: "Business Analytics: Decision Making with SQL & Excel",
        description: "Master SQL databases, advanced Excel functions, and learn to make data-driven strategic business decisions.",
        provider: "Coursera",
        url: "https://www.coursera.org/specializations/business-analytics",
        duration: "8 weeks",
        level: "beginner",
        category: "Business",
        price: 1499,
        currency: "INR",
        rating: 4.6,
        enrolledCount: 9200,
      },
      {
        title: "Agile Project Management & Scrum Master Certification",
        description: "Master Scrum ceremonies, sprint planning, backlog refinement, Kanban boards, and lean product development methodologies.",
        provider: "edX",
        url: "https://www.edx.org/professional-certificate/agile-project-management",
        duration: "5 weeks",
        level: "intermediate",
        category: "Business",
        price: 2999,
        currency: "INR",
        rating: 4.5,
        enrolledCount: 6800,
      },
      {
        title: "Digital Marketing Mastery & SEO Growth Hack",
        description: "Learn Google Ads, Facebook Ads, SEO optimization, email copywriting, and social media growth strategies.",
        provider: "Udemy",
        url: "https://www.udemy.com/course/digital-marketing-masterclass/",
        duration: "7 weeks",
        level: "beginner",
        category: "Business",
        price: 499,
        currency: "INR",
        rating: 4.6,
        enrolledCount: 19800,
      },
      {
        title: "Advanced DevOps: Docker, Kubernetes & CI/CD Pipelines",
        description: "Containerize applications using Docker, coordinate microservices with Kubernetes clusters, and automate deployment pipelines.",
        provider: "Coursera",
        url: "https://www.coursera.org/specializations/cloud-computing-devops",
        duration: "9 weeks",
        level: "advanced",
        category: "Technology",
        price: 0,
        currency: "INR",
        rating: 4.9,
        enrolledCount: 8400,
      }
    ];

    await prisma.course.createMany({
      data: mockCoursesData,
      skipDuplicates: true,
    });

    courses = await prisma.course.findMany({
      where: courseWhere,
      take: 50,
      orderBy: [{ rating: "desc" }, { enrolledCount: "desc" }],
    });
  }

  if (courses.length === 0) {
    return {
      recommendations: [],
      message: "No courses found matching your criteria. Try adjusting your filters.",
      skillGaps,
      totalCoursesAnalyzed: 0,
    };
  }

  const topN = filters.limit || 5;

  const prompt = COURSE_RECOMMENDATION_PROMPT.replace("{{studentName}}", `${profile.user.firstName} ${profile.user.lastName}`)
    .replace("{{academicYear}}", getAcademicYear(profile))
    .replace("{{fieldOfStudy}}", getFieldOfStudy(profile))
    .replace("{{gpa}}", getGPA(profile))
    .replace("{{city}}", profile.city || "Not specified")
    .replace("{{state}}", profile.state || "Not specified")
    .replace("{{country}}", profile.country || "India")
    .replace("{{currentSkills}}", formatSkillsForPrompt(studentSkills))
    .replace("{{skillGaps}}", skillGaps.length > 0 ? skillGaps.map((g) => `- ${g.skill}: Current level ${g.currentLevel}, Required ${g.requiredLevel} (Gap: ${g.gap})`).join("\n") : "No significant skill gaps identified")
    .replace("{{careerGoals}}", careerGoals.length > 0 ? careerGoals.map((g) => `- ${g.title}${g.description ? `: ${g.description}` : ""}`).join("\n") : "No career goals set")
    .replace("{{interests}}", profile.interests.length > 0 ? profile.interests.map((i) => `- ${i.name}${i.category ? ` (${i.category})` : ""}`).join("\n") : "No interests listed")
    .replace("{{strengths}}", profile.strengths.length > 0 ? profile.strengths.map((s) => `- ${s.name}${s.evidence ? `: ${s.evidence}` : ""}`).join("\n") : "No strengths listed")
    .replace("{{weaknesses}}", profile.weaknesses.length > 0 ? profile.weaknesses.map((w) => `- ${w.name}${w.evidence ? `: ${w.evidence}` : ""}`).join("\n") : "No weaknesses listed")
    .replace("{{learningStyle}}", learningStyle)
    .replace("{{availableCourses}}", formatCoursesForPrompt(courses))
    .replace("{{category}}", filters.category || "All")
    .replace("{{level}}", filters.level || "All")
    .replace("{{maxPrice}}", filters.maxPrice != null ? `₹${filters.maxPrice}` : "No limit")
    .replace("{{providerPreference}}", filters.provider || "No preference")
    .replace("{{topN}}", String(topN));

  const aiResult = await callGemini(prompt);

  const recommendations = (aiResult.recommendations || []).map((rec) => ({
    courseId: rec.courseId,
    title: rec.title,
    provider: rec.provider,
    matchScore: Math.min(1, Math.max(0, Number(rec.matchScore) || 0)),
    reasoning: rec.reasoning,
    expectedOutcome: rec.expectedOutcome,
    timeInvestment: rec.timeInvestment,
    skillGapsAddressed: rec.skillGapsAddressed || [],
    careerAlignment: rec.careerAlignment,
    priority: rec.priority || "medium",
  }));

  let storedRecommendations = [];
  try {
    storedRecommendations = await storeRecommendations(userId, recommendations);
  } catch (storeErr) {
    console.error("[CourseRecommender] Failed to store recommendations:", storeErr.message);
  }

  return {
    recommendations,
    storedRecommendations: storedRecommendations.length,
    overallAnalysis: aiResult.overallAnalysis || "",
    learningPath: aiResult.learningPath || "",
    skillGaps,
    totalCoursesAnalyzed: courses.length,
    generatedAt: new Date().toISOString(),
  };
}

module.exports = { recommendCourses };
