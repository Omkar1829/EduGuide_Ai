const express = require('express');

const authRoutes = require('./auth.routes');
const profileRoutes = require('./profile.routes');
const courseRoutes = require('./course.routes');
const jobRoutes = require('./job.routes');
const recommendationRoutes = require('./recommendation.routes');
const quizRoutes = require('./quiz.routes');
const chatRoutes = require('./chat.routes');
const notificationRoutes = require('./notification.routes');
const roadmapRoutes = require('./roadmap.routes');
const resumeRoutes = require('./resume.routes');
const adminRoutes = require('./admin.routes');
const aiRoutes = require('./ai.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/courses', courseRoutes);
router.use('/jobs', jobRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/quizzes', quizRoutes);
router.use('/chat', chatRoutes);
router.use('/notifications', notificationRoutes);
router.use('/roadmaps', roadmapRoutes);
router.use('/resumes', resumeRoutes);
router.use('/admin', adminRoutes);
router.use('/ai', aiRoutes);

module.exports = router;
