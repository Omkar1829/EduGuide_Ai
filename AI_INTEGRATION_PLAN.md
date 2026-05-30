# EduGuide AI - AI Integration Plan

## Overview

Deep AI integration using Google Gemini API. AI handles 40-50% of platform intelligence including recommendations, analysis, chat, and career guidance.

---

## AI Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     GEMINI API (Google AI Studio)                │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AI SERVICE LAYER                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  backend/src/services/ai/                                │  │
│  │  ├── geminiClient.js          # Gemini API wrapper       │  │
│  │  ├── promptTemplates.js       # All prompt templates     │  │
│  │  ├── responseParser.js        # Parse AI responses       │  │
│  │  ├── careerRecommendation.js  # Career engine            │  │
│  │  ├── streamRecommendation.js  # Stream engine            │  │
│  │  ├── skillGapAnalyzer.js      # Skill gap analysis       │  │
│  │  ├── roadmapGenerator.js      # Roadmap generation       │  │
│  │  ├── aiCounselor.js           # Chat AI                  │  │
│  │  ├── resumeAnalyzer.js        # Resume analysis          │  │
│  │  ├── futureSimulator.js       # Future path simulation   │  │
│  │  ├── quizAnalyzer.js          # Quiz analysis            │  │
│  │  ├── courseRecommender.js     # Course recommendations   │  │
│  │  └── jobMatcher.js            # Job matching             │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AI API ROUTES                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  backend/src/routes/ai.routes.js                         │  │
│  │  POST /api/ai/career-recommendation                      │  │
│  │  POST /api/ai/stream-recommendation                      │  │
│  │  POST /api/ai/skill-gap                                  │  │
│  │  POST /api/ai/roadmap-generate                           │  │
│  │  POST /api/ai/chat                                       │  │
│  │  POST /api/ai/resume-analyze                             │  │
│  │  POST /api/ai/future-simulate                            │  │
│  │  POST /api/ai/quiz-analyze                               │  │
│  │  POST /api/ai/course-recommend                           │  │
│  │  POST /api/ai/job-match                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND AI DASHBOARD                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Career Score │ Recommendations │ Skill Gap │ Roadmap    │  │
│  │  AI Chat │ Resume Analysis │ Future Simulator            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## AI Services Detail

### 1. Career Recommendation Engine

**Purpose:** Recommend careers based on profile, skills, interests, and academic records.

**Input Data:**
- StudentProfile (academic records, interests, strengths, weaknesses)
- StudentSkill (skills with levels)
- CareerGoal (target careers)
- QuizResult (career interest quizzes)

**Output Format:**
```json
{
  "recommendations": [
    {
      "career": "Software Engineer",
      "confidence": 0.87,
      "reasoning": [
        "Strong programming skills (8/10)",
        "Interest in technology aligns with this career",
        "Academic background in computer science"
      ],
      "requiredSkills": ["JavaScript", "React", "Node.js"],
      "missingSkills": ["Docker", "Kubernetes"],
      "salaryRange": "₹6-15 LPA",
      "growthOutlook": "High"
    }
  ]
}
```

**Prompt Template:**
```
You are an expert career counselor. Analyze the following student profile and recommend top 3 careers.

Student Profile:
- Academic: {academicRecords}
- Skills: {skills}
- Interests: {interests}
- Strengths: {strengths}
- Weaknesses: {weaknesses}
- Career Goals: {careerGoals}

Return JSON with recommendations array. Each recommendation must include:
- career (string)
- confidence (0-1)
- reasoning (array of strings explaining why)
- requiredSkills (array)
- missingSkills (array)
- salaryRange (string)
- growthOutlook (string)

Never return recommendations without explaining the reasoning.
```

---

### 2. Stream Recommendation Engine

**Purpose:** Recommend educational streams (Science, Commerce, Arts, etc.) based on profile.

**Input Data:**
- AcademicRecord (grades, subjects)
- Interest (categories)
- QuizResult (aptitude, personality)
- Strength/Weakness

**Output Format:**
```json
{
  "streams": [
    {
      "stream": "Computer Science",
      "confidence": 0.92,
      "reasoning": ["Excellent math scores", "Strong logical thinking"],
      "relatedFields": ["Software Engineering", "Data Science", "AI/ML"],
      "topColleges": ["IIT Bombay", "IIT Delhi", "NIT Trichy"]
    }
  ]
}
```

---

### 3. Skill Gap Analyzer

**Purpose:** Identify gaps between current skills and required skills for target career.

**Input Data:**
- StudentSkill (current skills with levels)
- TargetCareer (from career goals or recommendation)
- Course (enrolled courses)

**Output Format:**
```json
{
  "currentSkills": [
    { "skill": "JavaScript", "level": 8, "required": 7, "status": "sufficient" }
  ],
  "missingSkills": [
    { "skill": "Docker", "level": 0, "required": 6, "priority": "high" }
  ],
  "gapScore": 35,
  "improvementPlan": [
    { "skill": "Docker", "action": "Take course", "estimatedTime": "2 weeks" }
  ]
}
```

---

### 4. Roadmap Generator

**Purpose:** Generate step-by-step career roadmap with milestones.

**Input Data:**
- TargetCareer
- CurrentSkills
- AcademicBackground
- Timeline (optional)

**Output Format:**
```json
{
  "roadmap": {
    "title": "Software Engineer Roadmap",
    "phases": [
      {
        "name": "Foundation",
        "duration": "3 months",
        "tasks": [
          { "task": "Learn HTML/CSS/JS", "priority": "high", "resources": ["freeCodeCamp"] },
          { "task": "Build 3 projects", "priority": "high", "resources": [] }
        ],
        "milestone": "Build first web application"
      }
    ]
  }
}
```

---

### 5. AI Counselor Chat

**Purpose:** Conversational AI for career guidance and doubt clearing.

**Input Data:**
- ChatHistory (previous messages)
- StudentProfile (context)
- UserMessage (current query)

**Output Format:**
```json
{
  "response": "Based on your profile...",
  "suggestions": ["Take a quiz", "Explore courses"],
  "context": "career-guidance",
  "confidence": 0.95
}
```

**System Prompt:**
```
You are EduGuide AI Counselor, an expert career guidance assistant.

Student Context:
- Name: {user.firstName}
- Skills: {profile.skills}
- Interests: {profile.interests}
- Career Goals: {profile.careerGoals}

Rules:
1. Always base advice on student's actual profile data
2. Never make up facts or statistics
3. If unsure, suggest the student consult a human counselor
4. Be encouraging and supportive
5. Provide actionable next steps
6. Keep responses concise but helpful
```

---

### 6. Resume Analyzer

**Purpose:** Analyze resume and provide feedback with improvement suggestions.

**Input Data:**
- ResumeContent (parsed from uploaded file)
- StudentProfile (for comparison)

**Output Format:**
```json
{
  "score": 72,
  "strengths": ["Strong technical skills", "Good project descriptions"],
  "weaknesses": ["Missing quantified achievements", "No certifications listed"],
  "suggestions": [
    { "section": "Experience", "suggestion": "Add numbers and metrics" },
    { "section": "Skills", "suggestion": "Add Docker and Kubernetes" }
  ],
  "atsScore": 85,
  "keywords": ["JavaScript", "React", "Node.js"],
  "missingKeywords": ["CI/CD", "AWS", "Docker"]
}
```

---

### 7. Future Path Simulator

**Purpose:** Simulate career outcomes based on different choices.

**Input Data:**
- CurrentProfile
- PossiblePaths (array of career choices)
- Timeline

**Output Format:**
```json
{
  "paths": [
    {
      "path": "Software Engineer",
      "timeline": "2 years",
      "probability": 0.85,
      "milestones": [...],
      "salaryProgression": ["₹4L", "₹6L", "₹10L", "₹15L"],
      "risks": ["Market competition"],
      "opportunities": ["Remote work", "Freelancing"]
    }
  ]
}
```

---

### 8. Quiz Analysis Engine

**Purpose:** Analyze quiz results and provide insights.

**Input Data:**
- Quiz (questions, category)
- QuizResult (answers, score)

**Output Format:**
```json
{
  "analysis": {
    "performanceLevel": "Good",
    "strengths": ["Logical reasoning", "Technical aptitude"],
    "weaknesses": ["Verbal ability"],
    "recommendations": [
      { "type": "course", "title": "Improve Communication Skills" },
      { "type": "career", "title": "Consider Data Analysis" }
    ],
    "detailedBreakdown": {...}
  }
}
```

---

### 9. Course Recommendation Engine

**Purpose:** Recommend courses based on skill gaps and career goals.

**Input Data:**
- StudentSkill (current skills)
- TargetCareer
- Course catalog

**Output Format:**
```json
{
  "recommendations": [
    {
      "course": "Advanced React",
      "reason": "Fill skill gap for Frontend Developer",
      "priority": "high",
      "estimatedTime": "4 weeks",
      "provider": "Coursera"
    }
  ]
}
```

---

### 10. Job Matching Engine

**Purpose:** Match jobs to student profile and rank by fit.

**Input Data:**
- StudentProfile
- StudentSkill
- Job listings

**Output Format:**
```json
{
  "matches": [
    {
      "job": "Frontend Developer",
      "company": "TechCorp",
      "matchScore": 0.89,
      "matchedSkills": ["JavaScript", "React"],
      "missingSkills": ["TypeScript"],
      "reasoning": "Strong match based on frontend skills"
    }
  ]
}
```

---

## API Routes

### AI Routes (`/api/ai`)

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/ai/career-recommendation` | POST | Get career recommendations | Yes |
| `/ai/stream-recommendation` | POST | Get stream recommendations | Yes |
| `/ai/skill-gap` | POST | Analyze skill gaps | Yes |
| `/ai/roadmap-generate` | POST | Generate career roadmap | Yes |
| `/ai/chat` | POST | Send message to AI counselor | Yes |
| `/ai/resume-analyze` | POST | Analyze uploaded resume | Yes |
| `/ai/future-simulate` | POST | Simulate career paths | Yes |
| `/ai/quiz-analyze` | POST | Analyze quiz results | Yes |
| `/ai/course-recommend` | POST | Get course recommendations | Yes |
| `/ai/job-match` | POST | Get job matches | Yes |

---

## Frontend Integration

### AI Dashboard Components

| Component | AI Service | Data Displayed |
|-----------|------------|----------------|
| CareerScoreGauge | career-recommendation | Career compatibility score |
| SkillGapChart | skill-gap | Current vs required skills |
| RoadmapPreview | roadmap-generate | Career roadmap timeline |
| ChatWidget | chat | AI counselor conversation |
| ResumeAnalysisCard | resume-analyze | Resume score and feedback |
| FutureSimulator | future-simulate | Career path projections |
| CourseRecommendations | course-recommend | Recommended courses |
| JobMatches | job-match | Matched jobs with scores |

---

## File Structure

### Backend AI Files
```
backend/src/services/ai/
├── geminiClient.js              # Gemini API wrapper
├── promptTemplates.js           # All prompt templates
├── responseParser.js            # Parse and validate AI responses
├── careerRecommendation.js      # Career recommendation engine
├── streamRecommendation.js      # Stream recommendation engine
├── skillGapAnalyzer.js          # Skill gap analysis
├── roadmapGenerator.js          # Roadmap generation
├── aiCounselor.js               # AI chat service
├── resumeAnalyzer.js            # Resume analysis
├── futureSimulator.js           # Future path simulation
├── quizAnalyzer.js              # Quiz analysis
├── courseRecommender.js         # Course recommendations
└── jobMatcher.js                # Job matching

backend/src/routes/
├── ai.routes.js                 # AI API routes

backend/src/controllers/
├── ai.controller.js             # AI HTTP handlers
```

### Frontend AI Files
```
frontend/src/services/
├── aiService.js                 # AI API calls

frontend/src/store/slices/
├── aiSlice.js                   # AI Redux state

frontend/src/features/ai/
├── CareerRecommendation.jsx
├── SkillGapAnalysis.jsx
├── RoadmapGenerator.jsx
├── AIChat.jsx
├── ResumeAnalyzer.jsx
├── FutureSimulator.jsx
├── QuizAnalysis.jsx
├── CourseRecommendations.jsx
└── JobMatches.jsx
```

---

## Implementation Order

| Phase | Service | Priority |
|-------|---------|----------|
| 1 | Gemini Client + Prompt Templates | Critical |
| 2 | Career Recommendation | High |
| 3 | Skill Gap Analyzer | High |
| 4 | Roadmap Generator | High |
| 5 | AI Counselor Chat | High |
| 6 | Quiz Analyzer | Medium |
| 7 | Course Recommender | Medium |
| 8 | Job Matcher | Medium |
| 9 | Resume Analyzer | Medium |
| 10 | Future Simulator | Low |

---

## Error Handling

- All AI services wrap calls in try-catch
- Fallback responses for API failures
- Rate limiting for Gemini API calls
- Caching for repeated requests
- Logging for debugging

---

## Security Rules

1. Never expose Gemini API key to frontend
2. Validate all inputs before sending to AI
3. Sanitize AI responses before storing
4. Rate limit AI endpoints
5. Cache frequent requests
6. Log all AI interactions for audit

---

*Generated: May 29, 2026*
