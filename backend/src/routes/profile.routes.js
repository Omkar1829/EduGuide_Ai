const { Router } = require("express");
const { body, param, query } = require("express-validator");
const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");
const profileController = require("../controllers/profile.controller");

const router = Router();

router.use(authenticate);

// ─── Profile ──────────────────────────────────────────

router.get("/profile", profileController.getProfile);

router.put(
  "/profile",
  [
    body("dateOfBirth").optional().isString().withMessage("Invalid date"),
    body("gender")
      .optional()
      .isIn(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"])
      .withMessage("Invalid gender"),
    body("phoneNumber")
      .optional()
      .isMobilePhone("any")
      .withMessage("Invalid phone number"),
    body("bio").optional().isLength({ max: 1000 }).withMessage("Bio too long"),
    body("city").optional().isString(),
    body("state").optional().isString(),
    body("country").optional().isString(),
    body("address").optional().isString(),
  ],
  validate,
  profileController.updateProfile
);

// ─── Academic Records ─────────────────────────────────

router.post(
  "/profile/academic-records",
  [
    body("institution").notEmpty().withMessage("Institution is required"),
    body("degree").notEmpty().withMessage("Degree is required"),
    body("fieldOfStudy").notEmpty().withMessage("Field of study is required"),
    body("year")
      .isIn([
        "FRESHMAN",
        "SOPHOMORE",
        "JUNIOR",
        "SENIOR",
        "GRADUATE",
        "POST_GRADUATE",
      ])
      .withMessage("Invalid academic year"),
    body("startYear")
      .isInt({ min: 1900, max: 2100 })
      .withMessage("Invalid start year"),
    body("endYear")
      .optional()
      .isInt({ min: 1900, max: 2100 })
      .withMessage("Invalid end year"),
    body("gpa").optional().isFloat({ min: 0, max: 10 }),
    body("percentage").optional().isFloat({ min: 0, max: 100 }),
    body("isCurrent").optional().isBoolean(),
  ],
  validate,
  profileController.addAcademicRecord
);

router.put(
  "/profile/academic-records/:recordId",
  [
    param("recordId").isUUID().withMessage("Invalid record ID"),
    body("institution").optional().isString(),
    body("degree").optional().isString(),
    body("fieldOfStudy").optional().isString(),
    body("year")
      .optional()
      .isIn([
        "FRESHMAN",
        "SOPHOMORE",
        "JUNIOR",
        "SENIOR",
        "GRADUATE",
        "POST_GRADUATE",
      ]),
    body("startYear").optional().isInt({ min: 1900, max: 2100 }),
    body("endYear").optional().isInt({ min: 1900, max: 2100 }),
    body("gpa").optional().isFloat({ min: 0, max: 10 }),
    body("percentage").optional().isFloat({ min: 0, max: 100 }),
    body("isCurrent").optional().isBoolean(),
  ],
  validate,
  profileController.updateAcademicRecord
);

router.delete(
  "/profile/academic-records/:recordId",
  [param("recordId").isUUID().withMessage("Invalid record ID")],
  validate,
  profileController.deleteAcademicRecord
);

// ─── Subject Marks ────────────────────────────────────

router.post(
  "/profile/academic-records/:recordId/marks",
  [
    param("recordId").isUUID().withMessage("Invalid record ID"),
    body("subjectName").notEmpty().withMessage("Subject name is required"),
    body("marks").isFloat({ min: 0 }).withMessage("Marks must be >= 0"),
    body("maxMarks")
      .optional()
      .isFloat({ min: 1 })
      .withMessage("Max marks must be >= 1"),
    body("grade").optional().isString(),
  ],
  validate,
  profileController.addSubjectMark
);

router.delete(
  "/profile/marks/:markId",
  [param("markId").isUUID().withMessage("Invalid mark ID")],
  validate,
  profileController.deleteSubjectMark
);

// ─── Interests ────────────────────────────────────────

router.get("/profile/interests", profileController.getInterests);

router.post(
  "/profile/interests",
  [
    body("name").notEmpty().withMessage("Interest name is required"),
    body("category").optional().isString(),
    body("level")
      .optional()
      .isInt({ min: 1, max: 10 })
      .withMessage("Level must be between 1 and 10"),
  ],
  validate,
  profileController.addInterest
);

router.delete(
  "/profile/interests/:interestId",
  [param("interestId").isUUID().withMessage("Invalid interest ID")],
  validate,
  profileController.removeInterest
);

// ─── Career Goals ─────────────────────────────────────

router.get("/profile/career-goals", profileController.getCareerGoals);

router.post(
  "/profile/career-goals",
  [
    body("title").notEmpty().withMessage("Goal title is required"),
    body("description").optional().isString(),
    body("targetYear")
      .optional()
      .isInt({ min: 2020, max: 2100 })
      .withMessage("Invalid target year"),
    body("priority")
      .optional()
      .isInt({ min: 1, max: 10 })
      .withMessage("Priority must be between 1 and 10"),
  ],
  validate,
  profileController.addCareerGoal
);

router.put(
  "/profile/career-goals/:goalId",
  [
    param("goalId").isUUID().withMessage("Invalid goal ID"),
    body("title").optional().isString(),
    body("description").optional().isString(),
    body("targetYear")
      .optional()
      .isInt({ min: 2020, max: 2100 }),
    body("priority")
      .optional()
      .isInt({ min: 1, max: 10 }),
  ],
  validate,
  profileController.updateCareerGoal
);

router.delete(
  "/profile/career-goals/:goalId",
  [param("goalId").isUUID().withMessage("Invalid goal ID")],
  validate,
  profileController.removeCareerGoal
);

// ─── Strengths ────────────────────────────────────────

router.get("/profile/strengths", profileController.getStrengths);

router.post(
  "/profile/strengths",
  [
    body("name").notEmpty().withMessage("Strength name is required"),
    body("category").optional().isString(),
    body("evidence").optional().isString(),
  ],
  validate,
  profileController.addStrength
);

router.delete(
  "/profile/strengths/:strengthId",
  [param("strengthId").isUUID().withMessage("Invalid strength ID")],
  validate,
  profileController.removeStrength
);

// ─── Weaknesses ───────────────────────────────────────

router.get("/profile/weaknesses", profileController.getWeaknesses);

router.post(
  "/profile/weaknesses",
  [
    body("name").notEmpty().withMessage("Weakness name is required"),
    body("category").optional().isString(),
    body("evidence").optional().isString(),
  ],
  validate,
  profileController.addWeakness
);

router.delete(
  "/profile/weaknesses/:weaknessId",
  [param("weaknessId").isUUID().withMessage("Invalid weakness ID")],
  validate,
  profileController.removeWeakness
);

// ─── Skills ───────────────────────────────────────────

router.get("/profile/skills", profileController.getSkills);

router.post(
  "/profile/skills",
  [
    body("skillId").isUUID().withMessage("Invalid skill ID"),
    body("level")
      .optional()
      .isInt({ min: 1, max: 10 })
      .withMessage("Level must be between 1 and 10"),
    body("yearsExp")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Years of experience must be >= 0"),
  ],
  validate,
  profileController.addSkill
);

router.delete(
  "/profile/skills/:skillId",
  [param("skillId").isUUID().withMessage("Invalid skill ID")],
  validate,
  profileController.removeSkill
);

router.get(
  "/skills/search",
  [query("q").notEmpty().withMessage("Search query is required")],
  validate,
  profileController.searchSkills
);

// ─── Certifications ───────────────────────────────────

router.get("/profile/certifications", profileController.getCertifications);

router.post(
  "/profile/certifications",
  [
    body("name").notEmpty().withMessage("Certification name is required"),
    body("issuer").notEmpty().withMessage("Issuer is required"),
    body("issueDate").optional().isString().withMessage("Invalid issue date"),
    body("expiryDate").optional().isString().withMessage("Invalid expiry date"),
    body("credentialUrl")
      .optional()
      .isURL()
      .withMessage("Invalid credential URL"),
  ],
  validate,
  profileController.addCertification
);

router.put(
  "/profile/certifications/:certId",
  [
    param("certId").isUUID().withMessage("Invalid certification ID"),
    body("name").optional().isString(),
    body("issuer").optional().isString(),
    body("issueDate").optional().isString(),
    body("expiryDate").optional().isString(),
    body("credentialUrl").optional().isURL(),
  ],
  validate,
  profileController.updateCertification
);

router.delete(
  "/profile/certifications/:certId",
  [param("certId").isUUID().withMessage("Invalid certification ID")],
  validate,
  profileController.removeCertification
);

// ─── Completion ───────────────────────────────────────

router.get("/profile/completion", profileController.calculateProfileCompletion);

module.exports = router;
