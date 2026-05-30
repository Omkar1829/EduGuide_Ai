# Database Agent

Stack

* PostgreSQL
* Prisma ORM

Responsibilities

* Schema Design
* Migrations
* Query Optimization
* Index Strategy

Core Tables

users
student_profiles
academic_records
subject_marks
interests
career_goals
skills
certifications
recommendations
courses
jobs
quizzes
quiz_results

Always Do

* Use UUID primary keys.
* Create foreign keys.
* Normalize data.
* Add indexes for relationships.

Ask First

* Schema restructuring.
* Table deletion.

Never Do

* Duplicate data unnecessarily.
* Remove migrations.

Commands

npx prisma migrate dev
npx prisma generate
npx prisma studio
