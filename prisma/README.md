# Database Documentation

## Overview

EduGuide AI uses PostgreSQL with Prisma ORM for data management.

## Schema Overview

### Core Entities

| Entity | Description |
|--------|-------------|
| users | User accounts (students, admins) |
| student_profiles | Student profile information |
| academic_records | Educational history |
| subject_marks | Individual subject scores |
| interests | Student interests |
| career_goals | Career objectives |
| strengths | Student strengths |
| weaknesses | Areas for improvement |
| skills | Master skills list |
| student_skills | Student skill mappings |
| certifications | Professional certifications |

### Course & Job Entities

| Entity | Description |
|--------|-------------|
| courses | Course catalog |
| user_courses | Student course enrollments |
| jobs | Job listings |
| user_jobs | Student job saves/applications |

### AI & Recommendation Entities

| Entity | Description |
|--------|-------------|
| recommendations | AI-generated recommendations |
| career_roadmaps | Career progression plans |
| quizzes | Assessment quizzes |
| quiz_results | Quiz answers and scores |
| chat_history | AI counselor conversations |
| resume_analysis | Resume parsing results |

### System Entities

| Entity | Description |
|--------|-------------|
| notifications | User notifications |
| refresh_tokens | JWT refresh tokens |

## Relationships

```
User (1) ──── (1) StudentProfile
User (1) ──── (N) Recommendation
User (1) ──── (N) CareerRoadmap
User (1) ──── (N) Quiz
User (1) ──── (N) ChatHistory
User (1) ──── (N) ResumeAnalysis
User (1) ──── (N) Notification

StudentProfile (1) ──── (N) AcademicRecord
StudentProfile (1) ──── (N) Interest
StudentProfile (1) ──── (N) CareerGoal
StudentProfile (1) ──── (N) Strength
StudentProfile (1) ──── (N) Weakness
StudentProfile (1) ──── (N) StudentSkill
StudentProfile (1) ──── (N) Certification

AcademicRecord (1) ──── (N) SubjectMark
StudentSkill (N) ──── (1) Skill
UserCourse (N) ──── (1) Course
UserJob (N) ──── (1) Job
Quiz (1) ──── (N) QuizResult
```

## Setup Instructions

### Prerequisites

1. PostgreSQL installed and running
2. Node.js installed

### Installation

1. Copy `.env.example` to `.env` and configure database URL:
   ```bash
   cp backend/.env.example backend/.env
   ```

2. Update `DATABASE_URL` in `.env`:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/eduguide_ai?schema=public"
   ```

3. Run migrations:
   ```bash
   npx prisma migrate dev
   ```

4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

5. Seed initial data:
   ```bash
   node prisma/seeds/seed.js
   ```

### Available Commands

```bash
# Run migrations
npx prisma migrate dev

# Generate client
npx prisma generate

# Open Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset
```

## Indexing Strategy

Indexes are created on:
- Foreign keys for join performance
- Frequently queried fields (email, category, status)
- Composite indexes for common query patterns
- Unique constraints for data integrity

## Data Integrity

- UUID primary keys for all tables
- Foreign key cascades for data consistency
- Unique constraints prevent duplicates
- Enum types for controlled values
