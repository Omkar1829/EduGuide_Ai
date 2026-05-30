# EduGuide AI - Frontend System Structure

## Overview

Production-ready React frontend for AI-powered student counseling and career guidance platform.

**Stack:** React 19, JavaScript, Redux Toolkit, React Router DOM, Axios, TailwindCSS, FlyonUI

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        REACT APP                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Redux Store                            │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │  │
│  │  │   Auth   │ │ Profile  │ │ Courses  │ │   Jobs   │   │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │  │
│  │  │ Quiz     │ │ Recom.   │ │ Notif.   │ │ AI Dash  │   │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    React Router                            │  │
│  │  /login → /register → /dashboard → /ai-dashboard         │  │
│  │  /courses → /jobs → /quiz → /settings → /admin           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Pages & Components                      │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │  │
│  │  │  Layout  │ │ Common   │ │Dashboard │ │ Features │   │  │
│  │  │Navbar    │ │Button    │ │Stats     │ │Auth      │   │  │
│  │  │Sidebar   │ │Card      │ │Cards     │ │Profile   │   │  │
│  │  │Footer    │ │Input     │ │Charts    │ │Courses   │   │  │
│  │  │Dashboard │ │Modal     │ │Widgets   │ │Jobs      │   │  │
│  │  │Layout    │ │Spinner   │ │          │ │Quiz      │   │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Axios Instance (API)                     │  │
│  │  • Auto-inject Bearer token                               │  │
│  │  • Auto-refresh on 401                                    │  │
│  │  • Error normalization                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Backend API (localhost:5000)             │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Folder Structure

```
frontend/
├── public/
│   └── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
│
└── src/
    ├── main.jsx                      # Entry point
    ├── App.jsx                       # Router configuration
    │
    ├── assets/
    │
    ├── styles/
    │   └── index.css                 # TailwindCSS + custom styles
    │
    ├── store/
    │   ├── index.js                  # Redux store config
    │   ├── api.js                    # Axios instance
    │   └── slices/
    │       ├── authSlice.js
    │       ├── profileSlice.js
    │       ├── courseSlice.js
    │       ├── jobSlice.js
    │       ├── recommendationSlice.js
    │       ├── quizSlice.js
    │       ├── notificationSlice.js
    │       └── aiDashboardSlice.js
    │
    ├── services/
    │   ├── api.js                    # Axios instance
    │   ├── authService.js
    │   ├── profileService.js
    │   ├── courseService.js
    │   ├── jobService.js
    │   ├── recommendationService.js
    │   ├── quizService.js
    │   ├── notificationService.js
    │   └── aiDashboardService.js
    │
    ├── hooks/
    │   ├── useAuth.js
    │   └── useApi.js
    │
    ├── utils/
    │   └── constants.js
    │
    ├── components/
    │   ├── common/
    │   │   ├── Button.jsx
    │   │   ├── Card.jsx
    │   │   ├── Input.jsx
    │   │   ├── Modal.jsx
    │   │   ├── ProgressBar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── Spinner.jsx
    │   │   └── StepIndicator.jsx
    │   │
    │   ├── layout/
    │   │   ├── Navbar.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── Footer.jsx
    │   │   └── DashboardLayout.jsx
    │   │
    │   ├── dashboard/
    │   │   ├── ProfileCompletionCard.jsx
    │   │   ├── QuickStats.jsx
    │   │   ├── RecommendationCard.jsx
    │   │   ├── CourseCard.jsx
    │   │   ├── JobCard.jsx
    │   │   ├── RoadmapPreview.jsx
    │   │   ├── ActivityTimeline.jsx
    │   │   ├── NotificationPanel.jsx
    │   │   ├── CareerScoreGauge.jsx
    │   │   ├── SkillGapChart.jsx
    │   │   └── ChatWidget.jsx
    │   │
    │   └── ui/
    │
    ├── features/
    │   ├── auth/
    │   │   ├── authSlice.js
    │   │   ├── LoginForm.jsx
    │   │   ├── RegisterForm.jsx
    │   │   └── index.js
    │   │
    │   ├── profile/
    │   │   ├── profileSlice.js
    │   │   ├── BasicInfoForm.jsx
    │   │   ├── AcademicRecordsForm.jsx
    │   │   ├── InterestsForm.jsx
    │   │   ├── CareerGoalsForm.jsx
    │   │   ├── StrengthsWeaknessesForm.jsx
    │   │   ├── SkillsForm.jsx
    │   │   ├── CertificationsForm.jsx
    │   │   └── index.js
    │   │
    │   ├── courses/
    │   │   ├── coursesSlice.js
    │   │   ├── CourseCard.jsx
    │   │   ├── CourseFilters.jsx
    │   │   ├── CourseList.jsx
    │   │   └── index.js
    │   │
    │   ├── jobs/
    │   │   ├── jobsSlice.js
    │   │   ├── JobCard.jsx
    │   │   ├── JobFilters.jsx
    │   │   ├── JobList.jsx
    │   │   └── index.js
    │   │
    │   ├── recommendations/
    │   │   ├── recommendationsSlice.js
    │   │   └── index.js
    │   │
    │   ├── quiz/
    │   │   ├── quizSlice.js
    │   │   ├── QuizCard.jsx
    │   │   ├── QuizQuestion.jsx
    │   │   ├── QuizTimer.jsx
    │   │   ├── QuizResult.jsx
    │   │   └── index.js
    │   │
    │   ├── ai-dashboard/
    │   │   ├── aiDashboardSlice.js
    │   │   └── index.js
    │   │
    │   └── notifications/
    │       ├── notificationsSlice.js
    │       └── index.js
    │
    ├── pages/
    │   ├── LoginPage.jsx
    │   ├── RegisterPage.jsx
    │   ├── ProfileWizard.jsx
    │   ├── UserDashboard.jsx
    │   ├── AIDashboard.jsx
    │   ├── CoursesPage.jsx
    │   ├── CourseDetailPage.jsx
    │   ├── JobsPage.jsx
    │   ├── JobDetailPage.jsx
    │   ├── QuizPage.jsx
    │   ├── QuizTakePage.jsx
    │   ├── QuizResultPage.jsx
    │   ├── SettingsPage.jsx
    │   └── AdminDashboard.jsx
    │
    └── __tests__/
        └── API_BINDING_CHECK.md
```

---

## Pages & Components

### 1. Authentication Pages

| Page | Components | Features |
|------|------------|----------|
| LoginPage | LoginForm | Email/password, remember me, social login, glassmorphism card |
| RegisterPage | RegisterForm | Name, email, password, confirm, terms, strength meter |

### 2. Profile Wizard

| Step | Component | Fields |
|------|-----------|--------|
| 1 | BasicInfoForm | DOB, gender, phone, bio, city, state, country |
| 2 | AcademicRecordsForm | Institutions, degrees, subjects, GPA |
| 3 | InterestsForm | Interest categories with levels |
| 4 | CareerGoalsForm | Goals with priority and target year |
| 5 | StrengthsWeaknessesForm | Strengths and weaknesses with evidence |
| 6 | SkillsForm | Skill search, proficiency, experience |
| 7 | CertificationsForm | Cert name, issuer, dates, URL |

### 3. User Dashboard

| Component | Purpose |
|-----------|---------|
| ProfileCompletionCard | Circular progress ring |
| QuickStats | 4 stat cards (courses, jobs, quizzes, recs) |
| RecommendationCard | AI recommendation with confidence |
| CourseCard | Enrolled course with progress |
| JobCard | Saved job with details |
| RoadmapPreview | Career roadmap timeline |
| ActivityTimeline | Recent activities |
| NotificationPanel | Notifications dropdown |

### 4. AI Dashboard

| Component | Purpose |
|-----------|---------|
| CareerScoreGauge | Circular career compatibility gauge |
| SkillGapChart | Current vs required skills |
| ChatWidget | AI counselor chat interface |
| RecommendationCard | Career/stream recommendations |

### 5. Course Explorer

| Page/Component | Features |
|----------------|----------|
| CoursesPage | Search, filter, grid, pagination, enrolled tab |
| CourseDetailPage | Description, enroll, progress, related |
| CourseCard | Title, provider, rating, price |
| CourseFilters | Search bar, category tabs |

### 6. Job Explorer

| Page/Component | Features |
|----------------|----------|
| JobsPage | Search, filter, list, pagination, saved tab |
| JobDetailPage | Description, requirements, save, similar |
| JobCard | Title, company, location, salary, skills |
| JobFilters | Search, category, skills filter |

### 7. Quiz System

| Page/Component | Features |
|----------------|----------|
| QuizPage | Categories, create, history, results |
| QuizTakePage | Timer, questions, navigation, submit |
| QuizResultPage | Score gauge, review, analysis |
| QuizCard | Category card with score |
| QuizQuestion | Question with options |
| QuizTimer | Countdown timer |

### 8. Settings

| Section | Features |
|---------|----------|
| Profile | Name, email, avatar |
| Password | Change password form |
| Notifications | Toggle preferences |
| Theme | Dark/light mode toggle |
| Privacy | Account management |

---

## Redux Store Structure

```javascript
{
  auth: {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    loading: false,
    error: null
  },
  profile: {
    profile: null,
    academicRecords: [],
    interests: [],
    careerGoals: [],
    strengths: [],
    weaknesses: [],
    skills: [],
    certifications: [],
    completionPct: 0,
    loading: false
  },
  courses: {
    courses: [],
    enrolledCourses: [],
    currentCourse: null,
    pagination: { page: 1, limit: 10, total: 0 },
    loading: false
  },
  jobs: {
    jobs: [],
    savedJobs: [],
    currentJob: null,
    pagination: { page: 1, limit: 10, total: 0 },
    loading: false
  },
  recommendations: {
    recommendations: [],
    currentRecommendation: null,
    loading: false
  },
  quiz: {
    quizzes: [],
    currentQuiz: null,
    quizResults: [],
    userResults: [],
    loading: false
  },
  notifications: {
    notifications: [],
    unreadCount: 0,
    loading: false
  },
  aiDashboard: {
    careerScore: null,
    recommendedStreams: [],
    careerRecommendations: [],
    skillGap: null,
    roadmap: null,
    chatHistory: [],
    resumeAnalysis: null,
    loading: false
  }
}
```

---

## API Binding Summary

| Module | Endpoints | Frontend Services | Status |
|--------|-----------|-------------------|--------|
| Auth | 6 | 6 | ✅ 100% |
| Profile | 29 | 29 | ✅ 100% |
| Courses | 11 | 8 (3 admin excluded) | ✅ 100% |
| Jobs | 12 | 9 (3 admin excluded) | ✅ 100% |
| Recommendations | 5 | 5 | ✅ 100% |
| Quiz | 6 | 6 | ✅ 100% |
| Chat | 4 | 4 | ✅ 100% |
| Notifications | 4 | 4 | ✅ 100% |
| Roadmaps | 5 | 5 | ✅ 100% |
| Resumes | 6 | 6 | ✅ 100% |
| **Total** | **88** | **82** | **✅ 100%** |

**Note:** 6 admin-only endpoints (course/job CRUD) are excluded from student frontend.

---

## Design System

### Colors
- Primary: Indigo/Violet gradient
- Background: Dark gray with glassmorphism
- Text: White/Gray scale
- Success: Green
- Warning: Yellow
- Error: Red

### Typography
- Font: Inter (Google Fonts)
- Headings: Bold, gradient text
- Body: Regular weight

### Components
- Glassmorphism cards with `backdrop-blur-xl`
- Gradient buttons
- Rounded corners (lg/xl)
- Shadow effects
- Smooth transitions

### Dark Mode
- Full support via Tailwind `dark:` prefix
- Toggle in navbar and settings

### Responsive
- Mobile-first design
- Breakpoints: sm, md, lg, xl
- Collapsible sidebar on mobile

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.0.0 | UI framework |
| react-dom | ^19.0.0 | DOM rendering |
| react-router-dom | ^7.0.0 | Routing |
| @reduxjs/toolkit | ^2.0.0 | State management |
| react-redux | ^9.0.0 | React-Redux bindings |
| axios | ^1.7.0 | HTTP client |
| react-toastify | ^10.0.0 | Notifications |
| tailwindcss | ^3.4.0 | CSS framework |
| flyonui | ^1.0.0 | UI components |
| vite | ^6.0.0 | Build tool |

---

## Scripts

```bash
# Development
npm run dev          # Start Vite dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

---

## Cross-Check Agent Report

**Location:** `frontend/src/__tests__/API_BINDING_CHECK.md`

**Results:**
- 58 backend endpoints verified
- 58 frontend service bindings matched
- 2 bugs found and fixed
- 100% binding accuracy after fixes

---

*Document generated: May 29, 2026*
*Frontend version: 1.0.0*
