# EduGuide AI - Backend System Structure

## Overview

Production-ready Express.js backend for AI-powered student counseling and career guidance platform.

**Stack:** Node.js, Express.js, PostgreSQL, Prisma ORM, JWT, bcryptjs

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        HTTP REQUEST                             │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         MIDDLEWARES                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │  Helmet  │ │   CORS   │ │  Morgan  │ │  Cookie  │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│  ┌──────────────────────────────────────────────────────┐      │
│  │              JSON Parser + URL Encoder                │      │
│  └──────────────────────────────────────────────────────┘      │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         AUTH MIDDLEWARE                          │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  authenticate.js - JWT verification (Bearer/Cookie)  │      │
│  └──────────────────────────────────────────────────────┘      │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  authorize.js - Role-based access control            │      │
│  └──────────────────────────────────────────────────────┘      │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  validate.js - Express-validator error extraction    │      │
│  └──────────────────────────────────────────────────────┘      │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          ROUTES                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    routes/index.js                        │  │
│  │  Aggregates all route modules into single entry point    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       CONTROLLERS                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │   Auth   │ │ Profile  │ │  Course  │ │   Job    │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │   Quiz   │ │   Chat   │ │  Notif.  │ │ Roadmap  │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│  ┌──────────┐ ┌──────────────────────────────────────┐        │
│  │  Resume  │ │          Recommendation              │        │
│  └──────────┘ └──────────────────────────────────────┘        │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVICES                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │         Business Logic Layer                          │      │
│  │  • Authentication (JWT, bcrypt, refresh tokens)       │      │
│  │  • Profile Management                                 │      │
│  │  • Course/Job Enrollment                              │      │
│  │  • Quiz Scoring & Analysis                            │      │
│  │  • Notification Management                            │      │
│  │  • Roadmap Generation                                 │      │
│  │  • Resume Analysis                                    │      │
│  │  • Recommendation Engine                              │      │
│  └──────────────────────────────────────────────────────┘      │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       REPOSITORIES                               │
│  ┌──────────────────────────────────────────────────────┐      │
│  │         Data Access Layer (Prisma Queries)            │      │
│  │  • Pure database operations                           │      │
│  │  • No business logic                                  │      │
│  │  • Prisma client singleton                            │      │
│  └──────────────────────────────────────────────────────┘      │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     PRISMA CLIENT                                │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  config/prisma.js - Singleton PrismaClient            │      │
│  │  • Dev: query + error + warn logging                  │      │
│  │  • Prod: error logging only                           │      │
│  │  • Global singleton for hot reload                    │      │
│  └──────────────────────────────────────────────────────┘      │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      POSTGRESQL                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  Database: EGAIDB                                     │      │
│  │  Schema: public                                       │      │
│  │  Tables: 23 entities                                  │      │
│  └──────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Folder Structure

```
backend/
├── .env                          # Environment variables (secrets)
├── .env.example                  # Environment template
├── package.json                  # Dependencies & scripts
│
└── src/
    ├── app.js                    # Express app configuration
    ├── server.js                 # Server startup & shutdown
    │
    ├── config/
    │   ├── index.js              # Centralized env config
    │   └── prisma.js             # Singleton PrismaClient
    │
    ├── middlewares/
    │   ├── errorHandler.js       # AppError + error handling
    │   ├── authenticate.js       # JWT verification
    │   ├── authorize.js          # Role-based access
    │   ├── validate.js           # Express-validator wrapper
    │   └── upload.js             # Multer file upload
    │
    ├── utils/
    │   ├── apiResponse.js        # Standardized responses
    │   └── pagination.js         # Pagination helper
    │
    ├── routes/
    │   ├── index.js              # Route aggregator
    │   ├── auth.routes.js        # Auth endpoints
    │   ├── profile.routes.js     # Profile endpoints
    │   ├── course.routes.js      # Course endpoints
    │   ├── job.routes.js         # Job endpoints
    │   ├── recommendation.routes.js
    │   ├── quiz.routes.js        # Quiz endpoints
    │   ├── chat.routes.js        # Chat endpoints
    │   ├── notification.routes.js
    │   ├── roadmap.routes.js     # Roadmap endpoints
    │   └── resume.routes.js      # Resume endpoints
    │
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── profile.controller.js
    │   ├── course.controller.js
    │   ├── job.controller.js
    │   ├── recommendation.controller.js
    │   ├── quiz.controller.js
    │   ├── chat.controller.js
    │   ├── notification.controller.js
    │   ├── roadmap.controller.js
    │   └── resume.controller.js
    │
    ├── services/
    │   ├── auth.service.js
    │   ├── profile.service.js
    │   ├── course.service.js
    │   ├── job.service.js
    │   ├── recommendation.service.js
    │   ├── quiz.service.js
    │   ├── chat.service.js
    │   ├── notification.service.js
    │   ├── roadmap.service.js
    │   ├── resume.service.js
    │   └── ai/                    # AI services (Phase 5)
    │
    ├── repositories/
    │   ├── auth.repository.js
    │   ├── profile.repository.js
    │   ├── course.repository.js
    │   ├── job.repository.js
    │   ├── recommendation.repository.js
    │   ├── userCourse.repository.js
    │   ├── userJob.repository.js
    │   ├── quiz.repository.js
    │   ├── chat.repository.js
    │   ├── notification.repository.js
    │   ├── roadmap.repository.js
    │   └── resume.repository.js
    │
    └── validations/
        ├── auth.validation.js
        ├── course.validation.js
        ├── job.validation.js
        └── quiz.validation.js
```

---

## Module Details

### 1. Authentication Module

**Purpose:** User registration, login, token management, password updates.

**Flow:**
```
Register: POST /api/auth/register
  → auth.validation.js (validate input)
  → auth.controller.js (handle request)
  → auth.service.js (hash password, create user, generate tokens)
  → auth.repository.js (insert user, create refresh token)

Login: POST /api/auth/login
  → auth.validation.js (validate input)
  → auth.controller.js (handle request)
  → auth.service.js (verify password, generate tokens)
  → auth.repository.js (find user, create refresh token)

Refresh: POST /api/auth/refresh-token
  → auth.service.js (verify refresh token, rotate tokens)

Logout: POST /api/auth/logout
  → auth.service.js (delete refresh token)
```

**Token Strategy:**
- Access Token: JWT, 15min expiry, contains { id, email, role }
- Refresh Token: JWT, 7 days expiry, stored in database
- Token rotation on refresh (old token deleted, new one created)

**User Roles:**
- `STUDENT` - Default role, access to profile, courses, jobs, quizzes
- `ADMIN` - Can manage courses, jobs, view all users

---

### 2. Profile Module

**Purpose:** Complete student profile management with 30 endpoints.

**Sub-modules:**
| Sub-module | Endpoints | Operations |
|------------|-----------|------------|
| Profile | 2 | GET, PUT |
| Academic Records | 4 | CRUD + marks |
| Interests | 3 | List, Add, Remove |
| Career Goals | 4 | CRUD |
| Strengths | 3 | List, Add, Remove |
| Weaknesses | 3 | List, Add, Remove |
| Skills | 3 | List, Add, Remove |
| Certifications | 4 | CRUD |
| Search | 1 | Skill search |
| Completion | 1 | Calculate % |

**Profile Completion Calculation:**
- Checks 10 fields: DOB, gender, phone, bio, city, state, academics, interests, goals, skills
- Updates `completionPct` and `profileComplete` on profile

**Auto-creation:**
- Profile created automatically on first GET request if not exists

---

### 3. Course Module

**Purpose:** Course catalog management and student enrollment.

**Routes:**
| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | /courses | No | - | List all courses |
| GET | /courses/search | No | - | Search courses |
| GET | /courses/enrolled | Yes | Student | Get enrolled courses |
| GET | /courses/category/:cat | No | - | Filter by category |
| GET | /courses/:id | No | - | Get course details |
| POST | /courses | Yes | Admin | Create course |
| PUT | /courses/:id | Yes | Admin | Update course |
| DELETE | /courses/:id | Yes | Admin | Delete course |
| POST | /courses/:id/enroll | Yes | Student | Enroll in course |
| PUT | /courses/:id/progress | Yes | Student | Update progress |
| DELETE | /courses/:id/unenroll | Yes | Student | Unenroll from course |

**Enrollment Tracking:**
- Increments `enrolledCount` on course when enrolled
- Decrements on unenroll
- Tracks individual progress per user-course pair

---

### 4. Job Module

**Purpose:** Job listings management and job save/apply functionality.

**Routes:**
| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | /jobs | No | - | List all jobs |
| GET | /jobs/search | No | - | Search jobs |
| GET | /jobs/saved | Yes | Student | Get saved jobs |
| GET | /jobs/skills | No | - | Filter by skills |
| GET | /jobs/category/:cat | No | - | Filter by category |
| GET | /jobs/:id | No | - | Get job details |
| POST | /jobs | Yes | Admin | Create job |
| PUT | /jobs/:id | Yes | Admin | Update job |
| DELETE | /jobs/:id | Yes | Admin | Delete job |
| POST | /jobs/:id/save | Yes | Student | Save job |
| PUT | /jobs/:id/status | Yes | Student | Update status |
| DELETE | /jobs/:id/save | Yes | Student | Remove saved job |

---

### 5. Recommendation Module

**Purpose:** AI-generated recommendations storage and management.

**Recommendation Types:**
- `CAREER` - Career path recommendations
- `STREAM` - Educational stream recommendations
- `COURSE` - Course recommendations
- `SKILL` - Skill development recommendations
- `JOB` - Job recommendations

**Status Flow:**
```
PENDING → ACCEPTED
PENDING → REJECTED
PENDING → EXPIRED (after expiresAt)
```

**Fields:**
- `confidence` - 0.0 to 1.0 score
- `reasoning` - JSON object with explanation
- `metadata` - Additional context

---

### 6. Quiz Module

**Purpose:** Assessment quizzes with scoring and analysis.

**Quiz Categories:**
- `CAREER_INTEREST` - Career interest assessment
- `PERSONALITY` - Personality traits
- `SKILL_ASSESSMENT` - Skill evaluation
- `APTITUDE` - Aptitude test
- `LEARNING_STYLE` - Learning style identification

**Quiz Flow:**
```
1. POST /quizzes - Create quiz with questions
2. POST /quizzes/:id/submit - Submit answers
3. Backend calculates:
   - Score (correct answers × points)
   - Percentage
   - Performance level (excellent/good/average/below_average/poor)
   - Category breakdown
```

**Performance Levels:**
- Excellent: 90%+
- Good: 75-89%
- Average: 60-74%
- Below Average: 40-59%
- Poor: <40%

---

### 7. Chat Module

**Purpose:** AI counselor conversation history.

**Structure:**
- Messages grouped by `sessionId`
- Each message has `role` (USER/ASSISTANT/SYSTEM)
- Messages stored chronologically

**Routes:**
| Method | Path | Description |
|--------|------|-------------|
| GET | /chat/history/:sessionId | Get session messages |
| GET | /chat/sessions | List all sessions |
| POST | /chat/message | Save new message |
| DELETE | /chat/sessions/:sessionId | Delete session |

---

### 8. Notification Module

**Purpose:** User notifications for various events.

**Notification Types:**
- `RECOMMENDATION` - New recommendation received
- `QUIZ_RESULT` - Quiz completed
- `ROADMAP_UPDATE` - Roadmap progress update
- `COURSE_UPDATE` - Course content update
- `JOB_ALERT` - New job matching skills
- `SYSTEM` - System announcements
- `CHAT` - New chat message

**Features:**
- Read/unread tracking
- Bulk mark as read
- Unread count endpoint

---

### 9. Roadmap Module

**Purpose:** Career progression roadmaps with phases.

**Structure:**
```json
{
  "phases": [
    {
      "name": "Phase 1: Foundation",
      "duration": "6 months",
      "tasks": ["Learn basics", "Complete course"],
      "milestones": ["Certificate earned"]
    }
  ]
}
```

**Progress Tracking:**
- `progress` - 0-100 percentage
- `isCompleted` - Boolean flag

---

### 10. Resume Module

**Purpose:** Resume upload, parsing, and analysis.

**Resume Flow:**
```
1. POST /resumes - Upload resume (PDF/DOC)
2. POST /resumes/:id/analyze - Trigger AI analysis
3. Analysis returns:
   - Parsed content (JSON)
   - Score (0-100)
   - Feedback (strengths, weaknesses)
   - Recommendations (improvements)
```

**File Handling:**
- Memory storage (Multer)
- Allowed: PDF, DOC, DOCX
- Max size: 5MB

---

## Error Handling

### AppError Class
```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}
```

### Prisma Error Mapping
| Code | HTTP Status | Message |
|------|-------------|---------|
| P2025 | 404 | Resource not found |
| P2002 | 409 | Record already exists |
| P2003 | 400 | Related resource not found |
| P2014 | 400 | Required relation violation |

### JWT Error Handling
- `JsonWebTokenError` → 401 Invalid token
- `TokenExpiredError` → 401 Token expired

### Multer Error Handling
- `LIMIT_FILE_SIZE` → 400 File too large
- `LIMIT_UNEXPECTED_FILE` → 400 Unexpected field

---

## API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format",
      "value": "invalid-email"
    }
  ]
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | - |
| JWT_SECRET | Access token secret | - |
| JWT_EXPIRES_IN | Access token expiry | 15m |
| JWT_REFRESH_SECRET | Refresh token secret | - |
| JWT_REFRESH_EXPIRES_IN | Refresh token expiry | 7d |
| GEMINI_API_KEY | Google AI Studio API key | - |
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| CORS_ORIGINS | Allowed origins | http://localhost:3000 |

---

## Dependencies

### Production
| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.21.0 | Web framework |
| @prisma/client | ^6.0.0 | Database ORM |
| bcryptjs | ^2.4.3 | Password hashing |
| jsonwebtoken | ^9.0.2 | JWT tokens |
| cors | ^2.8.5 | Cross-origin requests |
| helmet | ^8.0.0 | Security headers |
| morgan | ^1.10.0 | Request logging |
| express-validator | ^7.2.0 | Input validation |
| cookie-parser | ^1.4.6 | Cookie parsing |
| multer | ^1.4.5-lts.1 | File upload |
| dotenv | ^16.4.5 | Env loading |
| uuid | ^10.0.0 | UUID generation |

### Development
| Package | Version | Purpose |
|---------|---------|---------|
| nodemon | ^3.1.7 | Auto-restart |
| eslint | ^9.12.0 | Code linting |

---

## Scripts

```bash
# Development
npm run dev          # Start with nodemon

# Production
npm start            # Start with node

# Database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio

# Testing
npm test             # Run tests with Jest

# Linting
npm run lint         # Run ESLint
```

---

## Security Features

1. **Helmet** - HTTP security headers
2. **CORS** - Configurable allowed origins
3. **JWT** - Stateless authentication
4. **bcrypt** - Password hashing (10 rounds)
5. **Refresh Token Rotation** - Invalidates old tokens
6. **Input Validation** - Express-validator on all endpoints
7. **File Upload Limits** - 5MB max, PDF/DOC only
8. **Rate Limiting** - Ready for implementation

---

## Database Connection

**Current Configuration:**
- Host: 54.234.20.250
- Port: 5432
- Database: EGAIDB
- User: postgres
- Schema: public

**Prisma Client:**
- Singleton pattern for connection reuse
- Dev mode: Query logging enabled
- Prod mode: Error logging only
- Graceful shutdown on SIGTERM/SIGINT

---

## API Endpoints Summary

| Module | Endpoints | Public | Protected | Admin |
|--------|-----------|--------|-----------|-------|
| Auth | 6 | 4 | 2 | 0 |
| Profile | 30 | 0 | 30 | 0 |
| Courses | 11 | 6 | 3 | 2 |
| Jobs | 12 | 7 | 3 | 2 |
| Recommendations | 5 | 0 | 5 | 0 |
| Quizzes | 6 | 0 | 6 | 0 |
| Chat | 4 | 0 | 4 | 0 |
| Notifications | 4 | 0 | 4 | 0 |
| Roadmaps | 5 | 0 | 5 | 0 |
| Resumes | 6 | 0 | 6 | 0 |
| **Total** | **89** | **17** | **62** | **4** |

---

## Next Steps

1. **Phase 4:** Frontend development (React + Redux)
2. **Phase 5:** AI integration (Gemini API)
3. **Phase 6:** UI/UX polish (TailwindCSS + FlyonUI)
4. **Phase 7:** Deployment (Docker + AWS)

---

*Document generated: May 29, 2026*
*Backend version: 1.0.0*
