const HARMFUL_PATTERNS = [
  /<script[\s>]/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /data:text\/html/gi,
  /vbscript:/gi,
  /expression\s*\(/gi,
  /eval\s*\(/gi,
  /document\.(cookie|write)/gi,
  /window\.(location|open)/gi,
];

const parseJSON = (text) => {
  if (!text || typeof text !== "string") {
    throw new Error("Input must be a non-empty string");
  }

  let cleaned = text.trim();

  const jsonBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonBlockMatch) {
    cleaned = jsonBlockMatch[1].trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch (firstError) {
    const jsonStart = cleaned.indexOf("{");
    const jsonArrayStart = cleaned.indexOf("[");
    const startIndex =
      jsonStart === -1
        ? jsonArrayStart
        : jsonArrayStart === -1
          ? jsonStart
          : Math.min(jsonStart, jsonArrayStart);

    if (startIndex === -1) {
      throw new Error("No JSON found in response");
    }

    const jsonEnd = cleaned.lastIndexOf("}");
    const jsonArrayEnd = cleaned.lastIndexOf("]");
    const endIndex =
      jsonEnd === -1
        ? jsonArrayEnd
        : jsonArrayEnd === -1
          ? jsonEnd
          : Math.max(jsonEnd, jsonArrayEnd);

    if (endIndex === -1 || endIndex < startIndex) {
      throw new Error("Could not determine JSON boundaries");
    }

    const substring = cleaned.substring(startIndex, endIndex + 1);
    try {
      return JSON.parse(substring);
    } catch (secondError) {
      throw new Error(`Failed to parse JSON: ${firstError.message}`);
    }
  }
};

const validateRecommendation = (data) => {
  const errors = [];

  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Data must be an object"] };
  }

  if (!Array.isArray(data.recommendations)) {
    errors.push("recommendations must be an array");
  } else {
    data.recommendations.forEach((rec, index) => {
      if (!rec.title || typeof rec.title !== "string") {
        errors.push(`recommendation[${index}].title must be a non-empty string`);
      }
      if (!rec.description || typeof rec.description !== "string") {
        errors.push(`recommendation[${index}].description must be a non-empty string`);
      }
      if (typeof rec.confidence !== "number" || rec.confidence < 0 || rec.confidence > 1) {
        errors.push(`recommendation[${index}].confidence must be a number between 0 and 1`);
      }
      if (!rec.reasoning || typeof rec.reasoning !== "string") {
        errors.push(`recommendation[${index}].reasoning must be a non-empty string`);
      }
    });
  }

  return { valid: errors.length === 0, errors };
};

const validateSkillGap = (data) => {
  const errors = [];

  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Data must be an object"] };
  }

  if (typeof data.gapScore !== "number" || data.gapScore < 0 || data.gapScore > 100) {
    errors.push("gapScore must be a number between 0 and 100");
  }

  if (!Array.isArray(data.matchedSkills)) {
    errors.push("matchedSkills must be an array");
  }

  if (!Array.isArray(data.missingSkills)) {
    errors.push("missingSkills must be an array");
  } else {
    data.missingSkills.forEach((skill, index) => {
      if (!skill.skillName || typeof skill.skillName !== "string") {
        errors.push(`missingSkills[${index}].skillName must be a non-empty string`);
      }
      if (!["critical", "important", "nice-to-have"].includes(skill.priority)) {
        errors.push(`missingSkills[${index}].priority must be critical, important, or nice-to-have`);
      }
    });
  }

  return { valid: errors.length === 0, errors };
};

const validateRoadmap = (data) => {
  const errors = [];

  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Data must be an object"] };
  }

  const roadmap = data.roadmap || data;

  if (!roadmap.title || typeof roadmap.title !== "string") {
    errors.push("roadmap.title must be a non-empty string");
  }

  if (!Array.isArray(roadmap.phases)) {
    errors.push("roadmap.phases must be an array");
  } else {
    roadmap.phases.forEach((phase, index) => {
      if (!phase.title || typeof phase.title !== "string") {
        errors.push(`roadmap.phases[${index}].title must be a non-empty string`);
      }
      if (!Array.isArray(phase.milestones)) {
        errors.push(`roadmap.phases[${index}].milestones must be an array`);
      }
    });
  }

  return { valid: errors.length === 0, errors };
};

const sanitizeResponse = (data) => {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === "string") {
    let sanitized = data;
    for (const pattern of HARMFUL_PATTERNS) {
      sanitized = sanitized.replace(pattern, "");
    }
    return sanitized;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeResponse(item));
  }

  if (typeof data === "object") {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeResponse(value);
    }
    return sanitized;
  }

  return data;
};

const fallbackResponses = {
  career: {
    recommendations: [
      {
        title: "General Career Exploration Recommended",
        description: "Based on limited profile data, we recommend exploring multiple career paths through informational interviews, internships, and career assessments.",
        confidence: 0.3,
        reasoning: "Insufficient profile data for specific recommendations. Complete your profile for personalized guidance.",
        requiredSkills: [],
        growthPotential: "medium",
        salaryRange: "Varies by industry",
        industry: "General",
        entryRequirements: "Complete profile for specific requirements",
      },
    ],
    summary: "Please complete your profile for more accurate career recommendations.",
    topAdvice: "Take time to explore your interests and complete your student profile.",
  },
  stream: {
    recommendations: [
      {
        streamName: "General Studies",
        description: "A broad-based program that allows exploration of multiple disciplines before choosing a specialization.",
        confidence: 0.3,
        reasoning: "Limited data available for specific stream recommendations.",
        relatedCareers: ["Various careers depending on specialization"],
        keySubjects: ["Multiple disciplines"],
        difficultyLevel: "medium",
        duration: "1-2 years",
        institution: "Universities and colleges",
      },
    ],
    academicAnalysis: "Complete your academic records for detailed analysis.",
    overallAdvice: "Focus on building a strong foundation in core subjects.",
  },
  skillGap: {
    targetCareer: "Not specified",
    gapScore: 50,
    matchedSkills: [],
    missingSkills: [],
    summary: "Complete your profile and specify a target career for skill gap analysis.",
    immediateActions: ["Add skills to your profile", "Define a target career"],
    longTermPlan: "Build foundational skills while exploring career interests.",
  },
  roadmap: {
    roadmap: {
      title: "Career Exploration Roadmap",
      totalDuration: "Self-paced",
      phases: [
        {
          phaseNumber: 1,
          title: "Self-Discovery",
          duration: "1-2 months",
          description: "Explore your interests, strengths, and career options.",
          milestones: [
            {
              title: "Complete Career Assessment",
              description: "Take career interest and personality assessments",
              deadline: "Week 2",
              tasks: ["Complete career quiz", "Reflect on interests"],
              resources: ["Career assessment tools"],
            },
          ],
          challenges: ["Finding time for self-reflection"],
          successCriteria: "Clear understanding of interests and strengths",
        },
      ],
      keySkills: ["Self-awareness", "Research", "Communication"],
      estimatedCost: "Minimal",
      jobSearchStrategy: "Explore and learn first, then plan job search strategy",
    },
  },
  resume: {
    overallScore: 0,
    sections: {},
    strengths: [],
    improvements: ["Upload a resume for analysis"],
    atsCompatibility: { score: 0, issues: [], suggestions: [] },
    keywords: { found: [], missing: [], recommended: [] },
    rewriteSuggestions: [],
    summary: "Please upload a resume for detailed analysis.",
  },
  quiz: {
    overallScore: 0,
    performance: { strengths: [], weaknesses: [], topics: [] },
    insights: { learningStyle: "unknown", personalityTraits: [], aptitudeAreas: [], workStyle: "unknown" },
    recommendations: [],
    careerAlignment: [],
    summary: "Take a quiz to receive personalized insights.",
  },
  course: {
    recommendations: [],
    totalEstimatedCost: "Unknown",
    totalEstimatedTime: "Unknown",
    priorityOrder: [],
    studyPlan: "Complete skill gap analysis first to receive course recommendations.",
  },
  jobMatch: {
    matches: [],
    topMatches: [],
    skillDemandAnalysis: { mostDemandedSkills: [], marketGap: "" },
    recommendation: "Complete your profile to receive job matching recommendations.",
  },
};

const fallbackResponse = (type) => {
  return fallbackResponses[type] || { error: `Unknown response type: ${type}` };
};

module.exports = {
  parseJSON,
  validateRecommendation,
  validateSkillGap,
  validateRoadmap,
  sanitizeResponse,
  fallbackResponse,
};
