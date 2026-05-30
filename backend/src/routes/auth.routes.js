const express = require("express");
const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");
const {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
  updatePasswordValidation,
} = require("../validations/auth.validation");

const router = express.Router();

router.post(
  "/register",
  registerValidation,
  validate,
  authController.register
);

router.post("/login", loginValidation, validate, authController.login);

router.post(
  "/refresh-token",
  refreshTokenValidation,
  validate,
  authController.refreshToken
);

router.post(
  "/logout",
  refreshTokenValidation,
  validate,
  authController.logout
);

router.get("/profile", authenticate, authController.getProfile);

router.put(
  "/password",
  authenticate,
  updatePasswordValidation,
  validate,
  authController.updatePassword
);

router.put(
  "/subscription",
  authenticate,
  authController.updateSubscription
);

module.exports = router;
