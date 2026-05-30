# Backend Agent

Stack

* Node.js
* Express.js
* Prisma
* PostgreSQL
* JWT

Responsibilities

* Build APIs.
* Authentication.
* Authorization.
* Business Logic.
* AI Service Integration.

Architecture

controllers/
services/
repositories/
middlewares/
routes/

Always Do

* Validate every request.
* Use service layer.
* Use async error handling.
* Return consistent API responses.

Ask First

* Authentication changes.
* New third-party services.
* Breaking API changes.

Never Do

* Business logic inside routes.
* Raw SQL unless required.
* Store secrets in source code.

Commands

npm run dev
npm run test

Reference

backend/src
