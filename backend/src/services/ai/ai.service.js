const { GoogleGenerativeAI } = require("@google/generative-ai");

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getGenerativeModel = () => {
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
};

const parseAIResponse = (text) => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { raw: text };
  } catch {
    return { raw: text };
  }
};

const getCareerRecommendation = async (userId, data) => {
  const { interests, skills, education, preferences } = data;

  if (!process.env.GEMINI_API_KEY) {
    throw new AppError("AI service not configured", 503);
  }

  const model = getGenerativeModel();
  const prompt = `As an AI career counselor, analyze the following student profile and provide career recommendations.

Student Profile:
- Interests: ${interests.join(", ")}
- Skills: ${skills.join(", ")}
- Education Level: ${education}
- Preferences: ${JSON.stringify(preferences || {})}

Provide a JSON response with:
{
  "recommendations": [
    {
      "title": "Career Title",
      "description": "Why this career fits",
      "confidence": 0.0-1.0,
      "requiredSkills": ["skill1", "skill2"],
      "growthPotential": "high/medium/low",
      "averageSalary": "salary range"
    }
  ],
  "analysis": "Overall analysis of career fit",
  "nextSteps": ["step1", "step2"]
}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return parseAIResponse(text);
};

const getStreamRecommendation = async (userId, data) => {
  const { academicPerformance, interests, aptitudeScores } = data;

  if (!process.env.GEMINI_API_KEY) {
    throw new AppError("AI service not configured", 503);
  }

  const model = getGenerativeModel();
  const prompt = `As an AI academic counselor, analyze the following student profile and recommend academic streams.

Student Profile:
- Academic Performance: ${JSON.stringify(academicPerformance)}
- Interests: ${interests.join(", ")}
- Aptitude Scores: ${JSON.stringify(aptitudeScores || {})}

Provide a JSON response with:
{
  "recommendations": [
    {
      "stream": "Stream Name",
      "description": "Why this stream fits",
      "confidence": 0.0-1.0,
      "relatedCareers": ["career1", "career2"],
      "difficulty": "high/medium/low"
    }
  ],
  "analysis": "Overall analysis of stream fit",
  "suggestions": ["suggestion1", "suggestion2"]
}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return parseAIResponse(text);
};

const analyzeSkillGap = async (userId, data) => {
  const { targetRole, currentSkills, experience } = data;

  if (!process.env.GEMINI_API_KEY) {
    throw new AppError("AI service not configured", 503);
  }

  const model = getGenerativeModel();
  const prompt = `As an AI career development specialist, analyze the skill gap for a student targeting a specific role.

Target Role: ${targetRole}
Current Skills: ${currentSkills.map((s) => `${s.name} (${s.level})`).join(", ")}
Experience: ${experience || 0} years

Provide a JSON response with:
{
  "skillGap": {
    "missingSkills": [
      {
        "name": "Skill Name",
        "importance": "high/medium/low",
        "difficulty": "high/medium/low",
        "estimatedTime": "time to learn"
      }
    ],
    "existingStrengths": ["strength1", "strength2"],
    "improvementAreas": ["area1", "area2"]
  },
  "recommendations": [
    {
      "action": "Recommended action",
      "priority": "high/medium/low",
      "resources": ["resource1", "resource2"]
    }
  ],
  "timeline": "Estimated time to close the gap"
}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return parseAIResponse(text);
};

const generateRoadmap = async (userId, data) => {
  const { goal, currentLevel, timeframe, preferences } = data;

  if (!process.env.GEMINI_API_KEY) {
    throw new AppError("AI service not configured", 503);
  }

  const model = getGenerativeModel();
  const prompt = `As an AI learning strategist, create a detailed roadmap for achieving a specific goal.

Goal: ${goal}
Current Level: ${currentLevel}
Timeframe: ${timeframe}
Preferences: ${JSON.stringify(preferences || {})}

Provide a JSON response with:
{
  "roadmap": {
    "title": "Roadmap Title",
    "description": "Overview of the roadmap",
    "milestones": [
      {
        "title": "Milestone Title",
        "description": "What to achieve",
        "duration": "estimated time",
        "tasks": ["task1", "task2"],
        "resources": ["resource1", "resource2"]
      }
    ],
    "totalDuration": "total estimated time",
    "difficulty": "high/medium/low"
  },
  "tips": ["tip1", "tip2"],
  "potentialChallenges": ["challenge1", "challenge2"]
}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return parseAIResponse(text);
};

const chat = async (userId, data) => {
  const { message, sessionId, context } = data;

  if (!process.env.GEMINI_API_KEY) {
    throw new AppError("AI service not configured", 503);
  }

  const model = getGenerativeModel();
  const prompt = `You are EduGuide AI, a friendly and knowledgeable career counselor and academic advisor. 
Your role is to help students with career guidance, academic planning, skill development, and educational choices.

${context ? `Context: ${JSON.stringify(context)}` : ""}

Student Message: ${message}

Provide helpful, personalized advice. Be encouraging and provide actionable suggestions.`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  return {
    message: text,
    sessionId: sessionId || `session_${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
};

const analyzeResume = async (userId, data) => {
  const { resumeContent, targetRole, jobDescription } = data;

  if (!process.env.GEMINI_API_KEY) {
    throw new AppError("AI service not configured", 503);
  }

  const model = getGenerativeModel();
  const prompt = `As an AI resume analyst, review the following resume and provide detailed feedback.

Resume Content:
${resumeContent}

${targetRole ? `Target Role: ${targetRole}` : ""}
${jobDescription ? `Job Description: ${jobDescription}` : ""}

Provide a JSON response with:
{
  "overallScore": 0-100,
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "suggestions": [
    {
      "section": "Section Name",
      "suggestion": "Specific improvement",
      "priority": "high/medium/low"
    }
  ],
  "keywordAnalysis": {
    "present": ["keyword1", "keyword2"],
    "missing": ["keyword3", "keyword4"]
  },
  "formattingScore": 0-100,
  "contentScore": 0-100,
  "summary": "Overall summary"
}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return parseAIResponse(text);
};

const simulateFuture = async (userId, data) => {
  const { currentPath, choices, timeframe } = data;

  if (!process.env.GEMINI_API_KEY) {
    throw new AppError("AI service not configured", 503);
  }

  const model = getGenerativeModel();
  const prompt = `As an AI future planner, simulate different career/education paths based on choices.

Current Path: ${currentPath}
Choices to Consider: ${choices.join(", ")}
Timeframe: ${timeframe}

Provide a JSON response with:
{
  "simulations": [
    {
      "choice": "Choice made",
      "outcome": {
        "shortTerm": "What happens in the short term",
        "longTerm": "What happens in the long term",
        "pros": ["pro1", "pro2"],
        "cons": ["con1", "con2"]
      },
      "probability": 0.0-1.0,
      "riskLevel": "high/medium/low"
    }
  ],
  "recommendation": "Best path recommendation",
  "factorsToConsider": ["factor1", "factor2"]
}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return parseAIResponse(text);
};

const analyzeQuiz = async (userId, data) => {
  const { quizId, answers, quizType } = data;

  if (!process.env.GEMINI_API_KEY) {
    throw new AppError("AI service not configured", 503);
  }

  const model = getGenerativeModel();
  const prompt = `As an AI assessment analyst, analyze quiz results and provide insights.

Quiz Type: ${quizType}
Answers: ${JSON.stringify(answers)}

Provide a JSON response with:
{
  "analysis": {
    "personalityTraits": ["trait1", "trait2"],
    "strengths": ["strength1", "strength2"],
    "areasForGrowth": ["area1", "area2"],
    "learningStyle": "visual/auditory/kinesthetic/reading"
  },
  "recommendations": [
    {
      "type": "career/education/skill",
      "title": "Recommendation Title",
      "description": "Detailed recommendation",
      "confidence": 0.0-1.0
    }
  ],
  "insights": "Detailed analysis text"
}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return parseAIResponse(text);
};

const recommendCourses = async (userId, data) => {
  const { skills, interests, level, budget } = data;

  if (!process.env.GEMINI_API_KEY) {
    throw new AppError("AI service not configured", 503);
  }

  const model = getGenerativeModel();
  const prompt = `As an AI course advisor, recommend courses based on student profile.

Skills to Develop: ${skills.join(", ")}
Interests: ${interests.join(", ")}
Current Level: ${level}
Budget: ${budget ? JSON.stringify(budget) : "Not specified"}

Provide a JSON response with:
{
  "courses": [
    {
      "title": "Course Title",
      "provider": "Platform/Provider",
      "description": "Course description",
      "duration": "Course duration",
      "level": "beginner/intermediate/advanced",
      "price": "Price or 'Free'",
      "rating": 0.0-5.0,
      "url": "Course URL if available",
      "skillsCovered": ["skill1", "skill2"]
    }
  ],
  "learningPath": {
    "title": "Suggested Learning Path",
    "description": "Overview of the path",
    "steps": ["step1", "step2", "step3"]
  },
  "alternatives": ["alternative1", "alternative2"]
}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return parseAIResponse(text);
};

const matchJobs = async (userId, data) => {
  const { skills, experience, location, preferences } = data;

  if (!process.env.GEMINI_API_KEY) {
    throw new AppError("AI service not configured", 503);
  }

  const model = getGenerativeModel();
  const prompt = `As an AI job matching specialist, analyze job compatibility based on student profile.

Skills: ${skills.join(", ")}
Experience: ${experience} years
Location: ${location || "Remote/Any"}
Preferences: ${JSON.stringify(preferences || {})}

Provide a JSON response with:
{
  "matches": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "matchScore": 0-100,
      "requiredSkills": ["skill1", "skill2"],
      "matchingSkills": ["skill1"],
      "missingSkills": ["skill3"],
      "salaryRange": "salary range",
      "growthPotential": "high/medium/low"
    }
  ],
  "careerPaths": [
    {
      "title": "Career Path Title",
      "description": "Path description",
      "steps": ["step1", "step2"]
    }
  ],
  "skillRecommendations": ["skill1", "skill2"]
}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return parseAIResponse(text);
};

const compareAndTailorResume = async (userId, { jobDescription }) => {
  const prisma = require("../../config/prisma");

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your-gemini-api-key") {
    throw new AppError("AI service not configured", 503);
  }

  // Fetch full student profile
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: {
        include: {
          academicRecords: true,
          interests: true,
          skills: {
            include: {
              skill: true,
            },
          },
          careerGoals: true,
        },
      },
    },
  });

  if (!user || !user.profile) {
    throw new AppError("Please complete your profile details before using the AI Resume Builder!", 400);
  }

  const { profile } = user;
  const skills = profile.skills.map((s) => `${s.skill.name} (level: ${s.level})`).join(", ");
  const interests = profile.interests.map((i) => i.name).join(", ");
  const goals = profile.careerGoals.map((g) => g.title).join(", ");
  const academics = profile.academicRecords
    .map((r) => `${r.degree} in ${r.fieldOfStudy} at ${r.institution}`)
    .join("; ");

  const model = getGenerativeModel();

  const prompt = `As an expert AI Resume Builder and Career Coach, analyze the student's verified profile data and compare it against the target Job Description. 

Provide a comprehensive match score, identify matching and missing skills, and format a highly professional, beautifully tailored resume pulling strictly from the student's actual education and skill records. DO NOT make up any false education, jobs, or certification entries.

Student Profile:
- Name: ${user.firstName} ${user.lastName}
- Email: ${user.email}
- Academics: ${academics || "Not specified"}
- Verified Skills: ${skills || "None added yet"}
- Personal Interests: ${interests || "None added yet"}
- Career Goals: ${goals || "None specified"}

Target Job Description:
${jobDescription}

Provide a JSON response in the following exact format:
{
  "matchScore": 0-100,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill3", "skill4"],
  "tailoredResume": {
    "summary": "A targeted summary aligned with the job description",
    "education": [
      {
        "degree": "MCA",
        "institution": "CSMU Panvel",
        "period": "2022 - 2024",
        "gpa": "9.5 GPA"
      }
    ],
    "skills": ["skill1", "skill2", "skill5"],
    "experience": [
      {
        "role": "Relevant academic projects or professional roles matching verified profile interests/goals",
        "details": ["Detail bullet point 1", "Detail bullet point 2"]
      }
    ]
  }
}

Ensure the response contains valid JSON ONLY, without markdown block wrap.`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  return parseAIResponse(responseText);
};

const generatePersonalizedNews = async (userId) => {
  const prisma = require("../../config/prisma");

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your-gemini-api-key") {
    throw new AppError("AI service not configured", 503);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: {
        include: {
          academicRecords: true,
          interests: true,
        },
      },
    },
  });

  const field = user?.profile?.academicRecords?.[0]?.fieldOfStudy || "Technology";
  const interests = user?.profile?.interests?.map((i) => i.name).join(", ") || "Software Development";

  const model = getGenerativeModel();

  const prompt = `As a professional tech journalist and industry researcher, write 3 personalized, highly engaging industry news updates, tech trend reports, or career tips tailored for a student in the field of "${field}" with interests in "${interests}".

The articles should feel realistic, premium, educational, and up-to-date.

Provide a JSON response with this exact structure:
{
  "articles": [
    {
      "title": "Article Title",
      "summary": "Brief 2-sentence summary of the news",
      "content": "Full rich text content paragraph for the article",
      "category": "Trends / Career / Technology",
      "industry": "${field}"
    }
  ]
}

Ensure the response contains valid JSON ONLY, without markdown block wrap.`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  let newsData;
  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      newsData = JSON.parse(jsonMatch[0]);
    } else {
      newsData = JSON.parse(responseText);
    }
  } catch (err) {
    console.error("JSON parsing error for news response:", responseText);
    throw new AppError("Failed to generate personalized news. Please try again.", 500);
  }

  const articlesList = [];
  for (const art of newsData.articles) {
    const created = await prisma.knowledgeArticle.create({
      data: {
        title: art.title,
        summary: art.summary,
        content: art.content,
        category: art.category,
        industry: art.industry,
      },
    });
    articlesList.push(created);
  }

  return articlesList;
};

module.exports = {
  getCareerRecommendation,
  getStreamRecommendation,
  analyzeSkillGap,
  generateRoadmap,
  chat,
  analyzeResume,
  simulateFuture,
  analyzeQuiz,
  recommendCourses,
  matchJobs,
  compareAndTailorResume,
  generatePersonalizedNews,
};
