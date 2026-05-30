const { GoogleGenerativeAI } = require("@google/generative-ai");
const { v4: uuidv4 } = require("uuid");
const config = require("../../config");
const prisma = require("../../config/prisma");

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

const COUNSELOR_SYSTEM_PROMPT = `You are EduGuide AI Counselor, a friendly and professional AI career counselor for students.
Your role is to provide personalized career guidance, skill development advice, course selection help, and job search support.

Guidelines:
- Be warm, encouraging, and professional
- Base advice on the student's profile data (academic records, skills, interests, career goals, strengths, weaknesses)
- Provide actionable, specific recommendations
- When suggesting courses or resources, be specific with names and providers
- Ask clarifying questions when needed
- Acknowledge limitations and encourage seeking human counsel when appropriate
- Never make up facts or guarantees about job placement
- Always explain your reasoning`;

const CONVERSATION_TYPES = {
  CAREER_GUIDANCE: "career_guidance",
  SKILL_DEVELOPMENT: "skill_development",
  COURSE_SELECTION: "course_selection",
  JOB_SEARCH: "job_search",
  GENERAL: "general",
};

function detectConversationType(message) {
  const lower = message.toLowerCase();
  if (/career|job role|profession|future|become/.test(lower)) return CONVERSATION_TYPES.CAREER_GUIDANCE;
  if (/skill|learn|improve|develop|practice/.test(lower)) return CONVERSATION_TYPES.SKILL_DEVELOPMENT;
  if (/course|class|certification|training|enroll/.test(lower)) return CONVERSATION_TYPES.COURSE_SELECTION;
  if (/job|resume|interview|apply|hiring|salary/.test(lower)) return CONVERSATION_TYPES.JOB_SEARCH;
  return CONVERSATION_TYPES.GENERAL;
}

async function fetchStudentProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      profile: {
        include: {
          academicRecords: { include: { subjectMarks: true } },
          interests: true,
          careerGoals: true,
          strengths: true,
          weaknesses: true,
          skills: { include: { skill: true } },
          certifications: true,
        },
      },
    },
  });

  if (!user || !user.profile) {
    return null;
  }

  const p = user.profile;
  return {
    name: `${user.firstName} ${user.lastName}`,
    interests: p.interests.map((i) => i.name),
    careerGoals: p.careerGoals.map((g) => g.title),
    strengths: p.strengths.map((s) => s.name),
    weaknesses: p.weaknesses.map((w) => w.name),
    skills: p.skills.map((s) => `${s.skill.name} (Level ${s.level})`),
    certifications: p.certifications.map((c) => c.name),
    academics: p.academicRecords.map((ar) => ({
      institution: ar.institution,
      degree: ar.degree,
      fieldOfStudy: ar.fieldOfStudy,
      gpa: ar.gpa,
    })),
    profileComplete: p.profileComplete,
  };
}

function buildSystemPrompt(studentProfile, conversationType) {
  let profileSection = "No student profile data available.";
  if (studentProfile) {
    profileSection = `Student Profile:
Name: ${studentProfile.name}
Interests: ${studentProfile.interests.join(", ") || "Not specified"}
Career Goals: ${studentProfile.careerGoals.join(", ") || "Not specified"}
Strengths: ${studentProfile.strengths.join(", ") || "Not specified"}
Weaknesses: ${studentProfile.weaknesses.join(", ") || "Not specified"}
Skills: ${studentProfile.skills.join(", ") || "None listed"}
Certifications: ${studentProfile.certifications.join(", ") || "None"}
Academic Background: ${JSON.stringify(studentProfile.academics)}
Profile Complete: ${studentProfile.profileComplete}`;
  }

  const typeInstructions = {
    [CONVERSATION_TYPES.CAREER_GUIDANCE]:
      "Focus on career exploration, career paths, industry trends, and aligning student goals with career options. Suggest specific roles and growth paths.",
    [CONVERSATION_TYPES.SKILL_DEVELOPMENT]:
      "Focus on identifying skill gaps, suggesting learning paths, recommending specific resources, and creating skill development plans.",
    [CONVERSATION_TYPES.COURSE_SELECTION]:
      "Focus on recommending courses, certifications, and training programs. Consider the student's current skills and career goals. Suggest platforms and specific course names.",
    [CONVERSATION_TYPES.JOB_SEARCH]:
      "Focus on job search strategies, resume tips, interview preparation, networking advice, and job market insights for the student's target roles.",
    [CONVERSATION_TYPES.GENERAL]:
      "Help with any education or career-related questions. Be supportive and informative.",
  };

  return `${COUNSELOR_SYSTEM_PROMPT}

${profileSection}

Current conversation focus: ${conversationType}
${typeInstructions[conversationType]}

Always reference the student's profile when giving advice. If profile data is missing, ask clarifying questions.
Respond in a conversational tone. Format suggestions as bullet points when listing multiple items.
Keep responses concise but helpful (2-4 paragraphs max).`;
}

async function callGeminiWithHistory(systemPrompt, history, newMessage) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: systemPrompt,
  });

  // Build conversation history for Gemini
  const chatHistory = history.map((msg) => ({
    role: msg.role === "USER" ? "user" : "model",
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({ history: chatHistory });
  const result = await chat.sendMessage(newMessage);
  const response = await result.response;
  return response.text().trim();
}

async function chat(userId, sessionId, message, history = []) {
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    throw new Error("Message is required");
  }

  const studentProfile = await fetchStudentProfile(userId);
  const conversationType = detectConversationType(message);
  const systemPrompt = buildSystemPrompt(studentProfile, conversationType);

  // Save user message
  const userMessage = await prisma.chatHistory.create({
    data: {
      userId,
      sessionId: sessionId || uuidv4(),
      role: "USER",
      content: message.trim(),
      metadata: { conversationType },
    },
  });

  const effectiveSessionId = userMessage.sessionId;

  // Build full history including the message just saved
  const fullHistory = [
    ...history,
    { role: "USER", content: message.trim(), createdAt: new Date().toISOString() },
  ];

  // Call Gemini
  let aiResponse;
  try {
    aiResponse = await callGeminiWithHistory(systemPrompt, fullHistory, message.trim());
  } catch (error) {
    console.error("[AI Counselor] Gemini API error:", error.message);
    aiResponse =
      "I'm sorry, I'm experiencing a temporary issue. Please try again in a moment. In the meantime, feel free to ask your question again and I'll do my best to help.";
  }

  // Generate suggestions based on conversation type
  const suggestions = generateSuggestions(conversationType, studentProfile);

  // Save AI response
  const assistantMessage = await prisma.chatHistory.create({
    data: {
      userId,
      sessionId: effectiveSessionId,
      role: "ASSISTANT",
      content: aiResponse,
      metadata: {
        conversationType,
        suggestions,
      },
    },
  });

  return {
    message: assistantMessage,
    sessionId: effectiveSessionId,
    conversationType,
    suggestions,
    context: {
      profileUsed: !!studentProfile,
      studentName: studentProfile?.name || null,
    },
  };
}

function generateSuggestions(conversationType, profile) {
  const suggestions = [];

  switch (conversationType) {
    case CONVERSATION_TYPES.CAREER_GUIDANCE:
      suggestions.push("What skills do I need for my target career?");
      suggestions.push("Can you suggest a career roadmap?");
      suggestions.push("What are the job prospects in my field?");
      break;
    case CONVERSATION_TYPES.SKILL_DEVELOPMENT:
      suggestions.push("What skills should I prioritize?");
      suggestions.push("Suggest courses for my skill gaps");
      suggestions.push("How long will it take to learn [skill]?");
      break;
    case CONVERSATION_TYPES.COURSE_SELECTION:
      suggestions.push("Compare online learning platforms");
      suggestions.push("What certifications are most valuable?");
      suggestions.push("Recommend beginner-friendly courses");
      break;
    case CONVERSATION_TYPES.JOB_SEARCH:
      suggestions.push("Help me improve my resume");
      suggestions.push("How should I prepare for interviews?");
      suggestions.push("What companies hire for my role?");
      break;
    default:
      suggestions.push("Tell me about career options in my field");
      suggestions.push("How can I improve my profile?");
      suggestions.push("What should I focus on next?");
  }

  return suggestions;
}

async function getSessionHistory(userId, sessionId) {
  const messages = await prisma.chatHistory.findMany({
    where: { userId, sessionId },
    orderBy: { createdAt: "asc" },
  });
  return messages;
}

async function getUserSessions(userId) {
  const sessions = await prisma.chatHistory.groupBy({
    by: ["sessionId"],
    where: { userId },
    _count: { id: true },
    _max: { createdAt: true },
    _min: { createdAt: true },
    orderBy: { sessionId: "desc" },
  });

  return sessions.map((s) => ({
    sessionId: s.sessionId,
    messageCount: s._count.id,
    lastMessageAt: s._max.createdAt,
    firstMessageAt: s._min.createdAt,
  }));
}

async function deleteSession(userId, sessionId) {
  const result = await prisma.chatHistory.deleteMany({
    where: { userId, sessionId },
  });
  return { deletedCount: result.count };
}

async function clearHistory(userId) {
  const result = await prisma.chatHistory.deleteMany({
    where: { userId },
  });
  return { deletedCount: result.count };
}

module.exports = {
  chat,
  getSessionHistory,
  getUserSessions,
  deleteSession,
  clearHistory,
  CONVERSATION_TYPES,
};
