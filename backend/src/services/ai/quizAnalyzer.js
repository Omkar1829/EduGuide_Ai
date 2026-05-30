const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require("../../config");
const prisma = require("../../config/prisma");

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

const QUIZ_ANALYSIS_PROMPT = `You are an expert educational assessment analyst.
Analyze quiz results thoroughly and provide personalized recommendations.
Always return valid JSON matching the requested schema. Do not include markdown fences or extra text.
Base recommendations on the student's actual performance data.`;

async function fetchStudentProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
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
    interests: p.interests.map((i) => ({ name: i.name, category: i.category, level: i.level })),
    careerGoals: p.careerGoals.map((g) => ({ title: g.title, description: g.description })),
    strengths: p.strengths.map((s) => ({ name: s.name, category: s.category })),
    weaknesses: p.weaknesses.map((w) => ({ name: w.name, category: w.category })),
    skills: p.skills.map((s) => ({
      name: s.skill.name,
      category: s.skill.category,
      level: s.level,
    })),
    academics: p.academicRecords.map((ar) => ({
      degree: ar.degree,
      fieldOfStudy: ar.fieldOfStudy,
      gpa: ar.gpa,
      subjects: ar.subjectMarks.map((s) => ({
        name: s.subjectName,
        marks: s.marks,
        grade: s.grade,
      })),
    })),
  };
}

async function callGemini(prompt) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: QUIZ_ANALYSIS_PROMPT,
  });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text().trim();

  if (text.startsWith("```json")) {
    text = text.slice(7);
  } else if (text.startsWith("```")) {
    text = text.slice(3);
  }
  if (text.endsWith("```")) {
    text = text.slice(0, -3);
  }

  return JSON.parse(text.trim());
}

function calculateLocalAnalysis(quiz, result, studentProfile) {
  const questions = quiz.questions || [];
  const answers = result.answers || [];
  const category = quiz.category;

  // Category-wise breakdown
  const categoryBreakdown = {};
  for (const question of questions) {
    const qCategory = question.category || "general";
    if (!categoryBreakdown[qCategory]) {
      categoryBreakdown[qCategory] = {
        total: 0,
        correct: 0,
        score: 0,
        maxScore: 0,
        questions: [],
      };
    }
    categoryBreakdown[qCategory].total += 1;
    const points = question.points || 1;
    categoryBreakdown[qCategory].maxScore += points;

    const answer = answers.find((a) => a.questionId === question.id);
    const isCorrect = answer && answer.selectedOption === question.correctOption;
    if (isCorrect) {
      categoryBreakdown[qCategory].correct += 1;
      categoryBreakdown[qCategory].score += points;
    }

    categoryBreakdown[qCategory].questions.push({
      questionId: question.id,
      correct: isCorrect,
      selectedOption: answer?.selectedOption || null,
      correctOption: question.correctOption,
    });
  }

  // Calculate category scores as percentages
  const categoryScores = {};
  for (const [cat, data] of Object.entries(categoryBreakdown)) {
    categoryScores[cat] = {
      percentage: data.maxScore > 0 ? Math.round((data.score / data.maxScore) * 100 * 100) / 100 : 0,
      correct: data.correct,
      total: data.total,
    };
  }

  // Identify strengths and weaknesses
  const strengths = [];
  const weaknesses = [];
  for (const [cat, data] of Object.entries(categoryScores)) {
    if (data.percentage >= 75) {
      strengths.push({ category: cat, score: data.percentage });
    } else if (data.percentage < 50) {
      weaknesses.push({ category: cat, score: data.percentage });
    }
  }

  // Determine performance level
  const percentage = result.percentage || 0;
  let performanceLevel;
  if (percentage >= 90) performanceLevel = "excellent";
  else if (percentage >= 75) performanceLevel = "good";
  else if (percentage >= 60) performanceLevel = "average";
  else if (percentage >= 40) performanceLevel = "below_average";
  else performanceLevel = "poor";

  // Detect learning style from quiz category
  let learningStyle = "analytical";
  if (category === "CAREER_INTEREST") learningStyle = "exploratory";
  else if (category === "PERSONALITY") learningStyle = "reflective";
  else if (category === "SKILL_ASSESSMENT") learningStyle = "practical";
  else if (category === "APTITUDE") learningStyle = "logical";
  else if (category === "LEARNING_STYLE") learningStyle = "varied";

  return {
    categoryScores,
    strengths,
    weaknesses,
    performanceLevel,
    learningStyle,
    overallPercentage: percentage,
    totalQuestions: questions.length,
    correctAnswers: answers.filter((a) => {
      const q = questions.find((ques) => ques.id === a.questionId);
      return q && a.selectedOption === q.correctOption;
    }).length,
  };
}

async function analyzeQuiz(userId, quiz, result, studentProfile) {
  if (!quiz || !result) {
    throw new Error("Quiz and result data are required");
  }

  const localAnalysis = calculateLocalAnalysis(quiz, result, studentProfile);

  const profileSection = studentProfile
    ? `Student Profile:
${JSON.stringify(studentProfile, null, 2)}`
    : "No student profile available for personalized recommendations.";

  const prompt = `Analyze this quiz result and provide comprehensive recommendations.

Quiz Information:
- Title: ${quiz.title}
- Category: ${quiz.category}
- Total Questions: ${localAnalysis.totalQuestions}
- Correct Answers: ${localAnalysis.correctAnswers}
- Overall Score: ${result.score}/${result.maxScore} (${localAnalysis.overallPercentage}%)

Category-wise Performance:
${JSON.stringify(localAnalysis.categoryScores, null, 2)}

Performance Level: ${localAnalysis.performanceLevel}
Detected Learning Style: ${localAnalysis.learningStyle}

${profileSection}

Return a JSON object with this exact structure:
{
  "analysisSummary": "detailed paragraph about the student's performance",
  "performanceLevel": "excellent | good | average | below_average | poor",
  "learningStyle": "learning style description with evidence",
  "strengthsByCategory": [
    {
      "category": "category name",
      "score": 0-100,
      "description": "why this is a strength",
      "howToLeverage": "how to use this strength"
    }
  ],
  "weaknessesByCategory": [
    {
      "category": "category name",
      "score": 0-100,
      "description": "why this is a weakness",
      "improvementPlan": "specific steps to improve"
    }
  ],
  "careerSuggestions": [
    {
      "title": "career title",
      "matchPercentage": 0-100,
      "reason": "why this career fits based on quiz results",
      "requiredSkills": ["skill1", "skill2"]
    }
  ],
  "courseSuggestions": [
    {
      "title": "course or resource title",
      "provider": "platform or provider",
      "type": "course | book | video | practice",
      "relevance": "how this helps with weak areas",
      "difficulty": "beginner | intermediate | advanced"
    }
  ],
  "skillDevelopmentAreas": [
    {
      "skill": "skill name",
      "currentLevel": "beginner | intermediate | advanced",
      "targetLevel": "intermediate | advanced | expert",
      "suggestedActions": ["action1", "action2"],
      "timeToImprove": "estimated time"
    }
  ],
  "nextSteps": [
    "immediate actionable next step 1",
    "next step 2",
    "next step 3"
  ],
  "reasoning": [
    "reason 1 for recommendations",
    "reason 2"
  ]
}

Base all recommendations on the actual quiz performance and the student's existing profile.
Be specific with course names and providers (e.g., Coursera, Udemy, freeCodeCamp).
Prioritize recommendations that address the weakest categories first.`;

  let analysisResult;
  try {
    analysisResult = await callGemini(prompt);
  } catch (error) {
    console.error("[QuizAnalyzer] Gemini API error:", error.message);
    // Fall back to local analysis only
    analysisResult = {
      analysisSummary: `You scored ${localAnalysis.overallPercentage}% on this ${quiz.category} quiz. Your performance is ${localAnalysis.performanceLevel}.`,
      performanceLevel: localAnalysis.performanceLevel,
      learningStyle: localAnalysis.learningStyle,
      strengthsByCategory: localAnalysis.strengths.map((s) => ({
        category: s.category,
        score: s.score,
        description: `Strong performance in ${s.category}`,
        howToLeverage: `Continue developing ${s.category} skills`,
      })),
      weaknessesByCategory: localAnalysis.weaknesses.map((w) => ({
        category: w.category,
        score: w.score,
        description: `Needs improvement in ${w.category}`,
        improvementPlan: `Focus on practicing ${w.category} questions`,
      })),
      careerSuggestions: [],
      courseSuggestions: [],
      skillDevelopmentAreas: [],
      nextSteps: ["Review weak areas", "Practice more questions", "Seek additional resources"],
      reasoning: ["Recommendations based on local analysis due to API unavailability"],
    };
  }

  // Merge local analysis with Gemini results
  const finalAnalysis = {
    quizId: quiz.id,
    quizTitle: quiz.title,
    quizCategory: quiz.category,
    score: result.score,
    maxScore: result.maxScore,
    percentage: localAnalysis.overallPercentage,
    performanceLevel: analysisResult.performanceLevel || localAnalysis.performanceLevel,
    learningStyle: analysisResult.learningStyle || localAnalysis.learningStyle,
    analysisSummary: analysisResult.analysisSummary || "",
    categoryScores: localAnalysis.categoryScores,
    strengthsByCategory: analysisResult.strengthsByCategory || [],
    weaknessesByCategory: analysisResult.weaknessesByCategory || [],
    careerSuggestions: analysisResult.careerSuggestions || [],
    courseSuggestions: analysisResult.courseSuggestions || [],
    skillDevelopmentAreas: analysisResult.skillDevelopmentAreas || [],
    nextSteps: analysisResult.nextSteps || [],
    reasoning: analysisResult.reasoning || [],
    analyzedAt: new Date().toISOString(),
  };

  // Update the quiz result with the analysis
  await prisma.quizResult.update({
    where: { id: result.id },
    data: {
      analysis: finalAnalysis,
    },
  });

  return finalAnalysis;
}

async function getQuizAnalysis(resultId, userId) {
  const result = await prisma.quizResult.findUnique({
    where: { id: resultId },
    include: { quiz: true },
  });

  if (!result) {
    throw new Error("Quiz result not found");
  }

  if (result.userId !== userId) {
    throw new Error("Not authorized to access this result");
  }

  return {
    result,
    analysis: result.analysis,
  };
}

async function getUserQuizAnalyses(userId) {
  const results = await prisma.quizResult.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { quiz: true },
  });

  return results
    .filter((r) => r.analysis)
    .map((r) => ({
      resultId: r.id,
      quizId: r.quizId,
      quizTitle: r.quiz.title,
      quizCategory: r.quiz.category,
      score: r.score,
      maxScore: r.maxScore,
      percentage: r.percentage,
      analysis: r.analysis,
      createdAt: r.createdAt,
    }));
}

module.exports = {
  analyzeQuiz,
  getQuizAnalysis,
  getUserQuizAnalyses,
};
