const express = require("express");
const roadmapController = require("../controllers/roadmap.controller");
const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.use(authenticate);

router.get("/", roadmapController.getRoadmaps);
router.get("/:id", roadmapController.getRoadmapById);
router.post("/", roadmapController.createRoadmap);
router.put("/:id", roadmapController.updateRoadmap);
router.delete("/:id", roadmapController.deleteRoadmap);

module.exports = router;
