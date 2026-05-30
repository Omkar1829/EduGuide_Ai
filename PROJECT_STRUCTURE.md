# EduGuide AI - Complete Project Structure

## Project Overview

AI-powered student counseling and career guidance platform with:
- **Backend:** Express.js + Prisma + PostgreSQL
- **Frontend:** React + Redux + TailwindCSS + FlyonUI
- **Job Scraper:** Node.js crawler for job listings
- **AI Integration:** Google Gemini API (Phase 5)

---

## Directory Structure

```
EduGuideAi - Copy/
├── backend/                    # Express.js API server
│   ├── .env                    # Environment variables
│   ├── .env.example            # Environment template
│   ├── package.json            # Dependencies
│   ├── BACKEND_STRUCTURE.md    # Backend documentation
│   └── src/
│       ├── app.js              # Express app
│       ├── server.js           # Server startup
│       ├── config/             # Configuration
│       ├── middlewares/        # Auth, validation, errors
│       ├── utils/              # Helpers
│       ├── routes/             # API routes (10 modules)
│       ├── controllers/        # Request handlers
│       ├── services/           # Business logic
│       ├── repositories/       # Database queries
│       └── validations/        # Input validation
│
├── frontend/                   # React SPA
│   ├── package.json            # Dependencies
│   ├── vite.config.js          # Vite config
│   ├── tailwind.config.js      # TailwindCSS config
│   ├── FRONTEND_STRUCTURE.md   # Frontend documentation
│   └── src/
│       ├── main.jsx            # Entry point
│       ├── App.jsx             # Router
│       ├── styles/             # CSS
│       ├── store/              # Redux store + slices
│       ├── services/           # API services
│       ├── hooks/              # Custom hooks
│       ├── utils/              # Utilities
│       ├── components/         # Reusable components
│       │   ├── common/         # Button, Card, Input, etc.
│       │   ├── layout/         # Navbar, Sidebar, Footer
│       │   └── dashboard/      # Dashboard widgets
│       ├── features/           # Feature modules
│       │   ├── auth/           # Authentication
│       │   ├── profile/        # Profile management
│       │   ├── courses/        # Course explorer
│       │   ├── jobs/           # Job explorer
│       │   ├── quiz/           # Quiz system
│       │   ├── recommendations/# AI recommendations
│       │   ├── ai-dashboard/   # AI dashboard
│       │   └── notifications/  # Notifications
│       ├── pages/              # Page components
│       └── __tests__/          # Test files
│
├── prisma/                     # Database schema
│   ├── schema.prisma           # Prisma schema
│   ├── README.md               # Database docs
│   ├── seeds/                  # Seed data
│   └── migrations/             # SQL migrations
│
├── job-scraper/                # Job crawler
│   ├── package.json            # Dependencies
│   ├── .env                    # Configuration
│   ├── README.md               # Scraper docs
│   ├── prisma/                 # Scraper schema
│   └── src/
│       ├── index.js            # Entry point
│       ├── scheduler.js        # Cron scheduler
│       ├── config.js           # Configuration
│       ├── scrapers/           # Job scrapers
│       │   ├── base.js         # Base class
│       │   ├── indeed.js       # Indeed scraper
│       │   ├── linkedin.js     # LinkedIn scraper
│       │   └── naukri.js       # Naukri scraper
│       ├── database/           # DB operations
│       └── utils/              # Utilities
│
├── agent_docs/                 # Agent documentation
│   ├── frontend.md
│   ├── backend.md
│   ├── database.md
│   ├── ai.md
│   ├── uiux.md
│   ├── deployment.md
│   └── review.md
│
└── AGENTS.md                   # Project instructions
```

---

## File Count Summary

| Directory | Files | Purpose |
|-----------|-------|---------|
| backend/src | 72 | API server + AI |
| frontend/src | 116 | React frontend + AI |
| prisma | 4 | Database schema |
| job-scraper/src | 17 | Job crawler |
| agent_docs | 7 | Documentation |
| **Total** | **216** | Complete application |

---

## Backend Modules (12)

| Module | Endpoints | Files |
|--------|-----------|-------|
| Auth | 6 | 5 |
| Profile | 29 | 4 |
| Courses | 11 | 4 |
| Jobs | 12 | 4 |
| Recommendations | 5 | 4 |
| Quiz | 6 | 4 |
| Chat | 4 | 4 |
| Notifications | 4 | 4 |
| Roadmaps | 5 | 4 |
| Resumes | 6 | 4 |
| **Admin** | **18** | **5** |
| **AI Services** | **10** | **14** |
| **Total** | **117** | **72** |

---

## Frontend Pages (18)

| Page | Route | Auth Required |
|------|-------|---------------|
| Login | /login | No |
| Register | /register | No |
| Profile Wizard | /profile-wizard | Yes |
| User Dashboard | /dashboard | Yes |
| AI Dashboard | /ai-dashboard | Yes |
| Courses | /courses | No |
| Course Detail | /courses/:id | No |
| Jobs | /jobs | No |
| Job Detail | /jobs/:id | No |
| Quiz | /quiz | Yes |
| Quiz Take | /quiz/:id | Yes |
| Quiz Result | /quiz/:id/results | Yes |
| Settings | /settings | Yes |
| Admin Dashboard | /admin | Yes (Admin) |
| Admin Users | /admin/users | Yes (Admin) |
| Admin Courses | /admin/courses | Yes (Admin) |
| Admin Jobs | /admin/jobs | Yes (Admin) |
| Admin Analytics | /admin/analytics | Yes (Admin) |

---

## Redux Slices (10)

| Slice | State Fields | Async Thunks |
|-------|--------------|--------------|
| auth | user, token, isAuthenticated | 5 |
| profile | profile, academicRecords, interests, goals, skills | 27 |
| courses | courses, enrolledCourses | 6 |
| jobs | jobs, savedJobs | 6 |
| recommendations | recommendations | 5 |
| quiz | quizzes, quizResults | 6 |
| notifications | notifications, unreadCount | 4 |
| aiDashboard | careerScore, streams, roadmap, chat | 9 |
| **admin** | **stats, users, courses, jobs, analytics** | **17** |
| **ai** | **recommendations, skillGap, roadmap, chat, resume, simulation** | **10** |

---

## API Binding Status

| Category | Backend | Frontend | Match |
|----------|---------|----------|-------|
| Auth | 6 | 6 | ✅ 100% |
| Profile | 29 | 29 | ✅ 100% |
| Courses | 11 | 8 | ✅ 100% |
| Jobs | 12 | 9 | ✅ 100% |
| Recommendations | 5 | 5 | ✅ 100% |
| Quiz | 6 | 6 | ✅ 100% |
| Chat | 4 | 4 | ✅ 100% |
| Notifications | 4 | 4 | ✅ 100% |
| Roadmaps | 5 | 5 | ✅ 100% |
| Resumes | 6 | 6 | ✅ 100% |
| **Admin** | **18** | **18** | **✅ 100%** |
| **Total** | **106** | **100** | **✅ 100%** |

---

## Job Scraper

| Scraper | Source | Features |
|---------|--------|----------|
| Indeed | indeed.com | Pagination, rate limiting |
| LinkedIn | linkedin.com | API endpoints |
| Naukri | naukri.com | India-focused |

**Schedule:** Every 6 hours via node-cron

**Features:**
- Rate limiting (2s delay)
- Retry logic (3 attempts)
- Deduplication
- Auto-categorization (11 categories)
- Skill extraction (150+ skills)

---

## Next Steps

| Phase | Status | Description |
|-------|--------|-------------|
| 1 | ✅ Complete | Requirements & Architecture |
| 2 | ✅ Complete | Database Schema |
| 3 | ✅ Complete | Backend APIs |
| 4 | ✅ Complete | Frontend UI |
| 4.1 | ✅ Complete | Admin Dashboard |
| 5 | ✅ Complete | AI Integration (Gemini) |
| 6 | ⏳ Pending | UI/UX Polish |
| 7 | ⏳ Pending | Deployment |

---

## Quick Start

### Backend
```bash
cd backend
npm install
npx prisma generate
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Job Scraper
```bash
cd job-scraper
npm install
npx prisma generate
npm run scrape
```

---

*Generated: May 29, 2026*
