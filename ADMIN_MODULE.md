# EduGuide AI - Admin Module Documentation

## Overview

Complete admin dashboard for managing users, courses, jobs, and viewing platform analytics.

---

## Admin Backend API Endpoints

### Base URL: `/api/admin`

All endpoints require:
- **Authentication:** JWT Bearer token
- **Authorization:** ADMIN role

---

### Platform Statistics

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/admin/stats` | GET | Platform-wide statistics |

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "totalCourses": 48,
    "totalJobs": 156,
    "activeQuizzes": 12,
    "activeUsers": 890,
    "newThisWeek": 45,
    "userGrowth": "+12%",
    "courseGrowth": "+5%",
    "jobGrowth": "+8%"
  }
}
```

---

### Analytics

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/admin/analytics` | GET | Charts data (users, courses, jobs over time) |

**Query Params:** `period` (7d, 30d, 90d)

---

### Recent Activity

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/admin/activity` | GET | Recent platform activity feed |

**Query Params:** `limit` (default: 10)

---

### User Management

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/admin/users` | GET | List all users | Admin |
| `/admin/users/:id` | GET | Get user details | Admin |
| `/admin/users/:id` | PUT | Update user | Admin |
| `/admin/users/:id` | DELETE | Delete user | Admin |
| `/admin/users/:id/toggle-active` | PUT | Toggle user status | Admin |

**List Query Params:**
- `page` - Page number
- `limit` - Items per page
- `search` - Search by name/email
- `role` - Filter by role (STUDENT, ADMIN)

---

### Course Management

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/admin/courses` | GET | List all courses | Admin |
| `/admin/courses/:id` | GET | Get course details | Admin |
| `/admin/courses` | POST | Create course | Admin |
| `/admin/courses/:id` | PUT | Update course | Admin |
| `/admin/courses/:id` | DELETE | Delete course | Admin |

**Course Schema:**
```json
{
  "title": "string (required)",
  "description": "string",
  "provider": "string (required)",
  "url": "string",
  "duration": "string",
  "level": "string",
  "category": "string (required)",
  "price": "number",
  "currency": "string (default: INR)"
}
```

---

### Job Management

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/admin/jobs` | GET | List all jobs | Admin |
| `/admin/jobs/:id` | GET | Get job details | Admin |
| `/admin/jobs` | POST | Create job | Admin |
| `/admin/jobs/:id` | PUT | Update job | Admin |
| `/admin/jobs/:id` | DELETE | Delete job | Admin |

**Job Schema:**
```json
{
  "title": "string (required)",
  "description": "string",
  "company": "string (required)",
  "location": "string",
  "url": "string",
  "salaryRange": "string",
  "experience": "string",
  "skills": ["string"],
  "category": "string (required)",
  "type": "string (full-time/part-time/internship)"
}
```

---

## Admin Frontend Pages

### 1. Admin Dashboard (`/admin`)

**Features:**
- 6 stats cards (Users, Courses, Jobs, Quizzes, Active, New This Week)
- Quick actions (Add Course, Add Job, View Users, Analytics)
- User growth chart (line chart)
- Course enrollment chart (bar chart)
- Job postings chart (bar chart)
- Recent activity feed
- Platform health status

---

### 2. User Management (`/admin/users`)

**Features:**
- Users table with search and role filter
- Columns: Avatar, Name, Email, Role, Status, Joined, Actions
- Actions: View, Edit, Toggle Active, Delete
- Pagination
- Add/Edit user modal
- Delete confirmation modal

---

### 3. Course Management (`/admin/courses`)

**Features:**
- Courses table with search and category filter
- Columns: Title, Provider, Category, Rating, Enrolled, Status, Actions
- Actions: View, Edit, Delete
- Add Course modal with all fields
- Edit Course modal
- Delete confirmation

---

### 4. Job Management (`/admin/jobs`)

**Features:**
- Jobs table with search and category filter
- Columns: Title, Company, Location, Category, Type, Posted, Actions
- Actions: View, Edit, Delete
- Add Job modal with all fields
- Edit Job modal
- Delete confirmation

---

### 5. Analytics (`/admin/analytics`)

**Features:**
- Users over time chart
- Course enrollments chart
- Job applications chart
- Top courses list
- Top jobs list
- Platform health metrics

---

## Admin Components

| Component | Purpose |
|-----------|---------|
| AdminLayout | Admin page wrapper with sidebar |
| AdminSidebar | Admin navigation sidebar |
| AdminStatsCard | Reusable stats card |
| AdminTable | Reusable table with sorting/pagination |
| UserManagementTable | Users table component |
| CourseManagementTable | Courses table component |
| JobManagementTable | Jobs table component |
| ActivityChart | Chart component (line/bar) |
| UserFormModal | Add/Edit user modal |
| CourseFormModal | Add/Edit course modal |
| JobFormModal | Add/Edit job modal |
| DeleteConfirmModal | Delete confirmation modal |

---

## Redux State

```javascript
{
  admin: {
    stats: null,
    analytics: null,
    activity: [],
    users: [],
    usersPagination: { page: 1, limit: 10, total: 0 },
    currentUser: null,
    courses: [],
    coursesPagination: { page: 1, limit: 10, total: 0 },
    currentCourse: null,
    jobs: [],
    jobsPagination: { page: 1, limit: 10, total: 0 },
    currentJob: null,
    loading: false,
    error: null
  }
}
```

---

## File Structure

### Backend (5 new files)
```
backend/src/
├── controllers/admin.controller.js
├── repositories/admin.repository.js
├── routes/admin.routes.js
├── services/admin.service.js
└── validations/admin.validation.js
```

### Frontend (16 new files)
```
frontend/src/
├── pages/admin/
│   ├── AdminUsersPage.jsx
│   ├── AdminCoursesPage.jsx
│   ├── AdminJobsPage.jsx
│   └── AdminAnalyticsPage.jsx
├── components/admin/
│   ├── AdminLayout.jsx
│   ├── AdminSidebar.jsx
│   ├── AdminStatsCard.jsx
│   ├── AdminTable.jsx
│   ├── UserManagementTable.jsx
│   ├── CourseManagementTable.jsx
│   ├── JobManagementTable.jsx
│   ├── ActivityChart.jsx
│   ├── UserFormModal.jsx
│   ├── CourseFormModal.jsx
│   ├── JobFormModal.jsx
│   └── DeleteConfirmModal.jsx
├── services/adminService.js
└── store/slices/adminSlice.js
```

---

## API Endpoints Summary

| Category | Endpoints | Auth |
|----------|-----------|------|
| Platform Stats | 1 | Admin |
| Analytics | 1 | Admin |
| Activity | 1 | Admin |
| Users | 5 | Admin |
| Courses | 5 | Admin |
| Jobs | 5 | Admin |
| **Total** | **18** | Admin |

---

## Complete Project Stats

| Category | Before | After | Added |
|----------|--------|-------|-------|
| Backend Files | 53 | 58 | +5 |
| Frontend Files | 89 | 105 | +16 |
| API Endpoints | 89 | 107 | +18 |
| Redux Slices | 8 | 9 | +1 |
| Pages | 14 | 18 | +4 |
| Components | 48 | 60 | +12 |

---

*Generated: May 29, 2026*
