# EduGuideAI — Backend API Routes Reference

> **Base URL:** `/api`  
> **Response Envelope:** All responses follow a standard format.

---

## Response Format

### Success (2xx)

```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

### Error (4xx / 5xx)

```json
{
  "success": false,
  "message": "..."
}
```

### Validation Error (400)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "...", "message": "...", "value": "..." }
  ]
}
```

### Paginated Responses

Paginated endpoints return a `pagination` object inside `data`:

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

> **Pagination Query Params** (optional on list endpoints):  
> `?page=1&limit=10` (defaults: page=1, limit=10, max limit=100)

---

## Authentication Middleware

| Middleware | Description |
|-----------|-------------|
| `authenticate` | Verifies JWT from `Authorization: Bearer <token>` header or `accessToken` cookie. Sets `req.user`. |
| `authorize(roles[])` | Checks that `req.user.role` is one of the allowed roles. Returns 403 if not. |
| `validate` | Runs express-validator rules. Returns 400 with `errors` array on failure. |
| `checkChatLimit` | Checks daily chat limit by subscription tier. Returns 403 if exhausted. |
| `enforceTier(tiers[])` | Checks user's `subscriptionTier` is in the required tiers list. Returns 403 if not. |

---

## 📍 1. Health Check

### GET /api/health

| Detail | Value |
|--------|-------|
| Auth | None |
| Description | Health check endpoint |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2025-01-01T00:00:00.000Z",
    "uptime": 12345,
    "env": "development"
  }
}
```

---

## 📍 2. Auth Routes — `/api/auth`

### POST /api/auth/register

| Detail | Value |
|--------|-------|
| Auth | None |
| Description | Register a new user account |

**Request Body (required):**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "StrongPass1"
}
```

> **Validation:** password must be min 8 chars, include uppercase, lowercase, and digit.

**Response (201):**

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": { "id": "uuid", "email": "...", "firstName": "...", "lastName": "..." },
    "token": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

---

### POST /api/auth/login

| Detail | Value |
|--------|-------|
| Auth | None |
| Description | Authenticate user and return JWT tokens |

**Request Body (required):**

```json
{
  "email": "john@example.com",
  "password": "StrongPass1"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": "uuid", "email": "...", "firstName": "...", "lastName": "..." },
    "token": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

---

### POST /api/auth/refresh-token

| Detail | Value |
|--------|-------|
| Auth | None |
| Description | Refresh expired access token |

**Request Body (required):**

```json
{
  "refreshToken": "refresh-token-string"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "new-jwt-token",
    "refreshToken": "new-refresh-token"
  }
}
```

---

### POST /api/auth/logout

| Detail | Value |
|--------|-------|
| Auth | None |
| Description | Invalidate refresh token |

**Request Body (required):**

```json
{
  "refreshToken": "refresh-token-string"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### GET /api/auth/profile

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Get authenticated user's profile |

**Response (200):**

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "uuid",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT",
    "subscriptionTier": "NEWBIE",
    "isVerified": true,
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### PUT /api/auth/password

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Change current user's password |

**Request Body (required):**

```json
{
  "oldPassword": "OldPass1",
  "newPassword": "NewStrongPass1"
}
```

> **Validation:** newPassword must be min 8 chars, include uppercase, lowercase, and digit.

**Response (200):**

```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

---

### PUT /api/auth/subscription

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Upgrade/downgrade user subscription tier |

**Request Body (required):**

```json
{
  "tier": "PRO"
}
```

> **Tier values:** `NEWBIE`, `PRO`, `PRO_PLUS`

**Response (200):**

```json
{
  "success": true,
  "message": "Subscription updated successfully",
  "data": { "user": { "...": "updated user object" } }
}
```

---

## 📍 3. Profile Routes — `/api/profile`

> All routes in this section require **`authenticate`** middleware.

### GET /api/profile/profile

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Get the authenticated user's full profile |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "academicRecords": [...],
    "interests": [...],
    "skills": [...],
    "careerGoals": [...],
    "strengths": [...],
    "weaknesses": [...],
    "certifications": [...],
    "basicInfo": { "...": "profile fields" }
  }
}
```

---

### PUT /api/profile/profile

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Update basic profile fields |

**Request Body (all optional):**

```json
{
  "dateOfBirth": "2000-01-01",
  "gender": "MALE",
  "phoneNumber": "+1234567890",
  "bio": "A brief bio (max 1000 chars)",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "address": "123 Main St"
}
```

> **Gender enum:** `MALE`, `FEMALE`, `OTHER`, `PREFER_NOT_TO_SAY`

**Response (200):**

```json
{
  "success": true,
  "data": { "updated profile object" }
}
```

---

### POST /api/profile/profile/academic-records

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Add an academic record to profile |

**Request Body:**

```json
{
  "institution": "University of Example",
  "degree": "B.Sc. Computer Science",
  "fieldOfStudy": "Computer Science",
  "year": "SOPHOMORE",
  "startYear": 2022,
  "endYear": 2026,
  "gpa": 8.5,
  "percentage": 85,
  "isCurrent": true
}
```

> **Year enum:** `FRESHMAN`, `SOPHOMORE`, `JUNIOR`, `SENIOR`, `GRADUATE`, `POST_GRADUATE`

**Response (201):**

```json
{
  "success": true,
  "data": { "academic record object" }
}
```

---

### PUT /api/profile/profile/academic-records/:recordId

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `recordId` (UUID) |
| Description | Update an existing academic record |

**Request Body (all optional):** Same fields as POST.

**Response (200):**

```json
{
  "success": true,
  "data": { "updated academic record" }
}
```

---

### DELETE /api/profile/profile/academic-records/:recordId

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `recordId` (UUID) |
| Description | Delete an academic record |

**Response (200):**

```json
{
  "success": true,
  "message": "Academic record deleted"
}
```

---

### POST /api/profile/profile/academic-records/:recordId/marks

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `recordId` (UUID) |
| Description | Add a subject mark to an academic record |

**Request Body:**

```json
{
  "subjectName": "Data Structures",
  "marks": 85.5,
  "maxMarks": 100,
  "grade": "A"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": { "subject mark object" }
}
```

---

### DELETE /api/profile/profile/marks/:markId

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `markId` (UUID) |
| Description | Delete a subject mark |

**Response (200):**

```json
{
  "success": true,
  "message": "Subject mark deleted"
}
```

---

### GET /api/profile/profile/interests

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Get all user interests |

**Response (200):**

```json
{
  "success": true,
  "data": [
    { "id": "uuid", "name": "Machine Learning", "category": "Technology", "level": 8 }
  ]
}
```

---

### POST /api/profile/profile/interests

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Add an interest to profile |

**Request Body:**

```json
{
  "name": "Machine Learning",
  "category": "Technology",
  "level": 8
}
```

**Response (201):**

```json
{
  "success": true,
  "data": { "interest object" }
}
```

---

### DELETE /api/profile/profile/interests/:interestId

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `interestId` (UUID) |
| Description | Remove an interest |

**Response (200):**

```json
{
  "success": true,
  "message": "Interest removed"
}
```

---

### GET /api/profile/profile/career-goals

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Get all career goals |

**Response (200):**

```json
{
  "success": true,
  "data": [
    { "id": "uuid", "title": "Become a Software Engineer", "description": "...", "targetYear": 2026, "priority": 5 }
  ]
}
```

---

### POST /api/profile/profile/career-goals

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Add a career goal |

**Request Body:**

```json
{
  "title": "Become a Software Engineer",
  "description": "Work at a top tech company",
  "targetYear": 2026,
  "priority": 5
}
```

**Response (201):**

```json
{
  "success": true,
  "data": { "career goal object" }
}
```

---

### PUT /api/profile/profile/career-goals/:goalId

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `goalId` (UUID) |
| Description | Update a career goal |

**Request Body (all optional):** Same fields as POST.

**Response (200):**

```json
{
  "success": true,
  "data": { "updated career goal" }
}
```

---

### DELETE /api/profile/profile/career-goals/:goalId

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `goalId` (UUID) |
| Description | Remove a career goal |

**Response (200):**

```json
{
  "success": true,
  "message": "Career goal removed"
}
```

---

### GET /api/profile/profile/strengths

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Get all strengths |

**Response (200):**

```json
{
  "success": true,
  "data": [
    { "id": "uuid", "name": "Problem Solving", "category": "Cognitive", "evidence": "..." }
  ]
}
```

---

### POST /api/profile/profile/strengths

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Add a strength |

**Request Body:**

```json
{
  "name": "Problem Solving",
  "category": "Cognitive",
  "evidence": "Solved 500+ LeetCode problems"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": { "strength object" }
}
```

---

### DELETE /api/profile/profile/strengths/:strengthId

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `strengthId` (UUID) |
| Description | Remove a strength |

**Response (200):**

```json
{
  "success": true,
  "message": "Strength removed"
}
```

---

### GET /api/profile/profile/weaknesses

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Get all weaknesses |

**Response (200):**

```json
{
  "success": true,
  "data": [
    { "id": "uuid", "name": "Public Speaking", "category": "Communication", "evidence": "..." }
  ]
}
```

---

### POST /api/profile/profile/weaknesses

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Add a weakness |

**Request Body:**

```json
{
  "name": "Public Speaking",
  "category": "Communication",
  "evidence": "Nervous during presentations"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": { "weakness object" }
}
```

---

### DELETE /api/profile/profile/weaknesses/:weaknessId

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `weaknessId` (UUID) |
| Description | Remove a weakness |

**Response (200):**

```json
{
  "success": true,
  "message": "Weakness removed"
}
```

---

### GET /api/profile/profile/skills

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Get all user skills |

**Response (200):**

```json
{
  "success": true,
  "data": [
    { "id": "uuid", "name": "JavaScript", "level": 8, "yearsExp": 3 }
  ]
}
```

---

### POST /api/profile/profile/skills

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Add a skill to user's profile |

**Request Body:**

```json
{
  "skillId": "uuid-of-skill",
  "level": 8,
  "yearsExp": 3
}
```

**Response (201):**

```json
{
  "success": true,
  "data": { "skill association object" }
}
```

---

### DELETE /api/profile/profile/skills/:skillId

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `skillId` (UUID) |
| Description | Remove a skill from profile |

**Response (200):**

```json
{
  "success": true,
  "message": "Skill removed"
}
```

---

### GET /api/profile/skills/search

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Search the global skills database |

**Query Params:**

```
?q=javascript
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    { "id": "uuid", "name": "JavaScript", "category": "Programming Language" }
  ]
}
```

---

### GET /api/profile/profile/certifications

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Get all certifications |

**Response (200):**

```json
{
  "success": true,
  "data": [
    { "id": "uuid", "name": "AWS Certified Developer", "issuer": "Amazon", "issueDate": "...", "expiryDate": "...", "credentialUrl": "https://..." }
  ]
}
```

---

### POST /api/profile/profile/certifications

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Add a certification |

**Request Body:**

```json
{
  "name": "AWS Certified Developer",
  "issuer": "Amazon",
  "issueDate": "2024-01-01",
  "expiryDate": "2027-01-01",
  "credentialUrl": "https://credential.example.com"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": { "certification object" }
}
```

---

### PUT /api/profile/profile/certifications/:certId

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `certId` (UUID) |
| Description | Update a certification |

**Request Body (all optional):** Same fields as POST.

**Response (200):**

```json
{
  "success": true,
  "data": { "updated certification" }
}
```

---

### DELETE /api/profile/profile/certifications/:certId

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `certId` (UUID) |
| Description | Remove a certification |

**Response (200):**

```json
{
  "success": true,
  "message": "Certification removed"
}
```

---

### GET /api/profile/profile/completion

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Calculate profile completion percentage |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "completionPercentage": 65,
    "breakdown": {
      "basicInfo": true,
      "academicRecords": true,
      "interests": false,
      "skills": true,
      "careerGoals": false
    }
  }
}
```

---

## 📍 4. Course Routes — `/api/courses`

### GET /api/courses

| Detail | Value |
|--------|-------|
| Auth | None (public) |
| Description | List all courses with optional filters and pagination |

**Query Params (all optional):**

```
?category=Technology&level=beginner&provider=Coursera&minPrice=0&maxPrice=100&minRating=4&page=1&limit=10
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "courses": [
      { "id": "uuid", "title": "...", "provider": "Coursera", "category": "Technology", "level": "beginner", "price": 49.99, "rating": 4.5, "url": "https://..." }
    ],
    "pagination": { "total": 50, "page": 1, "limit": 10, "totalPages": 5 }
  }
}
```

---

### GET /api/courses/search

| Detail | Value |
|--------|-------|
| Auth | None |
| Description | Search courses by keyword |

**Query Params:**

```
?q=machine+learning
```

**Response (200):**

```json
{
  "success": true,
  "data": [ { "course objects..." } ]
}
```

---

### GET /api/courses/enrolled

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Get courses the authenticated user is enrolled in |

**Query Params (optional):** `?page=1&limit=10`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "courses": [...],
    "pagination": { "total": 5, "page": 1, "limit": 10, "totalPages": 1 }
  }
}
```

---

### GET /api/courses/category/:category

| Detail | Value |
|--------|-------|
| Auth | None |
| Params | `category` (string) |
| Description | Get courses by category |

**Response (200):**

```json
{
  "success": true,
  "data": [ { "course objects..." } ]
}
```

---

### GET /api/courses/:id

| Detail | Value |
|--------|-------|
| Auth | None |
| Params | `id` (UUID) |
| Description | Get a single course by ID |

**Response (200):**

```json
{
  "success": true,
  "data": { "full course object with all details" }
}
```

---

### POST /api/courses

| Detail | Value |
|--------|-------|
| Auth | `authenticate`, `authorize(["ADMIN"])` |
| Description | Create a new course (admin only) |

**Request Body:**

```json
{
  "title": "Introduction to Machine Learning",
  "provider": "Coursera",
  "category": "Data Science",
  "description": "A comprehensive intro to ML",
  "url": "https://coursera.org/course/ml",
  "duration": "8 weeks",
  "level": "beginner",
  "price": 49.99,
  "currency": "USD",
  "rating": 4.5
}
```

**Response (201):**

```json
{
  "success": true,
  "data": { "created course object" }
}
```

---

### PUT /api/courses/:id

| Detail | Value |
|--------|-------|
| Auth | `authenticate`, `authorize(["ADMIN"])` |
| Params | `id` (UUID) |
| Description | Update a course (admin only) |

**Request Body (all optional):** Same fields as POST.

**Response (200):**

```json
{
  "success": true,
  "data": { "updated course object" }
}
```

---

### DELETE /api/courses/:id

| Detail | Value |
|--------|-------|
| Auth | `authenticate`, `authorize(["ADMIN"])` |
| Params | `id` (UUID) |
| Description | Delete a course (admin only) |

**Response (200):**

```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

---

### POST /api/courses/:id/enroll

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `id` (UUID) |
| Description | Enroll the authenticated user in a course |

**Response (201):**

```json
{
  "success": true,
  "data": { "enrollment object with progress" }
}
```

---

### PUT /api/courses/:id/progress

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `id` (UUID) |
| Description | Update course progress percentage |

**Request Body:**

```json
{
  "progress": 75
}
```

> **Validation:** progress must be an integer between 0 and 100.

**Response (200):**

```json
{
  "success": true,
  "data": { "updated enrollment object" }
}
```

---

### DELETE /api/courses/:id/unenroll

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `id` (UUID) |
| Description | Unenroll from a course |

**Response (200):**

```json
{
  "success": true,
  "message": "Unenrolled successfully"
}
```

---

## 📍 5. Job Routes — `/api/jobs`

### GET /api/jobs

| Detail | Value |
|--------|-------|
| Auth | None (public) |
| Description | List all jobs with filters and pagination |

**Query Params (all optional):**

```
?category=Engineering&type=full-time&company=Google&location=New+York&experience=2+years&search=software&page=1&limit=10
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "jobs": [
      { "id": "uuid", "title": "Software Engineer", "company": "Google", "location": "New York", "type": "full-time", "category": "Engineering", "salaryRange": "$100k-$150k", "experience": "2 years" }
    ],
    "pagination": { "total": 25, "page": 1, "limit": 10, "totalPages": 3 }
  }
}
```

---

### GET /api/jobs/search

| Detail | Value |
|--------|-------|
| Auth | None |
| Description | Search jobs by keyword |

**Query Params:**

```
?q=software+engineer
```

**Response (200):**

```json
{
  "success": true,
  "data": [ { "job objects..." } ]
}
```

---

### GET /api/jobs/saved

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Get authenticated user's saved jobs |

**Query Params (optional):** `?page=1&limit=10`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "jobs": [...],
    "pagination": { "total": 3, "page": 1, "limit": 10, "totalPages": 1 }
  }
}
```

---

### GET /api/jobs/skills

| Detail | Value |
|--------|-------|
| Auth | None |
| Description | Get jobs matching specified skills |

**Query Params:**

```
?skills=JavaScript,React,Node.js
```

**Response (200):**

```json
{
  "success": true,
  "data": [ { "job objects..." } ]
}
```

---

### GET /api/jobs/category/:category

| Detail | Value |
|--------|-------|
| Auth | None |
| Params | `category` (string) |
| Description | Get jobs by category |

**Response (200):**

```json
{
  "success": true,
  "data": [ { "job objects..." } ]
}
```

---

### GET /api/jobs/:id

| Detail | Value |
|--------|-------|
| Auth | None |
| Params | `id` (UUID) |
| Description | Get a single job by ID |

**Response (200):**

```json
{
  "success": true,
  "data": { "full job object with all details" }
}
```

---

### POST /api/jobs

| Detail | Value |
|--------|-------|
| Auth | `authenticate`, `authorize(["ADMIN"])` |
| Description | Create a new job listing (admin only) |

**Request Body:**

```json
{
  "title": "Senior Software Engineer",
  "company": "Google",
  "skills": ["JavaScript", "React", "Node.js"],
  "category": "Engineering",
  "description": "We are looking for...",
  "location": "Mountain View, CA",
  "url": "https://careers.google.com/job/123",
  "salaryRange": "$150k-$200k",
  "experience": "5+ years",
  "type": "full-time"
}
```

> **Type enum:** `full-time`, `part-time`, `contract`, `internship`, `remote`

**Response (201):**

```json
{
  "success": true,
  "data": { "created job object" }
}
```

---

### PUT /api/jobs/:id

| Detail | Value |
|--------|-------|
| Auth | `authenticate`, `authorize(["ADMIN"])` |
| Params | `id` (UUID) |
| Description | Update a job listing (admin only) |

**Request Body (all optional):** Same fields as POST.

**Response (200):**

```json
{
  "success": true,
  "data": { "updated job object" }
}
```

---

### DELETE /api/jobs/:id

| Detail | Value |
|--------|-------|
| Auth | `authenticate`, `authorize(["ADMIN"])` |
| Params | `id` (UUID) |
| Description | Delete a job listing (admin only) |

**Response (200):**

```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```

---

### POST /api/jobs/:id/save

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `id` (UUID) |
| Description | Save a job for the authenticated user |

**Response (201):**

```json
{
  "success": true,
  "data": { "saved job object" }
}
```

---

### PUT /api/jobs/:id/status

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `id` (UUID) |
| Description | Update job application status |

**Request Body:**

```json
{
  "status": "applied"
}
```

> **Status enum:** `saved`, `applied`, `interviewing`, `offered`, `rejected`, `accepted`

**Response (200):**

```json
{
  "success": true,
  "data": { "updated user-job object" }
}
```

---

### DELETE /api/jobs/:id/save

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `id` (UUID) |
| Description | Remove a saved job |

**Response (200):**

```json
{
  "success": true,
  "message": "Job removed from saved list"
}
```

---

## 📍 6. Recommendation Routes — `/api/recommendations`

> All routes in this section require **`authenticate`** middleware.

### GET /api/recommendations

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Get all recommendations for the authenticated user |

**Query Params (all optional):**

```
?type=CAREER&status=pending&page=1&limit=10
```

> **Type enum:** `CAREER`, `STREAM`, `COURSE`, `SKILL`, `JOB`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "recommendations": [
      { "id": "uuid", "type": "CAREER", "title": "Software Engineer", "description": "...", "confidence": 0.92, "reasoning": { "...": "..." }, "status": "pending" }
    ],
    "pagination": { "total": 10, "page": 1, "limit": 10, "totalPages": 1 }
  }
}
```

---

### POST /api/recommendations/generate

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Trigger AI-based recommendation generation |

**Response (201):**

```json
{
  "success": true,
  "data": { "generated recommendations" }
}
```

---

### GET /api/recommendations/:id

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `id` (UUID) |
| Description | Get a single recommendation by ID |

**Response (200):**

```json
{
  "success": true,
  "data": { "recommendation object" }
}
```

---

### POST /api/recommendations

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Manually create a recommendation |

**Request Body:**

```json
{
  "type": "CAREER",
  "title": "Software Engineer",
  "description": "Consider a career in software engineering...",
  "confidence": 0.92,
  "reasoning": { "key": "value" },
  "metadata": { "source": "manual" },
  "expiresAt": "2025-12-31T23:59:59Z"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": { "created recommendation object" }
}
```

---

### PUT /api/recommendations/:id/accept

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `id` (UUID) |
| Description | Accept a recommendation |

**Response (200):**

```json
{
  "success": true,
  "data": { "updated recommendation" }
}
```

---

### PUT /api/recommendations/:id/reject

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `id` (UUID) |
| Description | Reject a recommendation |

**Response (200):**

```json
{
  "success": true,
  "data": { "updated recommendation" }
}
```

---

## 📍 7. Quiz Routes — `/api/quizzes`

> All routes in this section require **`authenticate`** middleware.

### POST /api/quizzes

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Create a new quiz |

**Request Body:**

```json
{
  "title": "Career Interest Assessment",
  "category": "CAREER_INTEREST",
  "duration": 30,
  "questions": [
    {
      "text": "I enjoy working with data and numbers",
      "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
      "correctOption": 2,
      "points": 10
    }
  ]
}
```

> **Category enum:** `CAREER_INTEREST`, `PERSONALITY`, `SKILL_ASSESSMENT`, `APTITUDE`, `LEARNING_STYLE`

**Response (201):**

```json
{
  "success": true,
  "data": { "created quiz object" }
}
```

---

### POST /api/quizzes/generate

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Generate an AI-powered quiz |

**Response (201):**

```json
{
  "success": true,
  "data": { "ai-generated quiz object" }
}
```

---

### GET /api/quizzes

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Get all quizzes for the user |

**Query Params (all optional):**

```
?category=CAREER_INTEREST&page=1&limit=10
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "quizzes": [...],
    "pagination": { "total": 5, "page": 1, "limit": 10, "totalPages": 1 }
  }
}
```

---

### GET /api/quizzes/results

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Get all quiz results for the user |

**Query Params (optional):** `?page=1&limit=10`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "results": [
      { "id": "uuid", "quizId": "uuid", "score": 85, "total": 100, "percentage": 85, "submittedAt": "..." }
    ],
    "pagination": { "total": 5, "page": 1, "limit": 10, "totalPages": 1 }
  }
}
```

---

### GET /api/quizzes/:id

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `id` (UUID) |
| Description | Get a single quiz by ID |

**Response (200):**

```json
{
  "success": true,
  "data": { "quiz object with questions" }
}
```

---

### POST /api/quizzes/:id/submit

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `id` (UUID) |
| Description | Submit answers for a quiz |

**Request Body:**

```json
{
  "answers": [
    { "questionId": "q1", "selectedOption": "Agree" },
    { "questionId": "q2", "selectedOption": "Strongly Agree" }
  ]
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "quizResult": {
      "id": "uuid",
      "quizId": "uuid",
      "score": 85,
      "total": 100,
      "percentage": 85,
      "answers": [...],
      "submittedAt": "..."
    }
  }
}
```

---

### GET /api/quizzes/:id/results

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `id` (UUID) |
| Description | Get results for a specific quiz |

**Response (200):**

```json
{
  "success": true,
  "data": { "quiz results object" }
}
```

---

## 📍 8. Chat Routes — `/api/chat`

> All routes in this section require **`authenticate`** middleware.

### GET /api/chat/sessions

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Get all chat sessions for the user |

**Response (200):**

```json
{
  "success": true,
  "data": [
    { "sessionId": "session-uuid", "title": "Career Advice", "messageCount": 12, "lastMessageAt": "..." }
  ]
}
```

---

### GET /api/chat/history/:sessionId

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `sessionId` (string) |
| Description | Get chat history for a session |

**Query Params (optional):** `?page=1&limit=10`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "messages": [
      { "id": "uuid", "role": "user", "content": "Hello", "metadata": {}, "timestamp": "..." }
    ],
    "pagination": { "total": 12, "page": 1, "limit": 10, "totalPages": 2 }
  }
}
```

---

### POST /api/chat/message

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Save a chat message |

**Request Body:**

```json
{
  "sessionId": "session-uuid",
  "role": "user",
  "content": "What career is right for me?",
  "metadata": { "context": "initial" }
}
```

**Response (201):**

```json
{
  "success": true,
  "data": { "saved message object" }
}
```

---

### DELETE /api/chat/sessions/:sessionId

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `sessionId` (string) |
| Description | Delete a chat session |

**Response (200):**

```json
{
  "success": true,
  "data": { "result": { "deleted": true } }
}
```

---

## 📍 9. Notification Routes — `/api/notifications`

> All routes in this section require **`authenticate`** middleware.

### GET /api/notifications/unread-count

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Get count of unread notifications |

**Response (200):**

```json
{
  "success": true,
  "data": { "count": 5 }
}
```

---

### GET /api/notifications

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Get all notifications for the user |

**Query Params (all optional):**

```
?isRead=false&page=1&limit=10
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "notifications": [
      { "id": "uuid", "title": "New course available", "message": "...", "isRead": false, "type": "INFO", "createdAt": "..." }
    ],
    "pagination": { "total": 20, "page": 1, "limit": 10, "totalPages": 2 }
  }
}
```

---

### PUT /api/notifications/read-all

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Mark all notifications as read |

**Response (200):**

```json
{
  "success": true,
  "data": { "result": { "updatedCount": 5 } }
}
```

---

### PUT /api/notifications/:id/read

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `id` (UUID) |
| Description | Mark a single notification as read |

**Response (200):**

```json
{
  "success": true,
  "data": { "notification object" }
}
```

---

## 📍 10. Roadmap Routes — `/api/roadmaps`

> All routes in this section require **`authenticate`** middleware.

### GET /api/roadmaps

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Get all roadmaps for the user |

**Query Params (optional):** `?page=1&limit=10`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "roadmaps": [
      { "id": "uuid", "title": "Software Engineering Path", "goal": "Become a full-stack developer", "steps": [...], "progress": 45, "createdAt": "..." }
    ],
    "pagination": { "total": 3, "page": 1, "limit": 10, "totalPages": 1 }
  }
}
```

---

### GET /api/roadmaps/:id

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `id` (UUID) |
| Description | Get a single roadmap by ID |

**Response (200):**

```json
{
  "success": true,
  "data": { "roadmap object with steps" }
}
```

---

### POST /api/roadmaps

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Create a new roadmap |

**Response (201):**

```json
{
  "success": true,
  "data": { "created roadmap object" }
}
```

---

### PUT /api/roadmaps/:id

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `id` (UUID) |
| Description | Update a roadmap |

**Response (200):**

```json
{
  "success": true,
  "data": { "updated roadmap object" }
}
```

---

### DELETE /api/roadmaps/:id

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `id` (UUID) |
| Description | Delete a roadmap |

**Response (200):**

```json
{
  "success": true,
  "message": "Roadmap deleted successfully"
}
```

---

## 📍 11. Resume Routes — `/api/resumes`

> All routes in this section require **`authenticate`** middleware.

### GET /api/resumes

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Get all resumes for the user |

**Query Params (optional):** `?page=1&limit=10`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "resumes": [
      { "id": "uuid", "title": "My Resume", "template": "modern", "isPrimary": true, "updatedAt": "..." }
    ],
    "pagination": { "total": 2, "page": 1, "limit": 10, "totalPages": 1 }
  }
}
```

---

### GET /api/resumes/:id

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `id` (UUID) |
| Description | Get a single resume by ID |

**Response (200):**

```json
{
  "success": true,
  "data": { "resume object with full details" }
}
```

---

### POST /api/resumes

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Create a new resume |

**Response (201):**

```json
{
  "success": true,
  "data": { "created resume object" }
}
```

---

### PUT /api/resumes/:id

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `id` (UUID) |
| Description | Update a resume |

**Response (200):**

```json
{
  "success": true,
  "data": { "updated resume object" }
}
```

---

### DELETE /api/resumes/:id

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `id` (UUID) |
| Description | Delete a resume |

**Response (200):**

```json
{
  "success": true,
  "message": "Resume deleted successfully"
}
```

---

### POST /api/resumes/:id/analyze

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Params | `id` (UUID) |
| Description | Trigger AI-powered resume analysis |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "analysis": {
      "overallScore": 78,
      "strengths": ["Clear formatting", "Quantifiable achievements"],
      "weaknesses": ["Missing summary", "Weak action verbs"],
      "suggestions": ["Add a professional summary", "Use stronger action verbs"]
    }
  }
}
```

---

## 📍 12. Admin Routes — `/api/admin`

> All routes in this section require **`authenticate`** + **`authorize(["ADMIN"])`** middleware.

### GET /api/admin/stats

| Detail | Value |
|--------|-------|
| Auth | Admin |
| Description | Get platform-wide statistics |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "totalUsers": 1000,
    "totalCourses": 50,
    "totalJobs": 200,
    "activeUsers": 500,
    "newUsersThisMonth": 50
  }
}
```

---

### GET /api/admin/analytics

| Detail | Value |
|--------|-------|
| Auth | Admin |
| Description | Get analytics/dashboard data |

**Response (200):**

```json
{
  "success": true,
  "data": { "analytics data object" }
}
```

---

### GET /api/admin/activity

| Detail | Value |
|--------|-------|
| Auth | Admin |
| Description | Get recent platform activity |

**Query Params (optional):** `?limit=20` (default: 20, max: 50)

**Response (200):**

```json
{
  "success": true,
  "data": [
    { "id": "uuid", "action": "USER_REGISTERED", "userId": "...", "details": { "...": "..." }, "timestamp": "..." }
  ]
}
```

---

### GET /api/admin/users

| Detail | Value |
|--------|-------|
| Auth | Admin |
| Description | List all users with filters |

**Query Params (all optional):**

```
?role=STUDENT&isActive=true&isVerified=true&search=john&page=1&limit=10
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "users": [
      { "id": "uuid", "email": "...", "firstName": "...", "lastName": "...", "role": "STUDENT", "isActive": true, "isVerified": true, "subscriptionTier": "NEWBIE" }
    ],
    "pagination": { "total": 100, "page": 1, "limit": 10, "totalPages": 10 }
  }
}
```

---

### GET /api/admin/users/:id

| Detail | Value |
|--------|-------|
| Auth | Admin |
| Params | `id` (UUID) |
| Description | Get a user by ID |

**Response (200):**

```json
{
  "success": true,
  "data": { "user object with full details" }
}
```

---

### PUT /api/admin/users/:id

| Detail | Value |
|--------|-------|
| Auth | Admin |
| Params | `id` (UUID) |
| Description | Update any user's details |

**Request Body (all optional):**

```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "role": "STUDENT",
  "isVerified": true,
  "isActive": true,
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

> **Role enum:** `STUDENT`, `ADMIN`

**Response (200):**

```json
{
  "success": true,
  "data": { "updated user object" }
}
```

---

### DELETE /api/admin/users/:id

| Detail | Value |
|--------|-------|
| Auth | Admin |
| Params | `id` (UUID) |
| Description | Delete a user account |

**Response (200):**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

### PUT /api/admin/users/:id/toggle-active

| Detail | Value |
|--------|-------|
| Auth | Admin |
| Params | `id` (UUID) |
| Description | Toggle user active/inactive status |

**Response (200):**

```json
{
  "success": true,
  "data": { "updated user object" }
}
```

---

### GET /api/admin/courses

| Detail | Value |
|--------|-------|
| Auth | Admin |
| Description | List all courses (admin view) |

**Query Params (all optional):**

```
?category=Technology&level=beginner&isActive=true&provider=Coursera&search=machine+learning&page=1&limit=10
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "courses": [...],
    "pagination": { "total": 50, "page": 1, "limit": 10, "totalPages": 5 }
  }
}
```

---

### GET /api/admin/courses/:id

| Detail | Value |
|--------|-------|
| Auth | Admin |
| Params | `id` (UUID) |
| Description | Get any course by ID |

**Response (200):**

```json
{
  "success": true,
  "data": { "course object with full details" }
}
```

---

### POST /api/admin/courses

| Detail | Value |
|--------|-------|
| Auth | Admin |
| Description | Create a course (admin version) |

**Request Body:** Same as POST `/api/courses`.

**Response (201):**

```json
{
  "success": true,
  "data": { "created course object" }
}
```

---

### PUT /api/admin/courses/:id

| Detail | Value |
|--------|-------|
| Auth | Admin |
| Params | `id` (UUID) |
| Description | Update any course |

**Request Body (all optional):** Same course fields.

**Response (200):**

```json
{
  "success": true,
  "data": { "updated course object" }
}
```

---

### DELETE /api/admin/courses/:id

| Detail | Value |
|--------|-------|
| Auth | Admin |
| Params | `id` (UUID) |
| Description | Delete any course |

**Response (200):**

```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

---

### GET /api/admin/jobs

| Detail | Value |
|--------|-------|
| Auth | Admin |
| Description | List all jobs (admin view) |

**Query Params (all optional):**

```
?category=Engineering&type=full-time&isActive=true&company=Google&location=New+York&search=software&page=1&limit=10
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "jobs": [...],
    "pagination": { "total": 200, "page": 1, "limit": 10, "totalPages": 20 }
  }
}
```

---

### GET /api/admin/jobs/:id

| Detail | Value |
|--------|-------|
| Auth | Admin |
| Params | `id` (UUID) |
| Description | Get any job by ID |

**Response (200):**

```json
{
  "success": true,
  "data": { "job object with full details" }
}
```

---

### POST /api/admin/jobs

| Detail | Value |
|--------|-------|
| Auth | Admin |
| Description | Create a job (admin version) |

**Request Body:** Same as POST `/api/jobs`.

**Response (201):**

```json
{
  "success": true,
  "data": { "created job object" }
}
```

---

### PUT /api/admin/jobs/:id

| Detail | Value |
|--------|-------|
| Auth | Admin |
| Params | `id` (UUID) |
| Description | Update any job |

**Request Body (all optional):** Same job fields.

**Response (200):**

```json
{
  "success": true,
  "data": { "updated job object" }
}
```

---

### DELETE /api/admin/jobs/:id

| Detail | Value |
|--------|-------|
| Auth | Admin |
| Params | `id` (UUID) |
| Description | Delete any job |

**Response (200):**

```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```

---

### GET /api/admin/jobs/scrape/status

| Detail | Value |
|--------|-------|
| Auth | Admin |
| Description | Check current job scraper status |

**Response (200):**

```json
{
  "success": true,
  "data": { "scraper status object" }
}
```

---

### POST /api/admin/jobs/scrape/stop

| Detail | Value |
|--------|-------|
| Auth | Admin |
| Description | Stop the job scraping process |

**Response (200):**

```json
{
  "success": true,
  "data": { "result": { "stopped": true } }
}
```

---

### POST /api/admin/jobs/scrape

| Detail | Value |
|--------|-------|
| Auth | Admin |
| Description | Start a job scraping run |

**Request Body:**

```json
{
  "location": "New York",
  "limit": 50,
  "keyword": "software engineer"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": { "scraper init result" }
}
```

---

### GET /api/admin/quizzes

| Detail | Value |
|--------|-------|
| Auth | Admin |
| Description | List all quizzes (admin view) |

**Query Params (all optional):**

```
?category=CAREER_INTEREST&status=active&search=career&page=1&limit=10
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "quizzes": [...],
    "pagination": { "total": 30, "page": 1, "limit": 10, "totalPages": 3 }
  }
}
```

---

### GET /api/admin/quizzes/:id

| Detail | Value |
|--------|-------|
| Auth | Admin |
| Params | `id` (UUID) |
| Description | Get any quiz by ID |

**Response (200):**

```json
{
  "success": true,
  "data": { "quiz object" }
}
```

---

### DELETE /api/admin/quizzes/:id

| Detail | Value |
|--------|-------|
| Auth | Admin |
| Params | `id` (UUID) |
| Description | Delete any quiz |

**Response (200):**

```json
{
  "success": true,
  "message": "Quiz deleted successfully"
}
```

---

## 📍 13. AI Routes — `/api/ai`

> All routes in this section require **`authenticate`** middleware.

### POST /api/ai/career-recommendation

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Get AI-powered career recommendations |

**Request Body:**

```json
{
  "interests": ["programming", "data science", "AI"],
  "skills": ["Python", "JavaScript", "SQL"],
  "education": "B.Tech in Computer Science",
  "preferences": { "workEnvironment": "remote", "industry": "technology" }
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "recommendations": [
      { "career": "Data Scientist", "matchScore": 92, "reasoning": "...", "requiredSkills": ["ML", "Statistics"], "suggestedCourses": [...] }
    ]
  }
}
```

---

### POST /api/ai/stream-recommendation

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Get AI-powered academic stream recommendation |

**Request Body:**

```json
{
  "academicPerformance": {
    "subjects": [
      { "name": "Mathematics", "score": 92 },
      { "name": "Physics", "score": 88 }
    ]
  },
  "interests": ["engineering", "technology"],
  "aptitudeScores": { "logical": 85, "verbal": 70 }
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "streams": [
      { "stream": "Science & Engineering", "matchScore": 90, "reasoning": "..." }
    ]
  }
}
```

---

### POST /api/ai/skill-gap

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Analyze skill gap for a target role |

**Request Body:**

```json
{
  "targetRole": "Full Stack Developer",
  "currentSkills": [
    { "name": "JavaScript", "level": "advanced" },
    { "name": "React", "level": "intermediate" }
  ],
  "experience": 2
}
```

> **Level enum:** `beginner`, `intermediate`, `advanced`, `expert`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "gapAnalysis": {
      "missingSkills": [
        { "skill": "Node.js", "importance": "high", "learningResources": [...] }
      ],
      "overallMatch": 65,
      "suggestedTimeline": "3 months"
    }
  }
}
```

---

### POST /api/ai/roadmap-generate

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Generate AI-powered learning roadmap |

**Request Body:**

```json
{
  "goal": "Become a Machine Learning Engineer",
  "currentLevel": "intermediate",
  "timeframe": "6months",
  "preferences": { "learningStyle": "hands-on", "weeklyHours": 10 }
}
```

> **currentLevel enum:** `beginner`, `intermediate`, `advanced`  
> **timeframe enum:** `1month`, `3months`, `6months`, `1year`, `2years`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "roadmap": {
      "goal": "Become a Machine Learning Engineer",
      "timeframe": "6months",
      "phases": [
        { "phase": 1, "title": "Foundations", "duration": "1 month", "tasks": [...], "resources": [...] }
      ]
    }
  }
}
```

---

### POST /api/ai/chat

| Detail | Value |
|--------|-------|
| Auth | `authenticate`, `checkChatLimit` |
| Description | Send a message to the AI career counselor |

**Request Body:**

```json
{
  "message": "What career should I pursue if I love programming and math?",
  "sessionId": "existing-session-id",
  "context": { "previousMessages": [...] }
}
```

> **Rate limits (daily):** NEWBIE=5, PRO=20, PRO_PLUS=50

**Response (200):**

```json
{
  "success": true,
  "data": {
    "response": "Based on your interests in programming and math...",
    "chatLimitRemaining": 4
  }
}
```

---

### POST /api/ai/resume-analyze

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Analyze resume content with AI |

**Request Body:**

```json
{
  "resumeContent": "Full resume text content here (max 50000 chars)...",
  "targetRole": "Software Engineer",
  "jobDescription": "Optional job description for tailored analysis (max 10000 chars)..."
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "analysis": {
      "overallScore": 82,
      "atsScore": 75,
      "strengths": [...],
      "weaknesses": [...],
      "suggestions": [...],
      "keywordGaps": [...]
    }
  }
}
```

---

### POST /api/ai/future-simulate

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Simulate future career outcomes based on choices |

**Request Body:**

```json
{
  "currentPath": "Computer Science student interested in AI",
  "choices": [
    "Specialize in Machine Learning",
    "Pursue a Master's degree",
    "Join a startup"
  ],
  "timeframe": "5years"
}
```

> **timeframe enum:** `1year`, `3years`, `5years`, `10years`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "simulation": {
      "timeline": [
        { "year": 1, "scenario": "...", "expectedOutcome": "..." }
      ],
      "recommendedPath": "...",
      "alternativePaths": [...]
    }
  }
}
```

---

### POST /api/ai/quiz-analyze

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Analyze quiz results with AI |

**Request Body:**

```json
{
  "quizId": "uuid-of-quiz",
  "answers": [
    { "questionId": "q1", "selectedOption": "Agree" },
    { "questionId": "q2", "selectedOption": "Strongly Agree" }
  ],
  "quizType": "CAREER_INTEREST"
}
```

> **QuizType enum:** `CAREER_INTEREST`, `PERSONALITY`, `SKILL_ASSESSMENT`, `APTITUDE`, `LEARNING_STYLE`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "analysis": {
      "personalityInsights": "...",
      "careerSuggestions": [...],
      "strengthAreas": [...],
      "developmentAreas": [...]
    }
  }
}
```

---

### POST /api/ai/course-recommend

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Get AI-powered course recommendations |

**Request Body:**

```json
{
  "skills": ["Python", "Machine Learning"],
  "interests": ["AI", "Data Science"],
  "level": "intermediate",
  "budget": { "min": 0, "max": 200 }
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "recommendations": [
      { "course": { "...": "course object" }, "matchScore": 95, "reasoning": "..." }
    ]
  }
}
```

---

### POST /api/ai/job-match

| Detail | Value |
|--------|-------|
| Auth | `authenticate` |
| Description | Match user profile to suitable jobs |

**Request Body:**

```json
{
  "skills": ["JavaScript", "React", "Node.js"],
  "experience": 3,
  "location": "New York",
  "preferences": {
    "jobType": "full-time",
    "salaryMin": 80000,
    "salaryMax": 150000
  }
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "matches": [
      { "job": { "...": "job object" }, "matchScore": 88, "reasoning": "..." }
    ]
  }
}
```

---

### POST /api/ai/resume-builder/compare

| Detail | Value |
|--------|-------|
| Auth | `authenticate`, `enforceTier(["PRO_PLUS"])` |
| Description | Compare and tailor resume to a job description (PRO_PLUS tier only) |

**Request Body:**

```json
{
  "jobDescription": "We are looking for a Senior Software Engineer with 5+ years..."
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "comparison": {
      "matchScore": 72,
      "missingKeywords": [...],
      "suggestedEdits": [...],
      "tailoredResume": "..."
    }
  }
}
```

---

### GET /api/ai/knowledge-center/articles

| Detail | Value |
|--------|-------|
| Auth | `authenticate`, `enforceTier(["PRO", "PRO_PLUS"])` |
| Description | Generate personalized career news/articles (PRO or PRO_PLUS tier) |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "articles": [
      { "title": "...", "summary": "...", "source": "...", "url": "...", "relevanceScore": 90 }
    ]
  }
}
```

---

## Route Summary Table

| # | Section | Base Path | Auth Required | Admin Only | Total Endpoints |
|---|---------|-----------|:---:|:---:|:---:|
| 1 | Health Check | `/api/health` | — | — | 1 |
| 2 | Auth | `/api/auth` | 2 of 6 | — | 6 |
| 3 | Profile | `/api/profile` | All (18) | — | 18 |
| 4 | Courses | `/api/courses` | 3 of 9 | 3 of 9 | 9 |
| 5 | Jobs | `/api/jobs` | 3 of 11 | 3 of 11 | 11 |
| 6 | Recommendations | `/api/recommendations` | All (6) | — | 6 |
| 7 | Quizzes | `/api/quizzes` | All (7) | — | 7 |
| 8 | Chat | `/api/chat` | All (4) | — | 4 |
| 9 | Notifications | `/api/notifications` | All (4) | — | 4 |
| 10 | Roadmaps | `/api/roadmaps` | All (5) | — | 5 |
| 11 | Resumes | `/api/resumes` | All (6) | — | 6 |
| 12 | Admin | `/api/admin` | All (27) | All (27) | 27 |
| 13 | AI Services | `/api/ai` | All (10) | — | 10 |
| | **Total** | | **~67** | **27** | **85** |

---

*Generated from codebase — EduGuideAI Backend API*
