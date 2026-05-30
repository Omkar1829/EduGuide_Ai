const express = require("express");
const resumeController = require("../controllers/resume.controller");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.use(authenticate);

router.get("/", resumeController.getResumes);
router.get("/:id", resumeController.getResumeById);
router.post("/", resumeController.createResume);
router.put("/:id", resumeController.updateResume);
router.delete("/:id", resumeController.deleteResume);
router.post("/:id/analyze", resumeController.analyzeResume);

module.exports = router;
