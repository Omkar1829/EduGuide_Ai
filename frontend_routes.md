# EduGuideAI — Frontend Architecture Reference

> **Build Tool:** Vite 6  
> **Proxy:** Vite dev server proxies `/api` → `http://localhost:5000`

---

## 1. Tech Stack Overview

| Layer | Technology |
|-------|-----------|
| **Language** | JavaScript (JSX) |
| **UI Library** | React 19 |
| **State Management** | Redux Toolkit 2.5 |
| **HTTP Client** | Axios 1.7 |
| **Routing** | React Router DOM 7 |
| **CSS Framework** | TailwindCSS 3.4 |
| **UI Component Library** | FlyonUI 2.4 |
| **Icons** | Lucide React |
| **Notifications** | React Toastify 11 |
| **Build Tool** | Vite 6 |
| **Linting** | ESLint 9 |

### Key Dependencies

```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "@reduxjs/toolkit": "^2.5.0",
  "react-redux": "^9.2.0",
  "react-router-dom": "^7.1.1",
  "axios": "^1.7.9",
  "tailwindcss": "^3.4.17",
  "flyonui": "^2.4.1",
  "lucide-react": "^1.17.0",
  "react-toastify": "^11.0.3"
}
```

---

## 2. Project Structure

```
frontend/src/
├── App.jsx                     # Main routing (React Router)
├── main.jsx                    # Entry point (Redux Provider + Router)
├── assets/                     # Static assets
├── components/
│   ├── admin/                  # Admin-specific UI components
│   │   ├── ActivityChart.jsx
│   │   ├── AdminLayout.jsx
│   │   ├── AdminSidebar.jsx
│   │   ├── AdminStatsCard.jsx
│   │   ├── AdminTable.jsx
│   │   ├── CourseFormModal.jsx
│   │   ├── CourseManagementTable.jsx
│   │   ├── DeleteConfirmModal.jsx
│   │   ├── JobFormModal.jsx
│   │   ├── JobManagementTable.jsx
│   │   ├── UserFormModal.jsx
│   │   └── UserManagementTable.jsx
│   ├── common/                 # Shared UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── PricingModal.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── Spinner.jsx
│   │   └── StepIndicator.jsx
│   ├── dashboard/              # Dashboard-specific widgets
│   │   ├── ActivityTimeline.jsx
│   │   ├── CareerScoreGauge.jsx
│   │   ├── ChatWidget.jsx
│   │   ├── CourseCard.jsx
│   │   ├── JobCard.jsx
│   │   ├── NotificationPanel.jsx
│   │   ├── ProfileCompletionCard.jsx
│   │   ├── QuickStats.jsx
│   │   ├── RecommendationCard.jsx
│   │   ├── RoadmapPreview.jsx
│   │   └── SkillGapChart.jsx
│   └── layout/                 # Layout components
│       ├── DashboardLayout.jsx
│       ├── Footer.jsx
│       ├── Navbar.jsx
│       └── Sidebar.jsx
├── features/                   # Feature-based modules (colocated)
│   ├── ai/                     # AI service components
│   │   ├── AIChat.jsx
│   │   ├── CareerRecommendation.jsx
│   │   ├── CourseRecommendations.jsx
│   │   ├── FutureSimulator.jsx
│   │   ├── JobMatches.jsx
│   │   ├── QuizAnalysis.jsx
│   │   ├── ResumeAnalyzer.jsx
│   │   ├── RoadmapGenerator.jsx
│   │   └── SkillGapAnalysis.jsx
│   ├── ai-dashboard/           # AI Dashboard (slice only)
│   ├── auth/                   # Auth forms + slice
│   │   ├── LoginForm.jsx
│   │   └── RegisterForm.jsx
│   ├── courses/                # Course components + slice
│   │   ├── CourseCard.jsx
│   │   ├── CourseFilters.jsx
│   │   └── CourseList.jsx
│   ├── jobs/                   # Job components + slice
│   │   ├── JobCard.jsx
│   │   ├── JobFilters.jsx
│   │   └── JobList.jsx
│   ├── notifications/          # Notifications (slice only)
│   ├── profile/                # Profile form components + slice
│   │   ├── AcademicRecordsForm.jsx
│   │   ├── BasicInfoForm.jsx
│   │   ├── CareerGoalsForm.jsx
│   │   ├── CertificationsForm.jsx
│   │   ├── InterestsForm.jsx
│   │   ├── SkillsForm.jsx
│   │   └── StrengthsWeaknessesForm.jsx
│   ├── quiz/                   # Quiz components + slice
│   │   ├── QuizCard.jsx
│   │   ├── QuizQuestion.jsx
│   │   ├── QuizResult.jsx
│   │   └── QuizTimer.jsx
│   └── recommendations/        # Recommendations (slice only)
├── hooks/
│   ├── useApi.js               # Generic async API call hook
│   └── useAuth.js              # Auth convenience hook (wraps authSlice)
├── pages/
│   ├── admin/
│   │   ├── AdminAnalyticsPage.jsx
│   │   ├── AdminCoursesPage.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminJobsPage.jsx
│   │   ├── AdminQuizzesPage.jsx
│   │   └── AdminUsersPage.jsx
│   ├── AdminDashboard.jsx
│   ├── AIDashboard.jsx
│   ├── CourseDetailPage.jsx
│   ├── CoursesPage.jsx
│   ├── JobDetailPage.jsx
│   ├── JobsPage.jsx
│   ├── KnowledgeCenterPage.jsx
│   ├── LoginPage.jsx
│   ├── ProfilePage.jsx
│   ├── ProfileWizard.jsx
│   ├── QuizPage.jsx
│   ├── QuizResultPage.jsx
│   ├── QuizTakePage.jsx
│   ├── RegisterPage.jsx
│   ├── ResumeBuilderPage.jsx
│   ├── SettingsPage.jsx
│   └── UserDashboard.jsx
├── services/                   # API service layer
│   ├── api.js                  # Axios instance with interceptors
│   ├── adminService.js
│   ├── aiDashboardService.js
│   ├── aiService.js
│   ├── authService.js
│   ├── courseService.js
│   ├── jobService.js
│   ├── notificationService.js
│   ├── profileService.js
│   ├── quizService.js
│   └── recommendationService.js
├── store/                      # Redux store configuration
│   ├── index.js                # configureStore with all slice reducers
│   ├── api.js                  # (Unused) alternate axios instance
│   └── slices/
│       ├── adminSlice.js
│       ├── aiDashboardSlice.js
│       ├── aiSlice.js
│       ├── authSlice.js
│       ├── courseSlice.js
│       ├── jobSlice.js
│       ├── notificationSlice.js
│       ├── profileSlice.js
│       ├── quizSlice.js
│       └── recommendationSlice.js
├── styles/                     # Global styles
└── utils/
    └── constants.js            # API_ENDPOINTS, ROUTES, ROLES, etc.
```

---

## 3. Routing & Pages

Defined in `App.jsx`. Uses `react-router-dom` v7 with three route groups.

| Route | Page Component | Layout | Auth | Admin Only |
|-------|---------------|--------|:----:|:----------:|
| `/` | `RootRedirect` (auto-redirects) | None | — | — |
| `/login` | `LoginPage` | None | — | — |
| `/register` | `RegisterPage` | None | — | — |
| `/profile-wizard` | `ProfileWizard` | None | ✓ | — |
| `/dashboard` | `UserDashboard` | `DashboardLayout` | ✓ | — |
| `/ai-dashboard` | `AIDashboard` | `DashboardLayout` | ✓ | — |
| `/courses` | `CoursesPage` | `DashboardLayout` | ✓ | — |
| `/courses/:id` | `CourseDetailPage` | `DashboardLayout` | ✓ | — |
| `/jobs` | `JobsPage` | `DashboardLayout` | ✓ | — |
| `/jobs/:id` | `JobDetailPage` | `DashboardLayout` | ✓ | — |
| `/quiz` | `QuizPage` | `DashboardLayout` | ✓ | — |
| `/quiz/:id` | `QuizTakePage` | `DashboardLayout` | ✓ | — |
| `/quiz/:id/results` | `QuizResultPage` | `DashboardLayout` | ✓ | — |
| `/settings` | `SettingsPage` | `DashboardLayout` | ✓ | — |
| `/profile` | `ProfilePage` | `DashboardLayout` | ✓ | — |
| `/resume-builder` | `ResumeBuilderPage` | `DashboardLayout` | ✓ | — |
| `/knowledge-center` | `KnowledgeCenterPage` | `DashboardLayout` | ✓ | — |
| `/admin` | `AdminDashboard` | `AdminLayout` | ✓ | ✓ |
| `/admin/users` | `AdminUsersPage` | `AdminLayout` | ✓ | ✓ |
| `/admin/courses` | `AdminCoursesPage` | `AdminLayout` | ✓ | ✓ |
| `/admin/jobs` | `AdminJobsPage` | `AdminLayout` | ✓ | ✓ |
| `/admin/quizzes` | `AdminQuizzesPage` | `AdminLayout` | ✓ | ✓ |
| `/admin/analytics` | `AdminAnalyticsPage` | `AdminLayout` | ✓ | ✓ |
| `*` | Redirect to `/` | None | — | — |

### Auth Protection Logic

`ProtectedRoute.jsx` handles:
- Not authenticated → redirect to `/login`
- Admin-only route + non-admin user → redirect to `/dashboard`
- Non-admin route + admin user → redirect to `/admin`
- Loading state → shows `Spinner`

---

## 4. Axios Instance (`services/api.js`)

The main API client with:
- **Base URL:** `VITE_API_URL` env var or `http://localhost:5000/api`
- **Request interceptor:** Attaches `Authorization: Bearer <token>` from localStorage
- **Response interceptor:** Unwraps `response.data`, handles 401 auto-refresh with token rotation, and redirects to `/login` on refresh failure

---

## 5. Service Layer — Complete API Function Mapping

### 5.1 Auth Service (`services/authService.js`)

| Function | HTTP Method | Endpoint | Params | Used By (Slice / Hook) |
|----------|------------|----------|--------|------------------------|
| `register(data)` | POST | `/auth/register` | `{ firstName, lastName, email, password }` | `authSlice.registerUser` |
| `login(data)` | POST | `/auth/login` | `{ email, password }` | `authSlice.loginUser` |
| `refreshToken(refreshToken)` | POST | `/auth/refresh-token` | `{ refreshToken }` | `authSlice.refreshAccessToken` |
| `logout(refreshToken)` | POST | `/auth/logout` | `{ refreshToken }` | `authSlice.logoutUser` |
| `getProfile()` | GET | `/auth/profile` | — | `authSlice.fetchProfile` |
| `updatePassword(data)` | PUT | `/auth/password` | `{ oldPassword, newPassword }` | (available for use) |

---

### 5.2 Profile Service (`services/profileService.js`)

| Function | HTTP Method | Endpoint | Params | Used By (Slice Thunk) |
|----------|------------|----------|--------|------------------------|
| `getProfile()` | GET | `/profile/profile` | — | `profileSlice.fetchProfile` |
| `updateProfile(data)` | PUT | `/profile/profile` | profile fields | `profileSlice.updateProfile` |
| `addAcademicRecord(data)` | POST | `/profile/profile/academic-records` | academic record data | `profileSlice.addAcademicRecord` |
| `updateAcademicRecord(recordId, data)` | PUT | `/profile/profile/academic-records/:recordId` | `recordId`, data | `profileSlice.updateAcademicRecord` |
| `deleteAcademicRecord(recordId)` | DELETE | `/profile/profile/academic-records/:recordId` | `recordId` | `profileSlice.deleteAcademicRecord` |
| `addSubjectMark(recordId, data)` | POST | `/profile/profile/academic-records/:recordId/marks` | `recordId`, data | `profileSlice.addSubjectMark` |
| `deleteSubjectMark(markId)` | DELETE | `/profile/profile/marks/:markId` | `markId` | `profileSlice.deleteSubjectMark` |
| `getInterests()` | GET | `/profile/profile/interests` | — | `profileSlice.fetchInterests` |
| `addInterest(data)` | POST | `/profile/profile/interests` | `{ name, category?, level? }` | `profileSlice.addInterest` |
| `removeInterest(interestId)` | DELETE | `/profile/profile/interests/:interestId` | `interestId` | `profileSlice.removeInterest` |
| `getCareerGoals()` | GET | `/profile/profile/career-goals` | — | `profileSlice.fetchCareerGoals` |
| `addCareerGoal(data)` | POST | `/profile/profile/career-goals` | `{ title, description?, ... }` | `profileSlice.addCareerGoal` |
| `updateCareerGoal(goalId, data)` | PUT | `/profile/profile/career-goals/:goalId` | `goalId`, data | `profileSlice.updateCareerGoal` |
| `removeCareerGoal(goalId)` | DELETE | `/profile/profile/career-goals/:goalId` | `goalId` | `profileSlice.removeCareerGoal` |
| `getStrengths()` | GET | `/profile/profile/strengths` | — | `profileSlice.fetchStrengths` |
| `addStrength(data)` | POST | `/profile/profile/strengths` | `{ name, category?, evidence? }` | `profileSlice.addStrength` |
| `removeStrength(strengthId)` | DELETE | `/profile/profile/strengths/:strengthId` | `strengthId` | `profileSlice.removeStrength` |
| `getWeaknesses()` | GET | `/profile/profile/weaknesses` | — | `profileSlice.fetchWeaknesses` |
| `addWeakness(data)` | POST | `/profile/profile/weaknesses` | `{ name, category?, evidence? }` | `profileSlice.addWeakness` |
| `removeWeakness(weaknessId)` | DELETE | `/profile/profile/weaknesses/:weaknessId` | `weaknessId` | `profileSlice.removeWeakness` |
| `getSkills()` | GET | `/profile/profile/skills` | — | `profileSlice.fetchSkills` |
| `addSkill(data)` | POST | `/profile/profile/skills` | `{ skillId, level?, yearsExp? }` | `profileSlice.addSkill` |
| `removeSkill(skillId)` | DELETE | `/profile/profile/skills/:skillId` | `skillId` | `profileSlice.removeSkill` |
| `searchSkills(query)` | GET | `/profile/skills/search?q=` | `query` string | `profileSlice.searchSkills` |
| `getCertifications()` | GET | `/profile/profile/certifications` | — | `profileSlice.fetchCertifications` |
| `addCertification(data)` | POST | `/profile/profile/certifications` | cert data | `profileSlice.addCertification` |
| `updateCertification(certId, data)` | PUT | `/profile/profile/certifications/:certId` | `certId`, data | `profileSlice.updateCertification` |
| `removeCertification(certId)` | DELETE | `/profile/profile/certifications/:certId` | `certId` | `profileSlice.removeCertification` |
| `getProfileCompletion()` | GET | `/profile/profile/completion` | — | (available for use) |

---

### 5.3 Course Service (`services/courseService.js`)

| Function | HTTP Method | Endpoint | Params | Used By (Slice Thunk) |
|----------|------------|----------|--------|------------------------|
| `getAllCourses(params)` | GET | `/courses` | `{ category?, level?, ... }` | `courseSlice.fetchCourses` |
| `getCourseById(id)` | GET | `/courses/:id` | `id` | `courseSlice.fetchCourseById` |
| `searchCourses(query)` | GET | `/courses/search?q=` | `query` | (available for direct use) |
| `getCoursesByCategory(category)` | GET | `/courses/category/:category` | `category` | (available for direct use) |
| `getEnrolledCourses(params)` | GET | `/courses/enrolled` | `{ page?, limit? }` | `courseSlice.fetchEnrolledCourses` |
| `enrollInCourse(id)` | POST | `/courses/:id/enroll` | `id` | `courseSlice.enrollInCourse` |
| `updateCourseProgress(id, progress)` | PUT | `/courses/:id/progress` | `id`, `progress` | `courseSlice.updateCourseProgress` |
| `unenrollFromCourse(id)` | DELETE | `/courses/:id/unenroll` | `id` | `courseSlice.unenrollFromCourse` |

---

### 5.4 Job Service (`services/jobService.js`)

| Function | HTTP Method | Endpoint | Params | Used By (Slice Thunk) |
|----------|------------|----------|--------|------------------------|
| `getAllJobs(params)` | GET | `/jobs` | `{ category?, type?, ... }` | `jobSlice.fetchJobs` |
| `getJobById(id)` | GET | `/jobs/:id` | `id` | `jobSlice.fetchJobById` |
| `searchJobs(query)` | GET | `/jobs/search?q=` | `query` | (available for direct use) |
| `getJobsByCategory(category)` | GET | `/jobs/category/:category` | `category` | (available for direct use) |
| `getJobsBySkills(skills)` | GET | `/jobs/skills?skills=` | `skills[]` | (available for direct use) |
| `getSavedJobs(params)` | GET | `/jobs/saved` | `{ page?, limit? }` | `jobSlice.fetchSavedJobs` |
| `saveJob(id)` | POST | `/jobs/:id/save` | `id` | `jobSlice.saveJob` |
| `updateJobStatus(id, status)` | PUT | `/jobs/:id/status` | `id`, `status` | `jobSlice.updateJobStatus` |
| `removeSavedJob(id)` | DELETE | `/jobs/:id/save` | `id` | `jobSlice.removeSavedJob` |

---

### 5.5 Quiz Service (`services/quizService.js`)

| Function | HTTP Method | Endpoint | Params | Used By (Slice Thunk) |
|----------|------------|----------|--------|------------------------|
| `getQuizzes(params)` | GET | `/quizzes` | `{ category?, page?, limit? }` | `quizSlice.fetchQuizzes` |
| `createQuiz(data)` | POST | `/quizzes` | quiz data | `quizSlice.createQuiz` |
| `generateAIQuiz()` | POST | `/quizzes/generate` | — | `quizSlice.generateAIQuiz` |
| `getQuizById(id)` | GET | `/quizzes/:id` | `id` | `quizSlice.fetchQuizById` |
| `submitQuiz(id, answers)` | POST | `/quizzes/:id/submit` | `id`, `{ answers[] }` | `quizSlice.submitQuizAnswers` |
| `getQuizResults(id)` | GET | `/quizzes/:id/results` | `id` | `quizSlice.fetchQuizResults` |
| `getUserResults(params)` | GET | `/quizzes/results` | `{ page?, limit? }` | `quizSlice.fetchUserResults` |

---

### 5.6 AI Service (`services/aiService.js`)

| Function | HTTP Method | Endpoint | Params | Used By (Slice Thunk) |
|----------|------------|----------|--------|------------------------|
| `getCareerRecommendation()` | POST | `/ai/career-recommendation` | `{}` | `aiSlice.fetchCareerRecommendation` |
| `getStreamRecommendation()` | POST | `/ai/stream-recommendation` | `{}` | `aiSlice.fetchStreamRecommendation` |
| `analyzeSkillGap(targetCareer)` | POST | `/ai/skill-gap` | `{ targetCareer }` | `aiSlice.fetchSkillGap` |
| `generateRoadmap(targetCareer)` | POST | `/ai/roadmap-generate` | `{ targetCareer }` | `aiSlice.fetchRoadmap` |
| `sendMessage(message, sessionId, history)` | POST | `/ai/chat` | `{ message, sessionId, history }` | `aiSlice.sendChatMessage` |
| `analyzeResume(resumeContent)` | POST | `/ai/resume-analyze` | `{ resumeContent }` | `aiSlice.fetchResumeAnalysis` |
| `simulateFuture(paths, timeline)` | POST | `/ai/future-simulate` | `{ paths, timeline }` | `aiSlice.fetchFutureSimulation` |
| `analyzeQuiz(quizId, resultId)` | POST | `/ai/quiz-analyze` | `{ quizId, resultId }` | `aiSlice.fetchQuizAnalysis` |
| `recommendCourses(filters)` | POST | `/ai/course-recommend` | `{ filters }` | `aiSlice.fetchCourseRecommendations` |
| `matchJobs(filters)` | POST | `/ai/job-match` | `{ filters }` | `aiSlice.fetchJobMatches` |

---

### 5.7 AI Dashboard Service (`services/aiDashboardService.js`)

| Function | HTTP Method | Endpoint | Params | Used By (Slice Thunk) |
|----------|------------|----------|--------|------------------------|
| `getCareerScore()` | GET | `/resumes` | — | `aiDashboardSlice.fetchCareerScore` |
| `getRecommendedStreams()` | GET | `/recommendations?type=STREAM` | — | `aiDashboardSlice.fetchRecommendedStreams` |
| `getCareerRecommendations()` | GET | `/recommendations?type=CAREER` | — | `aiDashboardSlice.fetchCareerRecommendations` |
| `generateRecommendations()` | POST | `/recommendations/generate` | — | `aiDashboardSlice.generateRecommendationsThunk` |
| `getSkillGap()` | GET | `/profile/profile/completion` | — | `aiDashboardSlice.fetchSkillGap` |
| `getRoadmaps(params)` | GET | `/roadmaps` | `{ page?, limit? }` | `aiDashboardSlice.fetchRoadmap` |
| `getRoadmapById(id)` | GET | `/roadmaps/:id` | `id` | (available for direct use) |
| `createRoadmap(data)` | POST | `/roadmaps` | roadmap data | `aiDashboardSlice.saveRoadmap` |
| `updateRoadmap(id, data)` | PUT | `/roadmaps/:id` | `id`, data | (available for direct use) |
| `deleteRoadmap(id)` | DELETE | `/roadmaps/:id` | `id` | (available for direct use) |
| `getChatHistory(sessionId, params)` | GET | `/chat/history/:sessionId` | `sessionId` | `aiDashboardSlice.fetchChatHistory` |
| `getChatSessions()` | GET | `/chat/sessions` | — | (available for direct use) |
| `sendMessage(data)` | POST | `/chat/message` | message data | `aiDashboardSlice.sendMessage` |
| `deleteChatSession(sessionId)` | DELETE | `/chat/sessions/:sessionId` | `sessionId` | (available for direct use) |
| `getResumes(params)` | GET | `/resumes` | `{ page?, limit? }` | (available for direct use) |
| `getResumeById(id)` | GET | `/resumes/:id` | `id` | (available for direct use) |
| `createResume(data)` | POST | `/resumes` | resume data | (available for direct use) |
| `updateResume(id, data)` | PUT | `/resumes/:id` | `id`, data | (available for direct use) |
| `deleteResume(id)` | DELETE | `/resumes/:id` | `id` | (available for direct use) |
| `analyzeResume(id)` | POST | `/resumes/:id/analyze` | `id` | `aiDashboardSlice.fetchResumeAnalysis` |

---

### 5.8 Recommendation Service (`services/recommendationService.js`)

| Function | HTTP Method | Endpoint | Params | Used By (Slice Thunk) |
|----------|------------|----------|--------|------------------------|
| `getRecommendations(params)` | GET | `/recommendations` | `{ type?, status?, ... }` | `recommendationSlice.fetchRecommendations` |
| `getRecommendationById(id)` | GET | `/recommendations/:id` | `id` | `recommendationSlice.fetchRecommendationById` |
| `createRecommendation(data)` | POST | `/recommendations` | recommendation data | (available for direct use) |
| `acceptRecommendation(id)` | PUT | `/recommendations/:id/accept` | `id` | `recommendationSlice.acceptRecommendation` |
| `rejectRecommendation(id)` | PUT | `/recommendations/:id/reject` | `id` | `recommendationSlice.rejectRecommendation` |

---

### 5.9 Notification Service (`services/notificationService.js`)

| Function | HTTP Method | Endpoint | Params | Used By (Slice Thunk) |
|----------|------------|----------|--------|------------------------|
| `getNotifications(params)` | GET | `/notifications` | `{ isRead?, page?, limit? }` | `notificationSlice.fetchNotifications` |
| `getUnreadCount()` | GET | `/notifications/unread-count` | — | `notificationSlice.fetchUnreadCount` |
| `markAsRead(id)` | PUT | `/notifications/:id/read` | `id` | `notificationSlice.markAsRead` |
| `markAllAsRead()` | PUT | `/notifications/read-all` | — | `notificationSlice.markAllAsRead` |

---

### 5.10 Admin Service (`services/adminService.js`)

| Function | HTTP Method | Endpoint | Params | Used By (Slice Thunk) |
|----------|------------|----------|--------|------------------------|
| `getStats()` | GET | `/admin/stats` | — | `adminSlice` (alias for getPlatformStats) |
| `getPlatformStats()` | GET | `/admin/stats` | — | `adminSlice.fetchPlatformStats` |
| `getAnalytics(params)` | GET | `/admin/analytics` | params | `adminSlice.fetchAnalytics` |
| `getActivity(params)` | GET | `/admin/activity` | `{ limit? }` | `adminSlice.fetchRecentActivity` |
| `getRecentActivity(limit)` | GET | `/admin/activity?limit=` | `limit` | `adminSlice.fetchRecentActivity` |
| `getUsers(params)` | GET | `/admin/users` | `{ role?, search?, ... }` | `adminSlice.fetchUsers` |
| `getUserById(id)` | GET | `/admin/users/:id` | `id` | `adminSlice.fetchUserById` |
| `updateUser(id, data)` | PUT | `/admin/users/:id` | `id`, data | `adminSlice.updateUser` |
| `deleteUser(id)` | DELETE | `/admin/users/:id` | `id` | `adminSlice.deleteUser` |
| `toggleUserActive(id)` | PUT | `/admin/users/:id/toggle-active` | `id` | `adminSlice.toggleUserActive` |
| `getCourses(params)` | GET | `/admin/courses` | filters | `adminSlice.fetchCourses` |
| `getCourseById(id)` | GET | `/admin/courses/:id` | `id` | `adminSlice.fetchCourseById` |
| `createCourse(data)` | POST | `/admin/courses` | course data | `adminSlice.createCourse` |
| `updateCourse(id, data)` | PUT | `/admin/courses/:id` | `id`, data | `adminSlice.updateCourse` |
| `deleteCourse(id)` | DELETE | `/admin/courses/:id` | `id` | `adminSlice.deleteCourse` |
| `getJobs(params)` | GET | `/admin/jobs` | filters | `adminSlice.fetchJobs` |
| `getJobById(id)` | GET | `/admin/jobs/:id` | `id` | `adminSlice.fetchJobById` |
| `createJob(data)` | POST | `/admin/jobs` | job data | `adminSlice.createJob` |
| `updateJob(id, data)` | PUT | `/admin/jobs/:id` | `id`, data | `adminSlice.updateJob` |
| `deleteJob(id)` | DELETE | `/admin/jobs/:id` | `id` | `adminSlice.deleteJob` |
| `scrapeJobs(data)` | POST | `/admin/jobs/scrape` | `{ location, limit?, keyword? }` | (available for direct use) |
| `getScrapeStatus()` | GET | `/admin/jobs/scrape/status` | — | (available for direct use) |
| `stopScrapeJobs()` | POST | `/admin/jobs/scrape/stop` | — | (available for direct use) |

---

## 6. Redux Store — Slice Summary

Configured in `store/index.js`. Middleware: serializableCheck disabled.

| Slice | Reducer Key | Thunks | State Shape |
|-------|-------------|--------|-------------|
| `authSlice` | `auth` | `registerUser`, `loginUser`, `refreshAccessToken`, `logoutUser`, `fetchProfile` | `{ user, token, refreshToken, isAuthenticated, loading, error }` |
| `profileSlice` | `profile` | `fetchProfile`, `updateProfile`, `add/update/deleteAcademicRecord`, `add/deleteSubjectMark`, `fetch/add/removeInterest`, `fetch/add/update/removeCareerGoal`, `fetch/add/removeStrength`, `fetch/add/removeWeakness`, `fetch/add/removeSkill`, `searchSkills`, `fetch/add/update/removeCertification` | `{ profile, academicRecords[], interests[], careerGoals[], ... completionPct, loading, error }` |
| `courseSlice` | `courses` | `fetchCourses`, `fetchCourseById`, `fetchEnrolledCourses`, `enrollInCourse`, `updateCourseProgress`, `unenrollFromCourse` | `{ courses[], enrolledCourses[], currentCourse, pagination, loading, error }` |
| `jobSlice` | `jobs` | `fetchJobs`, `fetchJobById`, `fetchSavedJobs`, `saveJob`, `updateJobStatus`, `removeSavedJob` | `{ jobs[], savedJobs[], currentJob, pagination, loading, error }` |
| `quizSlice` | `quizzes` | `fetchQuizzes`, `createQuiz`, `generateAIQuiz`, `fetchQuizById`, `submitQuizAnswers`, `fetchQuizResults`, `fetchUserResults` | `{ quizzes[], currentQuiz, quizResults[], currentResult, userResults[], loading, error }` |
| `recommendationSlice` | `recommendations` | `fetchRecommendations`, `fetchRecommendationById`, `acceptRecommendation`, `rejectRecommendation` | `{ recommendations[], currentRecommendation, loading, error }` |
| `notificationSlice` | `notifications` | `fetchNotifications`, `fetchUnreadCount`, `markAsRead`, `markAllAsRead` | `{ notifications[], unreadCount, loading, error }` |
| `aiDashboardSlice` | `aiDashboard` | `fetchCareerScore`, `fetchRecommendedStreams`, `fetchCareerRecommendations`, `generateRecommendationsThunk`, `fetchSkillGap`, `fetchRoadmap`, `saveRoadmap`, `fetchChatHistory`, `sendMessage`, `fetchResumeAnalysis` | `{ careerScore, recommendedStreams[], careerRecommendations[], skillGap, roadmap[], chatHistory[], resumeAnalysis, loading, error }` |
| `adminSlice` | `admin` | `fetchPlatformStats`, `fetchAnalytics`, `fetchRecentActivity`, `fetchUsers`, `fetchUserById`, `updateUser`, `deleteUser`, `toggleUserActive`, `fetchCourses`, `fetchCourseById`, `createCourse`, `updateCourse`, `deleteCourse`, `fetchJobs`, `fetchJobById`, `createJob`, `updateJob`, `deleteJob` | `{ stats, analytics, activity[], users[], usersPagination, currentUser, courses[], coursesPagination, currentCourse, jobs[], jobsPagination, currentJob, loading, error }` |
| `aiSlice` | `ai` | `fetchCareerRecommendation`, `fetchStreamRecommendation`, `fetchSkillGap`, `fetchRoadmap`, `sendChatMessage`, `fetchResumeAnalysis`, `fetchFutureSimulation`, `fetchQuizAnalysis`, `fetchCourseRecommendations`, `fetchJobMatches` | `{ careerRecommendations[], streamRecommendations[], skillGap, roadmap, chatMessages[], chatSessionId, resumeAnalysis, simulation, quizAnalysis, courseRecommendations[], jobMatches[], loading, error }` |

---

## 7. Custom Hooks

### `useAuth` (`hooks/useAuth.js`)

Wraps `authSlice` dispatch actions. Provides:
- `user`, `isAuthenticated`, `loading`, `error` (from Redux state)
- `login(credentials)` — dispatches `loginUser`, toasts, navigates to `/dashboard`
- `register(userData)` — dispatches `registerUser`, toasts, navigates to `/profile-wizard`
- `logout()` — dispatches `logoutUser`, toasts, navigates to `/login`
- `checkAuth()` — if token exists but not authenticated, dispatches `fetchProfile`

### `useApi` (`hooks/useApi.js`)

Generic hook for async API calls. Provides:
- `data`, `loading`, `error` state
- `execute(...args)` — calls the passed API function, unwraps `response.data`
- `reset()` — clears state

---

## 8. Page-to-Component Mapping

Each page assembles its UI from feature components and shared/dashboard components.

| Page | Feature Components Used | Shared Components Used |
|------|-----------------------|----------------------|
| `LoginPage` | `LoginForm` | `Card`, `Input`, `Button`, `Spinner` |
| `RegisterPage` | `RegisterForm` | `Card`, `Input`, `Button`, `Spinner` |
| `ProfileWizard` | `BasicInfoForm`, `AcademicRecordsForm`, `InterestsForm`, `SkillsForm`, `CareerGoalsForm`, `StrengthsWeaknessesForm`, `CertificationsForm` | `Card`, `Button`, `StepIndicator`, `ProgressBar` |
| `ProfilePage` | (same forms as wizard, edit mode) | `Card`, `Button`, `Modal`, `Input` |
| `UserDashboard` | — | `Card`, `QuickStats`, `ActivityTimeline`, `ProfileCompletionCard`, `ChatWidget`, `CourseCard`, `JobCard`, `RecommendationCard` |
| `AIDashboard` | `CareerRecommendation` | `Card`, `Button`, `Modal`, `Spinner`, `SkillGapChart`, `RoadmapPreview`, `CareerScoreGauge` |
| `CoursesPage` | `CourseCard`, `CourseFilters`, `CourseList` | `Card`, `Input`, `Spinner` |
| `CourseDetailPage` | — | `Card`, `Button`, `ProgressBar`, `Modal` |
| `JobsPage` | `JobCard`, `JobFilters`, `JobList` | `Card`, `Input`, `Spinner` |
| `JobDetailPage` | — | `Card`, `Button`, `Modal` |
| `QuizPage` | `QuizCard` | `Card`, `Button`, `Spinner` |
| `QuizTakePage` | `QuizQuestion`, `QuizTimer` | `Card`, `Button`, `ProgressBar` |
| `QuizResultPage` | `QuizResult` | `Card`, `Button` |
| `SettingsPage` | — | `Card`, `Button`, `Input`, `PricingModal` |
| `ResumeBuilderPage` | — | `Card`, `Button`, `Modal` |
| `KnowledgeCenterPage` | — | `Card`, `Button` |
| `AdminDashboard` | — | `AdminStatsCard`, `ActivityChart`, `AdminTable` |
| `AdminUsersPage` | — | `UserManagementTable`, `UserFormModal`, `DeleteConfirmModal` |
| `AdminCoursesPage` | — | `CourseManagementTable`, `CourseFormModal`, `DeleteConfirmModal` |
| `AdminJobsPage` | — | `JobManagementTable`, `JobFormModal`, `DeleteConfirmModal` |
| `AdminQuizzesPage` | — | `AdminTable`, `DeleteConfirmModal` |
| `AdminAnalyticsPage` | — | `ActivityChart`, `AdminStatsCard` |

---

## 9. Navigation / Page Linking

### Sidebar Navigation (User)

Rendered in `Sidebar.jsx` under `DashboardLayout`:

| Nav Item | Route Path | Icon |
|----------|-----------|------|
| Dashboard | `/dashboard` | `Home` |
| My Profile | `/profile` | `User` |
| AI Dashboard | `/ai-dashboard` | `Bot` |
| Courses | `/courses` | `GraduationCap` |
| Jobs | `/jobs` | `Briefcase` |
| Quiz | `/quiz` | `HelpCircle` |
| Resume Builder | `/resume-builder` | `FileText` |
| Knowledge Center | `/knowledge-center` | `Newspaper` |
| Settings | `/settings` | `Settings` |
| Admin | `/admin` | `Shield` (admin only) |

### Page-to-Page Links (within components)

| Source Page | Link/Button | Target Route |
|------------|------------|-------------|
| `UserDashboard` | Take Career Quiz | `/quiz` |
| `UserDashboard` | AI Career Dashboard | `/ai-dashboard` |
| `UserDashboard` | Explore Courses | `/courses` |
| `UserDashboard` | Browse Jobs | `/jobs` |
| `UserDashboard` | Consult AI Counselor | `/ai-dashboard` |
| `UserDashboard` | Edit Profile | `/profile` |
| `AIDashboard` | Explore (Career Path cards) | `/courses` |
| `CoursesPage` | Course card click | `/courses/:id` |
| `JobsPage` | Job card click | `/jobs/:id` |
| `QuizPage` | Take quiz | `/quiz/:id` |
| `QuizTakePage` | After submit | `/quiz/:id/results` |
| `ProfileWizard` | On complete | `/dashboard` |
| `LoginPage` | On success | `/dashboard` |
| `RegisterPage` | On success | `/profile-wizard` |
| `ProtectedRoute` | If admin, auto-redirect | `/admin` |

---

## 10. Architecture Data Flow

```
Page Component
    │
    ├── dispatches Redux thunk (e.g. dispatch(fetchCourses()))
    │       │
    │       └── Thunk calls Service function (e.g. courseService.getAllCourses())
    │               │
    │               └── Service calls Axios instance (e.g. api.get('/courses'))
    │                       │
    │                       └── Axios: attaches JWT → sends HTTP request to /api/*
    │                               │
    │                               └── Response → unwrapped by interceptor → returned to thunk
    │                                       │
    │                                       └── Thunk returns payload → Redux reducer updates state
    │                                               │
    │                                               └── useSelector() re-renders component
    │
    └── or uses custom hook (useAuth / useApi) for simpler flows
```

---

## 11. Constants & Utilities (`utils/constants.js`)

| Export | Type | Purpose |
|--------|------|---------|
| `API_ENDPOINTS` | Object | Map of all API endpoint paths (ORG chart, not actively used by services) |
| `ROUTES` | Object | Frontend route path constants |
| `ROLES` | Object | `{ STUDENT, COUNSELOR, ADMIN }` |
| `QUIZ_CATEGORIES` | Array | Quiz category options |
| `RECOMMENDATION_TYPES` | Object | `{ CAREER, COURSE, SKILL, JOB }` |
| `PAGINATION` | Object | `{ DEFAULT_PAGE: 1, DEFAULT_LIMIT: 10, MAX_LIMIT: 50 }` |
| `VALIDATION` | Object | Regex and length constraints |

---

*Generated from codebase — EduGuideAI Frontend*
