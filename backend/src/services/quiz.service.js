const quizRepository = require("../repositories/quiz.repository");

const createQuiz = async (userId, { title, category, questions, duration }) => {
  const quiz = await quizRepository.create({
    userId,
    title,
    category,
    questions,
    duration: duration || null,
    status: "in_progress",
    startedAt: new Date(),
  });
  return quiz;
};

const getQuizzes = async (userId, category, pagination) => {
  const [quizzes, total] = await Promise.all([
    quizRepository.findByUserId(userId, category, pagination),
    quizRepository.countByUserId(userId, category),
  ]);
  return { quizzes, total };
};

const getQuizById = async (id, userId) => {
  const quiz = await quizRepository.findById(id);
  if (!quiz) {
    const error = new Error("Quiz not found");
    error.statusCode = 404;
    throw error;
  }
  if (quiz.userId !== userId) {
    const error = new Error("Not authorized to access this quiz");
    error.statusCode = 403;
    throw error;
  }
  return quiz;
};

const calculateScore = (answers, questions) => {
  if (!Array.isArray(questions) || !Array.isArray(answers)) {
    return { score: 0, maxScore: 0, details: [] };
  }

  let score = 0;
  let maxScore = 0;
  const details = [];

  for (const question of questions) {
    const points = question.points || 1;
    maxScore += points;

    const answer = answers.find((a) => a.questionId === question.id);
    if (answer && answer.selectedOption === question.correctOption) {
      score += points;
      details.push({
        questionId: question.id,
        correct: true,
        points,
        selectedOption: answer.selectedOption,
      });
    } else {
      details.push({
        questionId: question.id,
        correct: false,
        points: 0,
        selectedOption: answer ? answer.selectedOption : null,
        correctOption: question.correctOption,
      });
    }
  }

  return { score, maxScore, details };
};

const generateAnalysis = (answers, questions, score, maxScore) => {
  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
  const correctCount = answers.filter((a) => {
    const q = questions.find((ques) => ques.id === a.questionId);
    return q && a.selectedOption === q.correctOption;
  }).length;

  let performanceLevel;
  if (percentage >= 90) performanceLevel = "excellent";
  else if (percentage >= 75) performanceLevel = "good";
  else if (percentage >= 60) performanceLevel = "average";
  else if (percentage >= 40) performanceLevel = "below_average";
  else performanceLevel = "poor";

  const categoryBreakdown = {};
  for (const question of questions) {
    const category = question.category || "general";
    if (!categoryBreakdown[category]) {
      categoryBreakdown[category] = { total: 0, correct: 0 };
    }
    categoryBreakdown[category].total += 1;
    const answer = answers.find((a) => a.questionId === question.id);
    if (answer && answer.selectedOption === question.correctOption) {
      categoryBreakdown[category].correct += 1;
    }
  }

  return {
    percentage: Math.round(percentage * 100) / 100,
    correctCount,
    totalQuestions: questions.length,
    performanceLevel,
    categoryBreakdown,
    completedAt: new Date().toISOString(),
  };
};

const submitQuizAnswers = async (id, userId, answers) => {
  const quiz = await quizRepository.findById(id);
  if (!quiz) {
    const error = new Error("Quiz not found");
    error.statusCode = 404;
    throw error;
  }
  if (quiz.userId !== userId) {
    const error = new Error("Not authorized to submit answers for this quiz");
    error.statusCode = 403;
    throw error;
  }
  if (quiz.status === "completed") {
    const error = new Error("Quiz has already been submitted");
    error.statusCode = 400;
    throw error;
  }

  const questions = quiz.questions;
  const { score, maxScore, details } = calculateScore(answers, questions);
  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
  const analysis = generateAnalysis(answers, questions, score, maxScore);

  await quizRepository.update(id, {
    status: "completed",
    totalScore: score,
    maxScore,
    completedAt: new Date(),
  });

  const quizResult = await quizRepository.createResult({
    quizId: id,
    userId,
    score,
    maxScore,
    percentage: Math.round(percentage * 100) / 100,
    answers: details,
    analysis,
  });

  return { quizResult, analysis };
};

const getQuizResults = async (quizId, userId) => {
  const quiz = await quizRepository.findById(quizId);
  if (!quiz) {
    const error = new Error("Quiz not found");
    error.statusCode = 404;
    throw error;
  }
  if (quiz.userId !== userId) {
    const error = new Error("Not authorized to view results for this quiz");
    error.statusCode = 403;
    throw error;
  }

  const results = await quizRepository.findResults(quizId);
  return results;
};

const getUserResults = async (userId, pagination) => {
  const [results, total] = await Promise.all([
    quizRepository.findUserResults(userId, pagination),
    quizRepository.countUserResults(userId),
  ]);
  return { results, total };
};

const { GoogleGenerativeAI } = require("@google/generative-ai");
const prisma = require("../config/prisma");

const generateAIQuiz = async (userId) => {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your-gemini-api-key") {
    throw new Error("AI service is not configured. Please add your GEMINI_API_KEY to the backend .env file!");
  }

  // 1. Fetch user profile
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
    throw new Error("Please complete your profile details before generating an AI quiz!");
  }

  const { profile } = user;
  const skills = profile.skills.map((s) => `${s.skill.name} (level: ${s.level})`).join(", ");
  const interests = profile.interests.map((i) => i.name).join(", ");
  const goals = profile.careerGoals.map((g) => g.title).join(", ");
  const academics = profile.academicRecords
    .map((r) => `${r.degree} in ${r.fieldOfStudy} at ${r.institution}`)
    .join("; ");

  // 2. Instantiate Gemini
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `As an expert AI career counselor and educational assessor, create a highly personalized 5-question multiple choice quiz for this student to test their knowledge, expand their understanding, and assess their skill alignment with their career goals.

Student Context:
- Academic Fields: ${academics || "Not specified"}
- Verified Skills: ${skills || "None added yet"}
- Personal Interests: ${interests || "None added yet"}
- Career Goals: ${goals || "General career growth"}

The questions must be educational, challenging, and directly relevant to the student's skills and goals.

Provide a JSON response in the following exact structure:
{
  "title": "A compelling, personalized title for the quiz",
  "category": "SKILL_ASSESSMENT",
  "questions": [
    {
      "id": "q1",
      "text": "Question text here?",
      "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
      "correctOption": "Option A text",
      "points": 10
    }
  ]
}

Make sure correctOption matches EXACTLY one of the strings in the options array. Ensure the response contains valid JSON ONLY, without markdown block wrap.`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  let quizData;
  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      quizData = JSON.parse(jsonMatch[0]);
    } else {
      quizData = JSON.parse(responseText);
    }
  } catch (err) {
    console.error("JSON parsing error for quiz response:", responseText);
    throw new Error("Failed to generate a valid quiz format from AI. Please try again.");
  }

  // 3. Create the quiz in the database
  const quiz = await prisma.quiz.create({
    data: {
      userId,
      title: quizData.title || "Personalized AI Career Quiz",
      category: "SKILL_ASSESSMENT",
      questions: quizData.questions,
      duration: 10, // Default 10 minutes
      status: "in_progress",
      startedAt: new Date(),
    },
  });

  return quiz;
};

module.exports = {
  createQuiz,
  getQuizzes,
  getQuizById,
  submitQuizAnswers,
  getQuizResults,
  getUserResults,
  calculateScore,
  generateAnalysis,
  generateAIQuiz,
};
