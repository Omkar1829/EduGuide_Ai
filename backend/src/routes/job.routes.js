const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const validate = require("../middlewares/validate");
const jobController = require("../controllers/job.controller");
const {
  createJobValidation,
  updateJobValidation,
  getJobByIdValidation,
  getJobsByCategoryValidation,
  searchJobsValidation,
  saveJobValidation,
  updateJobStatusValidation,
  removeSavedJobValidation,
} = require("../validations/job.validation");

router.get(
  "/",
  jobController.getAllJobs
);

router.get(
  "/search",
  validate(searchJobsValidation),
  jobController.searchJobs
);

router.get(
  "/saved",
  authenticate,
  jobController.getSavedJobs
);

router.get(
  "/skills",
  jobController.getJobsBySkills
);

router.get(
  "/category/:category",
  validate(getJobsByCategoryValidation),
  jobController.getJobsByCategory
);

router.get(
  "/:id",
  validate(getJobByIdValidation),
  jobController.getJobById
);

router.post(
  "/",
  authenticate,
  authorize(["ADMIN"]),
  validate(createJobValidation),
  jobController.createJob
);

router.put(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  validate(updateJobValidation),
  jobController.updateJob
);

router.delete(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  validate(getJobByIdValidation),
  jobController.deleteJob
);

router.post(
  "/:id/save",
  authenticate,
  validate(saveJobValidation),
  jobController.saveJob
);

router.put(
  "/:id/status",
  authenticate,
  validate(updateJobStatusValidation),
  jobController.updateJobStatus
);

router.delete(
  "/:id/save",
  authenticate,
  validate(removeSavedJobValidation),
  jobController.removeSavedJob
);

module.exports = router;
