# EduGuideAI — Project Black Book

> **Full Reference Documentation**  
> *For developers, interns, and anyone joining the project*

---

## Table of Contents

1. [Why This Project Exists](#1-why-this-project-exists)
2. [Tech Stack Overview](#2-tech-stack-overview)
3. [Project Architecture at a Glance](#3-project-architecture-at-a-glance)
4. [Frontend Deep Dive](#4-frontend-deep-dive)
5. [Backend Deep Dive](#5-backend-deep-dive)
6. [Job Scraper Deep Dive](#6-job-scraper-deep-dive)
7. [Database Schema & Relations](#7-database-schema--relations)
8. [How Everything Connects](#8-how-everything-connects)
9. [Key Files Cheat Sheet](#9-key-files-cheat-sheet)

---

## 1. Why This Project Exists

### The Problem

Students and early-career professionals face **three major challenges**:

1. **Career Confusion** — "What should I study? What career fits me?" Most students pick streams based on parental pressure, peer influence, or marks — not genuine aptitude or interest.

2. **Information Overload** — There are thousands of courses, jobs, and career paths. No centralized platform that connects the dots between a student's profile, available courses, relevant jobs, and a structured roadmap.

3. **No Personalized Guidance** — Career counselors are expensive and inaccessible. AI-powered tools exist but are fragmented — you'd need separate tools for resume analysis, skill gap assessment, career recommendation, quiz assessment, etc.

### The Solution: EduGuideAI

EduGuideAI is a **unified, AI-powered student counseling and career guidance platform** that brings everything together:

```
┌─────────────────────────────────────────────────────────────────┐
│                     EduGuideAI Platform                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │ Profile  │  │   AI     │  │ Courses  │  │   Resume      │  │
│  │ Builder  │  │ Counselor│  │ & Jobs   │  │   Analyzer    │  │
│  ├──────────┤  ├──────────┤  ├──────────┤  ├───────────────┤  │
│  │Academic  │  │Career    │  │Browse    │  │AI-powered     │  │
│  │Records   │  │Recommend │  │Enroll    │  │Feedback &     │  │
│  │Skills    │  │Skill Gap │  │Track     │  │Suggestions    │  │
│  │Interests │  │Roadmap   │  │Progress  │  │Tailoring      │  │
│  │Goals     │  │Chat Bot  │  │Save Jobs │  │               │  │
│  └──────────┘  └──────────┘  └──────────┘  └───────────────┘  │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐                   │
│  │  Quiz    │  │  Future  │  │ Knowledge    │                   │
│  │  System  │  │Simulator │  │ Center       │                   │
│  ├──────────┤  ├──────────┤  ├──────────────┤                   │
│  │Personality│ │"What if" │  │Career        │                   │
│  │Interest  │  │Scenarios │  │Articles      │                   │
│  │Aptitude  │  │Path      │  │Trending      │                   │
│  │Analysis  │  │Analysis  │  │News          │                   │
│  └──────────┘  └──────────┘  └──────────────┘                   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │               Admin Dashboard (Admin Only)               │    │
│  │  Users CRUD | Courses CRUD | Jobs CRUD | Quiz Mgmt      │    │
│  │  Analytics | Platform Stats | Job Scraper Controls       │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Who Uses It?

| Role | What They Do |
|------|-------------|
| **Student** | Build profile, take quizzes, get AI career recommendations, browse courses & jobs, chat with AI counselor, analyze resume, generate roadmaps |
| **Admin** | Manage users/courses/jobs, trigger job scraping, view platform analytics, oversee content |

### Key Value Propositions

| Feature | Why It Matters |
|---------|---------------|
| **AI Career Recommendations** | Uses Gemini API + user profile data to suggest careers matched to skills/interests/academics |
| **Skill Gap Analysis** | Tells you exactly what skills you're missing for your dream job |
| **Learning Roadmaps** | Generates step-by-step study plans with timelines |
| **AI Chat Counselor** | 24/7 career guidance — asks questions, gets answers (rate-limited by subscription) |
| **Resume Analysis** | AI scores your resume and gives actionable improvement suggestions |
| **Future Path Simulator** | "What if I study X vs Y?" — simulates career outcomes |
| **Quiz System** | Personality, interest, aptitude, learning style assessments |
| **Auto Job Scraper** | Automatically pulls jobs from LinkedIn, Indeed, Naukri every 6 hours |
| **Course/Job Matching** | AI matches your profile to suitable courses and jobs |

---

## 2. Tech Stack Overview

### 2.1 Complete Technology Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                        EduGuideAI Stack                              │
│                                                                      │
│  ┌─────────────────────┐    ┌─────────────────────────────────────┐ │
│  │    FRONTEND          │    │    BACKEND                          │ │
│  │                      │    │                                     │ │
│  │  React 19            │    │  Node.js + Express.js               │ │
│  │  Redux Toolkit 2.5   │    │  Prisma ORM + PostgreSQL            │ │
│  │  TailwindCSS 3.4     │    │  Gemini API (AI Services)           │ │
│  │  FlyonUI 2.4         │    │  JWT Auth (bcryptjs + jsonwebtoken) │ │
│  │  Lucide React (icons)│    │  express-validator (input validation│ │
│  │  React Router DOM 7  │    │  helmet (security headers)          │ │
│  │  React Toastify 11   │    │  multer (file uploads)              │ │
│  │  Axios (HTTP client) │    │  morgan (request logging)           │ │
│  │  Vite 6 (build tool) │    │  ESLint (linting)                   │ │
│  └─────────────────────┘    └─────────────────────────────────────┘ │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    JOB SCRAPER                               │    │
│  │  Standalone Node.js project                                  │    │
│  │  Axios + Cheerio (HTML parsing, no browser)                 │    │
│  │  node-cron (scheduling), winston (logging)                  │    │
│  │  Prisma ORM (direct DB access)                              │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    DATABASE                                  │    │
│  │  PostgreSQL (hosted at 54.234.20.250:5432)                  │    │
│  │  20 tables, 9 enums, full relation graph                    │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Frontend Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.0.0 | UI library |
| `react-dom` | ^19.0.0 | DOM rendering |
| `@reduxjs/toolkit` | ^2.5.0 | State management |
| `react-redux` | ^9.2.0 | React-Redux bindings |
| `react-router-dom` | ^7.1.1 | Client-side routing |
| `axios` | ^1.7.9 | HTTP client |
| `tailwindcss` | ^3.4.17 | Utility CSS framework |
| `flyonui` | ^2.4.1 | Pre-built UI components |
| `lucide-react` | ^1.17.0 | Icon library |
| `react-toastify` | ^11.0.3 | Toast notifications |
| `vite` | ^6.0.7 | Build tool & dev server |

### 2.3 Backend Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^4.18 | Web framework |
| `@prisma/client` | ^5.10 | Database ORM |
| `prisma` | ^5.10 | Schema management & migrations |
| `@google/generative-ai` | — | Gemini AI API client |
| `bcryptjs` | — | Password hashing |
| `jsonwebtoken` | — | JWT generation & verification |
| `express-validator` | — | Input validation |
| `cors` | — | Cross-origin requests |
| `helmet` | — | Security headers |
| `multer` | — | File upload handling |
| `morgan` | — | HTTP request logging |
| `nodemon` | — | Dev hot-reload |

### 2.4 Job Scraper Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `axios` | ^1.6.7 | HTTP requests to job portals |
| `cheerio` | ^1.0.0 | HTML parsing (server-side jQuery) |
| `@prisma/client` | ^5.10 | Direct database access |
| `node-cron` | ^3.0.3 | Cron job scheduling |
| `winston` | ^3.11.0 | Logging with file rotation |

---

## 3. Project Architecture at a Glance

### 3.1 Folder Structure

```
D:\EduGuideAi - Copy/
│
├── frontend/                    # React SPA (Vite + React 19)
│   ├── package.json             # Frontend dependencies
│   ├── vite.config.js           # Vite config (proxy /api → :5000)
│   ├── src/
│   │   ├── App.jsx              # Routes (22 routes, 3 groups)
│   │   ├── main.jsx             # Entry point (Redux + Router)
│   │   ├── pages/               # 18 page components
│   │   ├── components/          # Reusable UI (4 sub-dirs)
│   │   ├── features/            # Feature modules (9 feature dirs)
│   │   ├── services/            # 10 API service files
│   │   ├── store/               # Redux store + 10 slices
│   │   ├── hooks/               # 2 custom hooks
│   │   ├── utils/               # Constants file
│   │   └── styles/              # Global styles
│   └── ...
│
├── backend/                     # Express API Server
│   ├── package.json              # Backend dependencies
│   ├── .env                      # Environment variables (DB URL, JWT, Gemini)
│   ├── src/
│   │   ├── server.js             # Entry point (Express app bootstrap)
│   │   ├── app.js                # Express app (middleware, routes)
│   │   ├── routes/               # 12 route files
│   │   ├── controllers/          # 11 controller files
│   │   ├── services/             # 10 service files + ai/ subdir
│   │   ├── repositories/         # 7 repository files (Prisma queries)
│   │   ├── middlewares/          # 6 middleware files
│   │   ├── validations/          # 11 validation files
│   │   └── utils/                # Utility functions
│   └── prisma/                   # Backend Prisma schema (copy)
│
├── job-scraper/                 # Standalone Job Scraper
│   ├── package.json              # Scraper dependencies
│   ├── .env                      # Config (DB URL, limits)
│   ├── prisma/schema.prisma      # Simplified Job model
│   ├── src/
│   │   ├── index.js              # Entry + CLI handler
│   │   ├── scheduler.js          # Cron scheduler (every 6h)
│   │   ├── config.js             # Config loader
│   │   ├── scrapers/             # 3 scrapers + base class
│   │   │   ├── base.js           # BaseScraper (HTTP, retry, rate-limit)
│   │   │   ├── indeed.js         # Indeed scraper
│   │   │   ├── linkedin.js       # LinkedIn scraper
│   │   │   └── naukri.js         # Naukri scraper
│   │   ├── database/db.js        # DB operations
│   │   └── utils/                # Cleaner, categorizer, logger
│   └── logs/                     # Runtime logs
│
├── prisma/                      # Root Prisma schema (source of truth)
│   ├── schema.prisma             # Full schema (20 models)
│   ├── migrations/               # DB migration files
│   └── seeds/seed.js             # Seed data (53 skills)
│
├── backend_routes.md             # API documentation (85 endpoints)
├── frontend_routes.md            # Frontend architecture doc
├── job_scraper_deep_dive.md      # Job scraper documentation
├── project_black_book.md         # ← This file
├── PROJECT_STRUCTURE.md          # File count & structure overview
├── ADMIN_MODULE.md               # Admin module documentation
├── AI_INTEGRATION_COMPLETE.md    # AI integration status
├── AI_INTEGRATION_PLAN.md        # AI integration plan
├── AGENTS.md                     # Agent instructions (for AI coding assistants)
├── agent_docs/                   # Agent documentation files
└── .gitignore
```

### 3.2 How the Three Sub-Projects Communicate

```
Frontend (port 5173)
    │
    │  HTTP (via Axios)
    │  All requests go to /api/...
    │  Vite proxies /api → http://localhost:5000
    │
    ▼
Backend (port 5000)
    │
    ├── Prisma ORM ─────► PostgreSQL (54.234.20.250:5432)
    │
    └── child_process.spawn() ───► Job Scraper (standalone Node.js process)
                                         │
                                         └── Prisma ORM ───► PostgreSQL (same DB)
```

> **Note:** Both the backend and job scraper connect to the **same PostgreSQL database** using Prisma. They share the `jobs` table. The scraper inserts jobs, the backend serves them via API.

---

## 4. Frontend Deep Dive

### 4.1 Architecture Pattern

```
Page (18 pages)
  │
  ├── dispatch(asyncThunk)        → Redux Thunk
  │       │                            │
  │       │                            └── calls Service function
  │       │                                    │
  │       │                                    └── Axios GET/POST/PUT/DELETE
  │       │                                            │
  │       │                                            └── /api/* (proxied to backend)
  │       │                                                    │
  │       │                                                    └── Express route → controller → service → repository → Prisma → DB
  │       │
  │       └── useSelector() ← Redux state updates
  │
  ├── Feature Components (9 feature dirs)
  └── Reusable Components (4 sub-dirs)
```

### 4.2 Routing Structure (22 routes)

**Public routes (no auth):** `/login`, `/register`

**Protected routes (auth required):**
- `/dashboard` — User dashboard (stats, quick actions, activity timeline)
- `/ai-dashboard` — AI-powered career insights & recommendations
- `/courses` — Browse courses with filters
- `/courses/:id` — Course detail page with enroll button
- `/jobs` — Browse jobs with filters
- `/jobs/:id` — Job detail page with save/apply
- `/quiz` — Quiz listing page
- `/quiz/:id` — Take a quiz
- `/quiz/:id/results` — Quiz results
- `/profile` — View/edit full profile
- `/profile-wizard` — Onboarding profile setup (step-by-step)
- `/settings` — Account & subscription settings
- `/resume-builder` — Create & analyze resumes
- `/knowledge-center` — Career articles (PRO tier+)

**Admin routes (auth + ADMIN role):**
- `/admin` — Admin dashboard (stats, activity)
- `/admin/users` — Manage users
- `/admin/courses` — Manage courses
- `/admin/jobs` — Manage jobs + trigger scraper
- `/admin/quizzes` — Manage quizzes
- `/admin/analytics` — Platform analytics

### 4.3 State Management (10 Redux Slices)

| Slice | Key State | Key Actions |
|-------|-----------|-------------|
| `auth` | user, token, isAuthenticated | login, register, logout, fetchProfile |
| `profile` | academicRecords, interests, skills, etc. | fetchProfile, add/update/delete sub-resources |
| `courses` | courses[], enrolledCourses[], pagination | fetch, enroll, progress, unenroll |
| `jobs` | jobs[], savedJobs[], pagination | fetch, save, updateStatus, remove |
| `quizzes` | quizzes[], currentQuiz, results | fetch, create, submit, fetchResults |
| `recommendations` | recommendations[] | fetch, accept, reject |
| `notifications` | notifications[], unreadCount | fetch, markRead, markAllRead |
| `aiDashboard` | careerScore, recommendations, roadmap | fetchScore, generate, fetchRoadmap |
| `ai` | careerRecommendations, chatMessages, skillGap | fetchRecommendation, sendChat, analyzeSkillGap |
| `admin` | stats, users[], courses[], jobs[] | fetchStats, CRUD users/courses/jobs |

### 4.4 API Services (10 files)

Each service file maps 1:1 to a backend resource:

| Service | Base Path | Functions |
|---------|-----------|-----------|
| `authService.js` | `/auth` | login, register, refreshToken, logout, getProfile |
| `profileService.js` | `/profile` | get/update profile, academic records, interests, skills, etc. (28 functions) |
| `courseService.js` | `/courses` | list, search, enroll, progress, unenroll |
| `jobService.js` | `/jobs` | list, search, save, status, saved jobs |
| `quizService.js` | `/quizzes` | list, create, generate AI quiz, submit, results |
| `aiService.js` | `/ai` | career/stream recommendation, skill gap, roadmap, chat, resume, etc. |
| `aiDashboardService.js` | Various | career score, recommendations, roadmaps, chat history, resumes |
| `recommendationService.js` | `/recommendations` | get, accept, reject recommendations |
| `notificationService.js` | `/notifications` | list, unread count, mark read |
| `adminService.js` | `/admin` | stats, users/courses/jobs CRUD, scrape jobs |

### 4.5 Custom Hooks (2)

| Hook | Purpose |
|------|---------|
| `useAuth()` | Wraps auth slice — provides `login()`, `register()`, `logout()`, `checkAuth()` with toast + navigation |
| `useApi(apiCall)` | Generic async hook — returns `{ data, loading, error, execute(...args), reset() }` |

---

## 5. Backend Deep Dive

### 5.1 Architecture Pattern (Layered)

```
HTTP Request
    │
    ▼
Routes (12 files) ──► define URL patterns + attach middleware + controllers
    │
    ▼
Middlewares ──► authenticate (JWT), authorize (roles), validate (express-validator), rate-limit, error handler
    │
    ▼
Controllers (11 files) ──► extract req data, call service, send response (thin layer)
    │
    ▼
Services (10 files + ai/) ──► business logic, AI calls, child process management
    │
    ▼
Repositories (7 files) ──► Prisma queries (data access layer)
    │
    ▼
Prisma ORM ──► PostgreSQL
```

### 5.2 API Endpoints (85 total)

| Section | Prefix | Endpoints | Auth | Admin |
|---------|--------|-----------|:----:|:-----:|
| Health | `/api/health` | 1 | — | — |
| Auth | `/api/auth` | 6 | 2/6 | — |
| Profile | `/api/profile` | 18 | All | — |
| Courses | `/api/courses` | 9 | 3/9 | 3/9 |
| Jobs | `/api/jobs` | 11 | 3/11 | 3/11 |
| Recommendations | `/api/recommendations` | 6 | All | — |
| Quizzes | `/api/quizzes` | 7 | All | — |
| Chat | `/api/chat` | 4 | All | — |
| Notifications | `/api/notifications` | 4 | All | — |
| Roadmaps | `/api/roadmaps` | 5 | All | — |
| Resumes | `/api/resumes` | 6 | All | — |
| Admin | `/api/admin` | 27 | All | All |
| AI | `/api/ai` | 10 | All | — |
| **Total** | | **85** | **~67** | **27** |

### 5.3 Middleware Stack

| Middleware | Purpose |
|-----------|---------|
| `authenticate.js` | Verifies JWT from `Authorization: Bearer <token>` or cookie. Sets `req.user` |
| `authorize.js` | Checks `req.user.role` against allowed roles array |
| `validate.js` | Runs express-validator rules, returns 400 with structured errors |
| `subscriptionLimit.js` | `checkChatLimit` — daily chat limit by tier (NEWBIE=5, PRO=20, PRO_PLUS=50). `enforceTier` — checks subscription tier requirement |

### 5.4 AI Services (`backend/src/services/ai/`)

12 AI service files powered by Google Gemini API:

| File | Function | Input | Output |
|------|----------|-------|--------|
| `careerRecommender.js` | Career recommendations | Interests, skills, education | Career matches with confidence scores |
| `streamRecommender.js` | Academic stream suggestions | Academic performance, interests | Stream recommendations |
| `skillGapAnalyzer.js` | Skill gap analysis | Target role, current skills | Missing skills, learning resources |
| `roadmapGenerator.js` | Learning roadmap | Goal, current level, timeframe | Phased roadmap with tasks & resources |
| `chatCounselor.js` | AI chat counselor | Message, session context | Conversational response |
| `resumeAnalyzer.js` | Resume analysis | Resume content, target role | Score, strengths, weaknesses, suggestions |
| `futureSimulator.js` | Career path simulation | Current path, choices, timeframe | Timeline scenarios |
| `quizAnalyzer.js` | Quiz result analysis | Quiz answers, type | Personality insights, suggestions |
| `courseRecommender.js` | Course recommendations | Skills, interests, level, budget | Course matches |
| `jobMatcher.js` | Job matching | Skills, experience, preferences | Job matches (with mock fallback) |
| `resumeCompare.js` | Resume-to-job comparison | Job description | Match score, tailoring suggestions |
| `newsGenerator.js` | Knowledge center articles | User profile | Personalized career articles |

### 5.5 Authentication Flow

```
1. REGISTER: User submits firstName, lastName, email, password
       │
       ▼
2. BACKEND: bcryptjs.hash(password) → stores hash in DB
       │
       ▼
3. RESPONSE: Returns { user, accessToken (1d), refreshToken (7d) }
       │
       ▼
4. FRONTEND: Stores tokens in localStorage
       │
       ▼
5. EVERY REQUEST: Axios interceptor attaches Authorization: Bearer <token>
       │
       ▼
6. BACKEND: authenticate middleware verifies JWT → sets req.user
       │
       ▼
7. TOKEN EXPIRY: Axios interceptor catches 401 → calls /auth/refresh-token
       │
       ▼
8. BACKEND: Verifies refresh token → issues new access token
       │
       ▼
9. RETRY: Original request is retried with new token
```

---

## 6. Job Scraper Deep Dive

### 6.1 What It Does

The job scraper automatically searches LinkedIn, Indeed, and Naukri for job listings and saves them to the database. It runs:

- **Manually** — Admin clicks "Scrape Jobs" in the admin panel
- **Automatically** — Cron scheduler runs every 6 hours

### 6.2 Architecture

```
Admin clicks "Trigger Scraper" in frontend
    │
    ▼
POST /api/admin/jobs/scrape
    │
    ▼
Backend (admin.service.js)
    │
    ├── Spawns child process:
    │   node job-scraper/src/index.js scrape "Mumbai" "engineer" 50
    │
    ├── Reads stdout for PROGRESS_UPDATE: JSON lines
    │   (updates in-memory status object)
    │
    └── Frontend polls GET /api/admin/jobs/scrape/status every 1.5s
            │
            └── Displays progress bar in UI
```

### 6.3 Scraping Pipeline

```
FOR EACH scraper (Indeed → LinkedIn → Naukri):
    FOR EACH search query (10 job titles):
        FOR EACH location (student cities or admin-provided):
            
            1. fetchPage(url) ──► axios with retry (3x) + rate limiting (2s)
                    │
                    ▼
            2. parseJobsPage(html) ──► cheerio (CSS selectors)
                    │
                    ▼
            3. extractJobFromCard($, element) ──► raw job data
                    │
                    ▼
            4. scrapeJobDetails(url) ──► fetch individual job page
                    │
                    ▼
            5. cleanJobData(rawJob) ──► cleaner.js pipeline
                    │
                    ▼
            6. categorizeJob(title, description) ──► 11 categories
                    │
                    ▼
ALL JOBS COLLECTED
    │
    ▼
deduplicateJobs(allJobs) ──► by title|||company|||location
    │
    ▼
insertJobs(uniqueJobs) ──► batch insert (50 at a time)
    │
    ▼
PostgreSQL (jobs table)
```

### 6.4 Sources & Selectors

| Source | URL Pattern | Key CSS Selectors |
|--------|-------------|-------------------|
| Indeed | `indeed.com/jobs?q={query}&l={location}&start={page}` | `h2.jobTitle a`, `span[data-testid="company-name"]`, `div[data-testid="text-location"]` |
| LinkedIn | `linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords={query}&location={location}&start={page}` | `h3.base-search-card__title`, `h4.base-search-card__subtitle`, `span.job-search-card__location` |
| Naukri | `naukri.com/jobsapi/v3/search?q={query}&l={location}&pageNo={page}` | `a.title`, `a.subTitle`, `span.locWdth`, `span.skill` |

### 6.5 Data Processing

| Step | What It Does |
|------|-------------|
| `cleanJobData()` | Strips HTML, validates URLs, normalizes salary (INR/USD/EUR), normalizes experience text |
| `extractSkillsFromText()` | Matches text against 57 hardcoded skills (46 technical + 11 soft skills) |
| `categorizeJob()` | Scores title+description against 11 categories' keywords. Title match = 3pts, desc = 2pts, skill = 1pt |
| `deduplicateJobs()` | Groups by `title|||company|||location`, keeps newest `postedAt` |
| `insertJobs()` | Checks URL uniqueness, then title+company combo. Inserts in batches of 50 |

---

## 7. Database Schema & Relations

### 7.1 Entity-Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PostgreSQL: EGAIDB                              │
│                                                                              │
│  ┌──────────────┐       ┌───────────────────┐       ┌──────────────────┐    │
│  │     User     │ 1──N │   RefreshToken     │       │     Skill        │    │
│  │  (users)     │       │  (refresh_tokens)  │       │   (skills)       │    │
│  └──────┬───────┘       └───────────────────┘       └────────┬─────────┘    │
│         │                                                     │              │
│         │ 1                                                   │ 1            │
│         │                                                     │              │
│         ▼                                                     ▼              │
│  ┌──────────────┐ 1──N ┌──────────────────┐          ┌──────────────────┐    │
│  │StudentProfile│──────│ AcademicRecord   │    1──N  │ StudentSkill     │    │
│  │(student_prof)│      │ (academic_records)│         │ (student_skills) │    │
│  └──────┬───────┘      └────────┬─────────┘          └──────────────────┘    │
│         │                       │                                             │
│         │ 1                     │ 1                                           │
│         │                       │                                             │
│         │                       ▼                                             │
│         │                ┌──────────────────┐                                 │
│         │                │  SubjectMark     │                                 │
│         │                │ (subject_marks)  │                                 │
│         │                └──────────────────┘                                 │
│         │                                                                     │
│         ├──1:N── Interest (interests)                                         │
│         ├──1:N── CareerGoal (career_goals)                                    │
│         ├──1:N── Strength (strengths)                                         │
│         ├──1:N── Weakness (weaknesses)                                        │
│         └──1:N── Certification (certifications)                               │
│                                                                              │
│  ┌──────────────┐       ┌──────────────────┐       ┌──────────────────┐    │
│  │     User     │ 1──N │   UserCourse     │──N──1 │     Course       │    │
│  │              │       │  (user_courses)   │       │    (courses)     │    │
│  │              │       └──────────────────┘       └──────────────────┘    │
│  │              │                                                          │
│  │              │       ┌──────────────────┐       ┌──────────────────┐    │
│  │              │ 1──N │    UserJob       │──N──1 │      Job         │    │
│  │              │       │  (user_jobs)     │       │    (jobs)        │    │
│  │              │       └──────────────────┘       └──────────────────┘    │
│  │              │                                                          │
│  │              ├──1:N── Recommendation (recommendations)                  │
│  │              ├──1:N── CareerRoadmap (career_roadmaps)                   │
│  │              ├──1:N── Quiz (quizzes) ──1:N── QuizResult                │
│  │              ├──1:N── ChatHistory (chat_history)                        │
│  │              ├──1:N── ResumeAnalysis (resume_analysis)                  │
│  │              ├──1:N── Notification (notifications)                      │
│  └──────────────┘                                                          │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                        KnowledgeArticle                               │   │
│  │                       (knowledge_articles)                             │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 All Tables with Key Columns

| # | Table | Key Columns | Relations |
|---|-------|-------------|-----------|
| 1 | `users` | id (PK), email (unique), passwordHash, firstName, lastName, role (STUDENT/ADMIN), subscriptionTier (NEWBIE/PRO/PRO_PLUS), isActive, isVerified | → StudentProfile, Recommendation, CareerRoadmap, Quiz, QuizResult, ChatHistory, ResumeAnalysis, Notification, UserCourse, UserJob, RefreshToken |
| 2 | `refresh_tokens` | id (PK), token (unique), userId (FK), expiresAt | → User |
| 3 | `student_profiles` | id (PK), userId (FK unique), dateOfBirth, gender, phone, city, state, country, bio, completionPct | → User, AcademicRecord, Interest, CareerGoal, Strength, Weakness, StudentSkill, Certification |
| 4 | `academic_records` | id (PK), profileId (FK), institution, degree, fieldOfStudy, year (enum), startYear, endYear, gpa, percentage, isCurrent | → StudentProfile, SubjectMark |
| 5 | `subject_marks` | id (PK), academicRecordId (FK), subjectName, marks, maxMarks, grade | → AcademicRecord |
| 6 | `interests` | id (PK), profileId (FK), name, category, level. Unique: [profileId, name] | → StudentProfile |
| 7 | `career_goals` | id (PK), profileId (FK), title, description, targetYear, priority | → StudentProfile |
| 8 | `strengths` | id (PK), profileId (FK), name, category, evidence. Unique: [profileId, name] | → StudentProfile |
| 9 | `weaknesses` | id (PK), profileId (FK), name, category, evidence. Unique: [profileId, name] | → StudentProfile |
| 10 | `skills` | id (PK), name (unique), category | → StudentSkill |
| 11 | `student_skills` | id (PK), profileId (FK), skillId (FK), level, yearsExp. Unique: [profileId, skillId] | → StudentProfile, Skill |
| 12 | `certifications` | id (PK), profileId (FK), name, issuer, issueDate, expiryDate, credentialUrl | → StudentProfile |
| 13 | `courses` | id (PK), title, description, provider, url, duration, level, category, price, currency, rating, isActive | → UserCourse |
| 14 | `user_courses` | id (PK), userId (FK), courseId (FK), status, progress, enrolledAt, completedAt. Unique: [userId, courseId] | → User, Course |
| 15 | `jobs` | id (PK), title, description, company, location, url, salaryRange, experience, skills[], category, type, isActive, postedAt | → UserJob |
| 16 | `user_jobs` | id (PK), userId (FK), jobId (FK), status, appliedAt. Unique: [userId, jobId] | → User, Job |
| 17 | `recommendations` | id (PK), userId (FK), type (enum), title, description, confidence, reasoning (JSON), status (enum), expiresAt | → User |
| 18 | `career_roadmaps` | id (PK), userId (FK), title, description, targetCareer, phases (JSON), progress, isCompleted | → User |
| 19 | `quizzes` | id (PK), userId (FK), title, category (enum), questions (JSON), status, totalScore, maxScore, duration | → User, QuizResult |
| 20 | `quiz_results` | id (PK), quizId (FK), userId (FK), score, maxScore, percentage, answers (JSON), analysis (JSON) | → Quiz, User |
| 21 | `chat_history` | id (PK), userId (FK), sessionId, role (enum), content, metadata (JSON) | → User |
| 22 | `resume_analysis` | id (PK), userId (FK), fileName, fileUrl, status (enum), parsedContent (JSON), analysis (JSON), score | → User |
| 23 | `notifications` | id (PK), userId (FK), type (enum), title, message, data (JSON), isRead | → User |
| 24 | `knowledge_articles` | id (PK), title, summary, content, category, industry, url | (standalone) |

### 7.3 Key Indexes

| Table | Indexes | Purpose |
|-------|---------|---------|
| `jobs` | `[category]`, `[company]`, `[isActive]`, `[postedAt]` | Filtering & sorting |
| `recommendations` | `[userId, type]`, `[userId, status]` | User's recommendations by type/status |
| `quizzes` | `[userId, category]` | User's quizzes filtered by category |
| `chat_history` | `[userId, sessionId]`, `[userId, createdAt]` | Session lookups + chronological |
| `resume_analysis` | `[userId]`, `[status]` | User's resumes + status filtering |
| `notifications` | `[userId, isRead]`, `[userId, createdAt]` | Unread count + chronological listing |

### 7.4 Enums (9)

| Enum | Values | Used In |
|------|--------|---------|
| `UserRole` | `STUDENT`, `ADMIN` | `users.role` |
| `SubscriptionTier` | `NEWBIE`, `PRO`, `PRO_PLUS` | `users.subscriptionTier` |
| `Gender` | `MALE`, `FEMALE`, `OTHER`, `PREFER_NOT_TO_SAY` | `student_profiles.gender` |
| `AcademicYear` | `FRESHMAN`–`POST_GRADUATE` (6 values) | `academic_records.year` |
| `RecommendationType` | `CAREER`, `STREAM`, `COURSE`, `SKILL`, `JOB` | `recommendations.type` |
| `RecommendationStatus` | `PENDING`, `ACCEPTED`, `REJECTED`, `EXPIRED` | `recommendations.status` |
| `QuizCategory` | `CAREER_INTEREST`, `PERSONALITY`, `SKILL_ASSESSMENT`, `APTITUDE`, `LEARNING_STYLE` | `quizzes.category` |
| `NotificationType` | `RECOMMENDATION`–`CHAT` (7 values) | `notifications.type` |
| `ChatRole` | `USER`, `ASSISTANT`, `SYSTEM` | `chat_history.role` |
| `ResumeStatus` | `PENDING`, `ANALYZED`, `FAILED` | `resume_analysis.status` |

---

## 8. How Everything Connects

### 8.1 Complete User Journey

```
1. User visits eduguide.ai
        │
        ▼
2. REGISTERS at /register
        │  POST /api/auth/register
        │  → Creates user in DB
        │  → Returns JWT tokens
        ▼
3. ONBOARDING at /profile-wizard
        │  Step-by-step:
        │  POST /api/profile/profile (basic info)
        │  POST /api/profile/profile/academic-records
        │  POST /api/profile/profile/interests
        │  POST /api/profile/profile/skills
        │  POST /api/profile/profile/career-goals
        │  POST /api/profile/profile/strengths
        │  POST /api/profile/profile/weaknesses
        │  POST /api/profile/profile/certifications
        ▼
4. DASHBOARD at /dashboard
        │  GET /api/auth/profile
        │  GET /api/profile/profile (full profile)
        │  GET /api/courses/enrolled
        │  GET /api/jobs/saved
        │  GET /api/quizzes/results
        ▼
5. AI CAREER GUIDANCE at /ai-dashboard
        │  POST /api/recommendations/generate (trigger AI)
        │  GET /api/recommendations?type=CAREER
        │  GET /api/recommendations?type=STREAM
        │  GET /api/profile/profile/completion (skill gap)
        │  GET /api/roadmaps
        ▼
6. TAKE QUIZZES at /quiz
        │  GET /api/quizzes
        │  POST /api/quizzes/:id/submit
        │  GET /api/quizzes/:id/results
        ▼
7. BROWSE COURSES at /courses
        │  GET /api/courses
        │  POST /api/courses/:id/enroll
        │  PUT /api/courses/:id/progress
        ▼
8. BROWSE JOBS at /jobs
        │  GET /api/jobs
        │  POST /api/jobs/:id/save
        │  PUT /api/jobs/:id/status
        ▼
9. AI CHAT COUNSELOR (any time)
        │  POST /api/ai/chat
        ▼
10. RESUME ANALYSIS at /resume-builder
        │  POST /api/ai/resume-analyze
        │  POST /api/resumes
        │  POST /api/resumes/:id/analyze
        ▼
11. CAREER PATH SIMULATION
        │  POST /api/ai/future-simulate
        ▼
12. AI COURSE/JOB MATCHING
        │  POST /api/ai/course-recommend
        │  POST /api/ai/job-match
```

### 8.2 Data Flow Diagram

```
                          FRONTEND (React SPA)
                     ┌──────────────────────────┐
                     │                          │
                     │  Pages → dispatch →      │
                     │  Thunks → Services →     │
                     │  Axios ──── HTTP ────┐   │
                     │                          │
                     └──────────────────────────┘
                                              │
                                              │
                                     Vite Proxy
                                    localhost:5173
                                          │
                                   /api/* → :5000/api/*
                                          │
                                          ▼
                     ┌──────────────────────────────┐
                     │     BACKEND (Express)         │
                     │                              │
                     │  Routes → Middleware →        │
                     │  Controllers → Services →     │
                     │  Repositories → Prisma ──┐   │
                     │                              │
                     └──────────────────────────────┘
                                              │
                                              │
                                              ▼
                              ┌─────────────────────────┐
                              │     PostgreSQL DB        │
                              │     (54.234.20.250)      │
                              │                          │
                              │  20 tables, 9 enums      │
                              │  Full relation graph     │
                              └──────────────────────────┘
                                              ▲
                                              │
                                              │
                              ┌──────────────────────────┐
                              │   JOB SCRAPER             │
                              │   (child process)         │
                              │                           │
                              │  Indeed → LinkedIn →      │
                              │  Naukri → clean →         │
                              │  categorize → dedup →     │
                              │  Prisma ──────────────────┘
                              └──────────────────────────┘
```

### 8.3 Subscription Tier Model

The platform has 3 subscription tiers that gate certain features:

| Feature | NEWBIE (Free) | PRO | PRO_PLUS |
|---------|:---:|:---:|:--------:|
| Profile building | ✓ | ✓ | ✓ |
| Quiz system | ✓ | ✓ | ✓ |
| Browse courses/jobs | ✓ | ✓ | ✓ |
| Basic AI recommendations | ✓ | ✓ | ✓ |
| AI Chat (daily limit) | 5 messages | 20 messages | 50 messages |
| Resume analysis | ✓ | ✓ | ✓ |
| Skill gap analysis | ✓ | ✓ | ✓ |
| Roadmap generation | ✓ | ✓ | ✓ |
| Future simulation | ✓ | ✓ | ✓ |
| Knowledge Center | — | ✓ | ✓ |
| Resume-to-job comparison | — | — | ✓ |

---

## 9. Key Files Cheat Sheet

### Quick Reference: What File to Edit for What Task

| Task | File to Edit |
|------|-------------|
| **Add a new frontend page** | `frontend/src/App.jsx` (add route) + create page in `frontend/src/pages/` |
| **Add a new API endpoint** | `backend/src/routes/` (route) + `backend/src/controllers/` (controller) + `backend/src/services/` (service) + `backend/src/repositories/` (Prisma query) |
| **Change database schema** | `prisma/schema.prisma` → `npx prisma migrate dev` → `npx prisma generate` |
| **Add a new AI feature** | `backend/src/services/ai/` (AI service) + add route + `frontend/src/services/aiService.js` + `frontend/src/store/slices/aiSlice.js` + feature component |
| **Fix a scraper** | `job-scraper/src/scrapers/{source}.js` |
| **Change scraper schedule** | `job-scraper/src/scheduler.js` |
| **Add subscription tier** | `prisma/schema.prisma` (SubscriptionTier enum) + `backend/src/middlewares/subscriptionLimit.js` |
| **Change auth logic** | `backend/src/middlewares/authenticate.js` + `backend/src/services/auth.service.js` + `frontend/src/store/slices/authSlice.js` |
| **Add seed data** | `prisma/seeds/seed.js` |
| **Change UI theme** | `frontend/tailwind.config.js` + `frontend/src/styles/` |
| **Modify AI prompt** | `backend/src/services/ai/` (specific service file) |
| **Deploy** | `agent_docs/deployment.md` |

### File Count Summary

| Sub-project | Files |
|-------------|:-----:|
| Backend (src) | 72 |
| Frontend (src) | 116 |
| Prisma | 4 |
| Job Scraper | 17 |
| Agent Docs | 7 |
| Root docs | 8 |
| **Total** | **224** |

---

> *This document is a living reference. Update it as the project evolves.*
>
> *Generated from codebase — EduGuideAI Project Black Book*
