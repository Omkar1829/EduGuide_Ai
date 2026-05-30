Project

AI-powered student counseling and career guidance platform.

Stack:

React 19
JavaScript
Redux Toolkit
TailwindCSS
FlyonUI
Node.js
Express.js
PostgreSQL
Prisma ORM
Gemini API
Architecture

Frontend:
/frontend

Backend:
/backend

Database:
/prisma

AI Services:
/backend/src/services/ai

Always Do
Follow existing project structure.
Reuse existing components before creating new ones.
Create Type-safe API contracts.
Validate all user inputs.
Keep controllers thin.
Use service layer for business logic.
Update Prisma schema before database changes.
Generate migration files for schema updates.
Ask First
Changing database schema.
Adding new dependencies.
Refactoring authentication.
Modifying AI prompts.
Deleting existing files.
Never Do
Store API keys in source code.
Commit secrets.
Modify generated Prisma files manually.
Create duplicate components.
Bypass validation.
Skip error handling.
Commands

Frontend:

npm run dev
npm run build
npm run lint

Backend:

npm run dev
npm run test

Database:

npx prisma migrate dev
npx prisma generate
npx prisma studio

References

## Agent Delegation

For frontend tasks:
Load and follow:
agent_docs/frontend.md

For backend tasks:
Load and follow:
agent_docs/backend.md

For database tasks:
Load and follow:
agent_docs/database.md

For AI-related tasks:
Load and follow:
agent_docs/ai.md

For deployment tasks:
Load and follow:
agent_docs/deployment.md

For design tasks:
Load and follow:
agent_docs/uiux.md

Before completing any task:
Run review process defined in:
agent_docs/review.md