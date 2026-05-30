const authService = require("../services/auth.service");
const { success, error } = require("../utils/apiResponse");

const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    return success(res, result, "Registration successful", 201);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    return success(res, result, "Login successful", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const refreshToken = async (req, res) => {
  try {
    const result = await authService.refreshToken(req.body.refreshToken);
    return success(res, result, "Token refreshed successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const logout = async (req, res) => {
  try {
    await authService.logout(req.body.refreshToken);
    return success(res, null, "Logged out successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const getProfile = async (req, res) => {
  try {
    const profile = await authService.getProfile(req.user.id);
    return success(res, profile, "Profile fetched successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const updatePassword = async (req, res) => {
  try {
    await authService.updatePassword(
      req.user.id,
      req.body.oldPassword,
      req.body.newPassword
    );
    return success(res, null, "Password updated successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const updateSubscription = async (req, res) => {
  try {
    const user = await authService.updateSubscription(req.user.id, req.body.tier);
    return success(res, user, "Subscription upgraded successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  updatePassword,
  updateSubscription,
};
