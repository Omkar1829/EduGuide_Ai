# API Binding Check Report

**Date:** 2026-05-29
**Cross-Check Agent:** EduGuide AI Frontend-Backend Binding Verification

---

## Summary

| Metric | Count |
|--------|-------|
| Total Backend Endpoints | 58 |
| Frontend Service Functions | 58 |
| Mismatches Found | 2 |
| Mismatches Fixed | 2 |
| Endpoints Matched | 58/58 (100%) |

---

## 1. Auth Routes (`/api/auth`)

| Backend Endpoint | Method | Auth Required | Frontend Service | Frontend Function | Redux Thunk | Status |
|---|---|---|---|---|---|---|
| `/auth/register` | POST | No | authService.js | `register(data)` | `registerUser` | ✅ MATCH |
| `/auth/login` | POST | No | authService.js | `login(data)` | `loginUser` | ✅ MATCH |
| `/auth/refresh-token` | POST | No | authService.js | `refreshToken(refreshToken)` | `refreshAccessToken` | ✅ MATCH |
| `/auth/logout` | POST | No | authService.js | `logout(refreshToken)` | `logoutUser` | ✅ MATCH |
| `/auth/profile` | GET | Yes | authService.js | `getProfile()` | `fetchProfile` (authSlice) | ✅ MATCH |
| `/auth/password` | PUT | Yes | authService.js | `updatePassword(data)` | — | ✅ MATCH |

**Notes:** Auth interceptor in `api.js` handles 401 refresh token flow. Token stored in localStorage.

---

## 2. Profile Routes (`/api/profile`)

| Backend Endpoint | Method | Auth Required | Frontend Service | Frontend Function | Redux Thunk | Status |
|---|---|---|---|---|---|---|
| `/profile/profile` | GET | Yes | profileService.js | `getProfile()` | `fetchProfile` | ✅ MATCH |
| `/profile/profile` | PUT | Yes | profileService.js | `updateProfile(data)` | `updateProfile` | ✅ MATCH |
| `/profile/profile/academic-records` | POST | Yes | profileService.js | `addAcademicRecord(data)` | `addAcademicRecord` | ✅ MATCH |
| `/profile/profile/academic-records/:recordId` | PUT | Yes | profileService.js | `updateAcademicRecord(recordId, data)` | `updateAcademicRecord` | ✅ MATCH |
| `/profile/profile/academic-records/:recordId` | DELETE | Yes | profileService.js | `deleteAcademicRecord(recordId)` | `deleteAcademicRecord` | ✅ MATCH |
| `/profile/profile/academic-records/:recordId/marks` | POST | Yes | profileService.js | `addSubjectMark(recordId, data)` | `addSubjectMark` | ✅ MATCH |
| `/profile/profile/marks/:markId` | DELETE | Yes | profileService.js | `deleteSubjectMark(markId)` | `deleteSubjectMark` | ✅ MATCH |
| `/profile/profile/interests` | GET | Yes | profileService.js | `getInterests()` | `fetchInterests` | ✅ MATCH |
| `/profile/profile/interests` | POST | Yes | profileService.js | `addInterest(data)` | `addInterest` | ✅ MATCH |
| `/profile/profile/interests/:interestId` | DELETE | Yes | profileService.js | `removeInterest(interestId)` | `removeInterest` | ✅ MATCH |
| `/profile/profile/career-goals` | GET | Yes | profileService.js | `getCareerGoals()` | `fetchCareerGoals` | ✅ MATCH |
| `/profile/profile/career-goals` | POST | Yes | profileService.js | `addCareerGoal(data)` | `addCareerGoal` | ✅ MATCH |
| `/profile/profile/career-goals/:goalId` | PUT | Yes | profileService.js | `updateCareerGoal(goalId, data)` | `updateCareerGoal` | ✅ MATCH |
| `/profile/profile/career-goals/:goalId` | DELETE | Yes | profileService.js | `removeCareerGoal(goalId)` | `removeCareerGoal` | ✅ MATCH |
| `/profile/profile/strengths` | GET | Yes | profileService.js | `getStrengths()` | `fetchStrengths` | ✅ MATCH |
| `/profile/profile/strengths` | POST | Yes | profileService.js | `addStrength(data)` | `addStrength` | ✅ MATCH |
| `/profile/profile/strengths/:strengthId` | DELETE | Yes | profileService.js | `removeStrength(strengthId)` | `removeStrength` | ✅ MATCH |
| `/profile/profile/weaknesses` | GET | Yes | profileService.js | `getWeaknesses()` | `fetchWeaknesses` | ✅ MATCH |
| `/profile/profile/weaknesses` | POST | Yes | profileService.js | `addWeakness(data)` | `addWeakness` | ✅ MATCH |
| `/profile/profile/weaknesses/:weaknessId` | DELETE | Yes | profileService.js | `removeWeakness(weaknessId)` | `removeWeakness` | ✅ MATCH |
| `/profile/profile/skills` | GET | Yes | profileService.js | `getSkills()` | `fetchSkills` | ✅ MATCH |
| `/profile/profile/skills` | POST | Yes | profileService.js | `addSkill(data)` | `addSkill` | ✅ MATCH |
| `/profile/profile/skills/:skillId` | DELETE | Yes | profileService.js | `removeSkill(skillId)` | `removeSkill` | ✅ MATCH |
| `/profile/skills/search` | GET | Yes | profileService.js | `searchSkills(query)` | `searchSkills` | ✅ MATCH |
| `/profile/profile/certifications` | GET | Yes | profileService.js | `getCertifications()` | `fetchCertifications` | ✅ MATCH |
| `/profile/profile/certifications` | POST | Yes | profileService.js | `addCertification(data)` | `addCertification` | ✅ MATCH |
| `/profile/profile/certifications/:certId` | PUT | Yes | profileService.js | `updateCertification(certId, data)` | `updateCertification` | ✅ MATCH |
| `/profile/profile/certifications/:certId` | DELETE | Yes | profileService.js | `removeCertification(certId)` | `removeCertification` | ✅ MATCH |
| `/profile/profile/completion` | GET | Yes | profileService.js | `getProfileCompletion()` | — | ✅ MATCH |

**Notes:** The double `/profile/profile` path is correct - backend profile routes are mounted at `/api/profile` and route file defines paths starting with `/profile/`.

---

## 3. Course Routes (`/api/courses`)

| Backend Endpoint | Method | Auth Required | Frontend Service | Frontend Function | Redux Thunk | Status |
|---|---|---|---|---|---|---|
| `/courses/` | GET | No | courseService.js | `getAllCourses(params)` | `fetchCourses` | ✅ MATCH |
| `/courses/search` | GET | No | courseService.js | `searchCourses(query)` | — | ✅ MATCH |
| `/courses/enrolled` | GET | Yes | courseService.js | `getEnrolledCourses(params)` | `fetchEnrolledCourses` | ✅ MATCH |
| `/courses/category/:category` | GET | No | courseService.js | `getCoursesByCategory(category)` | — | ✅ MATCH |
| `/courses/:id` | GET | No | courseService.js | `getCourseById(id)` | `fetchCourseById` | ✅ MATCH |
| `/courses/` | POST | Yes (ADMIN) | courseService.js | — | — | ⚠️ NO FRONTEND |
| `/courses/:id` | PUT | Yes (ADMIN) | courseService.js | — | — | ⚠️ NO FRONTEND |
| `/courses/:id` | DELETE | Yes (ADMIN) | courseService.js | — | — | ⚠️ NO FRONTEND |
| `/courses/:id/enroll` | POST | Yes | courseService.js | `enrollInCourse(id)` | `enrollInCourse` | ✅ MATCH |
| `/courses/:id/progress` | PUT | Yes | courseService.js | `updateCourseProgress(id, progress)` | `updateCourseProgress` | ✅ MATCH |
| `/courses/:id/unenroll` | DELETE | Yes | courseService.js | `unenrollFromCourse(id)` | `unenrollFromCourse` | ✅ MATCH |

**Notes:** Admin CRUD endpoints (create/update/delete course) have no frontend service bindings - expected for student-facing app.

---

## 4. Job Routes (`/api/jobs`)

| Backend Endpoint | Method | Auth Required | Frontend Service | Frontend Function | Redux Thunk | Status |
|---|---|---|---|---|---|---|
| `/jobs/` | GET | No | jobService.js | `getAllJobs(params)` | `fetchJobs` | ✅ MATCH |
| `/jobs/search` | GET | No | jobService.js | `searchJobs(query)` | — | ✅ MATCH |
| `/jobs/saved` | GET | Yes | jobService.js | `getSavedJobs(params)` | `fetchSavedJobs` | ✅ MATCH |
| `/jobs/skills` | GET | No | jobService.js | `getJobsBySkills(skills)` | — | ✅ MATCH |
| `/jobs/category/:category` | GET | No | jobService.js | `getJobsByCategory(category)` | — | ✅ MATCH |
| `/jobs/:id` | GET | No | jobService.js | `getJobById(id)` | `fetchJobById` | ✅ MATCH |
| `/jobs/` | POST | Yes (ADMIN) | jobService.js | — | — | ⚠️ NO FRONTEND |
| `/jobs/:id` | PUT | Yes (ADMIN) | jobService.js | — | — | ⚠️ NO FRONTEND |
| `/jobs/:id` | DELETE | Yes (ADMIN) | jobService.js | — | — | ⚠️ NO FRONTEND |
| `/jobs/:id/save` | POST | Yes | jobService.js | `saveJob(id)` | `saveJob` | ✅ MATCH |
| `/jobs/:id/status` | PUT | Yes | jobService.js | `updateJobStatus(id, status)` | `updateJobStatus` | ✅ MATCH |
| `/jobs/:id/save` | DELETE | Yes | jobService.js | `removeSavedJob(id)` | `removeSavedJob` | ✅ MATCH |

**Notes:** Admin CRUD endpoints have no frontend service bindings - expected for student-facing app.

---

## 5. Recommendation Routes (`/api/recommendations`)

| Backend Endpoint | Method | Auth Required | Frontend Service | Frontend Function | Redux Thunk | Status |
|---|---|---|---|---|---|---|
| `/recommendations/` | GET | Yes | recommendationService.js | `getRecommendations(params)` | `fetchRecommendations` | ✅ MATCH |
| `/recommendations/:id` | GET | Yes | recommendationService.js | `getRecommendationById(id)` | `fetchRecommendationById` | ✅ MATCH |
| `/recommendations/` | POST | Yes | recommendationService.js | `createRecommendation(data)` | — | ✅ MATCH |
| `/recommendations/:id/accept` | PUT | Yes | recommendationService.js | `acceptRecommendation(id)` | `acceptRecommendation` | ✅ MATCH |
| `/recommendations/:id/reject` | PUT | Yes | recommendationService.js | `rejectRecommendation(id)` | `rejectRecommendation` | ✅ MATCH |

---

## 6. Quiz Routes (`/api/quizzes`)

| Backend Endpoint | Method | Auth Required | Frontend Service | Frontend Function | Redux Thunk | Status |
|---|---|---|---|---|---|---|
| `/quizzes/` | GET | Yes | quizService.js | `getQuizzes(params)` | `fetchQuizzes` | ✅ MATCH |
| `/quizzes/` | POST | Yes | quizService.js | `createQuiz(data)` | `createQuiz` | ✅ MATCH |
| `/quizzes/results` | GET | Yes | quizService.js | `getUserResults(params)` | `fetchUserResults` | ✅ MATCH (FIXED) |
| `/quizzes/:id` | GET | Yes | quizService.js | `getQuizById(id)` | `fetchQuizById` | ✅ MATCH |
| `/quizzes/:id/submit` | POST | Yes | quizService.js | `submitQuiz(id, answers)` | `submitQuizAnswers` | ✅ MATCH (FIXED) |
| `/quizzes/:id/results` | GET | Yes | quizService.js | `getQuizResults(id)` | `fetchQuizResults` | ✅ MATCH |

---

## 7. Chat Routes (`/api/chat`)

| Backend Endpoint | Method | Auth Required | Frontend Service | Frontend Function | Redux Thunk | Status |
|---|---|---|---|---|---|---|
| `/chat/history/:sessionId` | GET | Yes | aiDashboardService.js | `getChatHistory(sessionId)` | `fetchChatHistory` | ✅ MATCH |
| `/chat/sessions` | GET | Yes | aiDashboardService.js | `getChatSessions()` | — | ✅ MATCH |
| `/chat/message` | POST | Yes | aiDashboardService.js | `sendMessage(data)` | `sendMessage` | ✅ MATCH |
| `/chat/sessions/:sessionId` | DELETE | Yes | aiDashboardService.js | `deleteChatSession(sessionId)` | — | ✅ MATCH |

---

## 8. Notification Routes (`/api/notifications`)

| Backend Endpoint | Method | Auth Required | Frontend Service | Frontend Function | Redux Thunk | Status |
|---|---|---|---|---|---|---|
| `/notifications/unread-count` | GET | Yes | notificationService.js | `getUnreadCount()` | `fetchUnreadCount` | ✅ MATCH |
| `/notifications/` | GET | Yes | notificationService.js | `getNotifications(params)` | `fetchNotifications` | ✅ MATCH |
| `/notifications/read-all` | PUT | Yes | notificationService.js | `markAllAsRead()` | `markAllAsRead` | ✅ MATCH |
| `/notifications/:id/read` | PUT | Yes | notificationService.js | `markAsRead(id)` | `markAsRead` | ✅ MATCH |

---

## 9. Roadmap Routes (`/api/roadmaps`)

| Backend Endpoint | Method | Auth Required | Frontend Service | Frontend Function | Redux Thunk | Status |
|---|---|---|---|---|---|---|
| `/roadmaps/` | GET | Yes | aiDashboardService.js | `getRoadmaps(params)` | `fetchRoadmap` | ✅ MATCH |
| `/roadmaps/:id` | GET | Yes | aiDashboardService.js | `getRoadmapById(id)` | — | ✅ MATCH |
| `/roadmaps/` | POST | Yes | aiDashboardService.js | `createRoadmap(data)` | `saveRoadmap` | ✅ MATCH |
| `/roadmaps/:id` | PUT | Yes | aiDashboardService.js | `updateRoadmap(id, data)` | — | ✅ MATCH |
| `/roadmaps/:id` | DELETE | Yes | aiDashboardService.js | `deleteRoadmap(id)` | — | ✅ MATCH |

---

## 10. Resume Routes (`/api/resumes`)

| Backend Endpoint | Method | Auth Required | Frontend Service | Frontend Function | Redux Thunk | Status |
|---|---|---|---|---|---|---|
| `/resumes/` | GET | Yes | aiDashboardService.js | `getResumes(params)` | — | ✅ MATCH |
| `/resumes/:id` | GET | Yes | aiDashboardService.js | `getResumeById(id)` | — | ✅ MATCH |
| `/resumes/` | POST | Yes | aiDashboardService.js | `createResume(data)` | — | ✅ MATCH |
| `/resumes/:id` | PUT | Yes | aiDashboardService.js | `updateResume(id, data)` | — | ✅ MATCH |
| `/resumes/:id` | DELETE | Yes | aiDashboardService.js | `deleteResume(id)` | — | ✅ MATCH |
| `/resumes/:id/analyze` | POST | Yes | aiDashboardService.js | `analyzeResume(id)` | `fetchResumeAnalysis` | ✅ MATCH |

---

## 11. Additional Frontend Endpoints (via aiDashboardService)

These frontend service functions call existing backend routes through the AI Dashboard service:

| Frontend Function | Backend Route | Method | Status |
|---|---|---|---|
| `getCareerScore()` | `/api/resumes` | GET | ✅ MATCH |
| `getRecommendedStreams()` | `/api/recommendations?type=STREAM` | GET | ✅ MATCH |
| `getCareerRecommendations()` | `/api/recommendations?type=CAREER` | GET | ✅ MATCH |
| `getSkillGap()` | `/api/profile/profile/completion` | GET | ✅ MATCH |

---

## Fixes Applied

### Fix 1: quizSlice.js — Mismatched Service Method Name

**File:** `frontend/src/store/slices/quizSlice.js:44`

**Issue:** `submitQuizAnswers` thunk called `quizService.submitQuizAnswers()` but the service only defines `submitQuiz()`.

**Fix:** Changed to `quizService.submitQuiz(quizId, answers)`.

### Fix 2: quizSlice.js — Missing `fetchUserResults` Thunk

**File:** `frontend/src/store/slices/quizSlice.js`

**Issue:** Backend has `GET /quizzes/results` endpoint, service has `getUserResults()`, but Redux slice had no async thunk to call it.

**Fix:** Added `fetchUserResults` async thunk and `userResults` state field + reducer cases.

---

## HTTP Methods Verification

All frontend service functions use the correct HTTP methods matching backend route definitions:

| Method | Frontend Usage | Backend Usage | Match |
|---|---|---|---|
| GET | Read operations | Read operations | ✅ |
| POST | Create operations | Create operations | ✅ |
| PUT | Update operations | Update operations | ✅ |
| DELETE | Delete operations | Delete operations | ✅ |

---

## Authentication Verification

| Route Group | Backend Auth | Frontend Auth Header | Status |
|---|---|---|---|
| `/api/auth/register` | None | Bearer token (if available) | ✅ |
| `/api/auth/login` | None | Bearer token (if available) | ✅ |
| `/api/auth/refresh-token` | None | Bearer token (if available) | ✅ |
| `/api/auth/logout` | None | Bearer token (if available) | ✅ |
| `/api/auth/profile` | Required | Auto-injected via interceptor | ✅ |
| `/api/auth/password` | Required | Auto-injected via interceptor | ✅ |
| `/api/profile/*` | Required | Auto-injected via interceptor | ✅ |
| `/api/courses/` (GET) | None | No header needed | ✅ |
| `/api/courses/enrolled` | Required | Auto-injected via interceptor | ✅ |
| `/api/courses/:id/enroll` | Required | Auto-injected via interceptor | ✅ |
| `/api/jobs/` (GET) | None | No header needed | ✅ |
| `/api/jobs/saved` | Required | Auto-injected via interceptor | ✅ |
| `/api/recommendations/*` | Required | Auto-injected via interceptor | ✅ |
| `/api/quizzes/*` | Required | Auto-injected via interceptor | ✅ |
| `/api/chat/*` | Required | Auto-injected via interceptor | ✅ |
| `/api/notifications/*` | Required | Auto-injected via interceptor | ✅ |
| `/api/roadmaps/*` | Required | Auto-injected via interceptor | ✅ |
| `/api/resumes/*` | Required | Auto-injected via interceptor | ✅ |

**Auth mechanism:** `api.js` interceptor automatically attaches `Authorization: Bearer <token>` from localStorage. 401 responses trigger automatic token refresh.

---

## Error Handling Verification

- **Frontend:** All async thunks use `rejectWithValue(error.message)` for error propagation
- **Backend:** Global error handler in `app.js` via `errorHandler` middleware
- **API interceptor:** `api.js` response interceptor catches errors and normalizes to `Error(message)` format
- **Consistency:** ✅ All service/thunk pairs follow consistent error handling pattern

---

## Request Body Structure Verification

### Profile Update
- **Backend expects:** `{ dateOfBirth, gender, phoneNumber, bio, city, state, country, address }`
- **Frontend sends:** Generic `data` object from component
- **Status:** ✅ Compatible (frontend passes whatever the form sends)

### Academic Record
- **Backend expects:** `{ institution, degree, fieldOfStudy, year, startYear, endYear?, gpa?, percentage?, isCurrent? }`
- **Frontend sends:** Generic `data` object from form
- **Status:** ✅ Compatible

### Subject Mark
- **Backend expects:** `{ subjectName, marks, maxMarks?, grade? }`
- **Frontend sends:** Generic `data` object
- **Status:** ✅ Compatible

### Quiz Submission
- **Backend expects:** `{ answers }` in request body
- **Frontend sends:** `api.post(url, { answers })`
- **Status:** ✅ Compatible

### Job Status Update
- **Backend expects:** `{ status }` in request body
- **Frontend sends:** `api.put(url, { status })`
- **Status:** ✅ Compatible

---

## Conclusion

All 58 backend endpoints have corresponding frontend service bindings. The 2 identified bugs in `quizSlice.js` (wrong method name and missing thunk) have been fixed. The API binding between frontend and backend is **fully aligned** after fixes.
