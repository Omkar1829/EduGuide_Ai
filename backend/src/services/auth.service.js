const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");
const authRepository = require("../repositories/auth.repository");

const SALT_ROUNDS = 10;

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiry }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiry,
  });
};

const parseExpiry = (expiry) => {
  const unit = expiry.slice(-1);
  const value = parseInt(expiry.slice(0, -1), 10);
  const now = new Date();
  switch (unit) {
    case "s":
      return new Date(now.getTime() + value * 1000);
    case "m":
      return new Date(now.getTime() + value * 60 * 1000);
    case "h":
      return new Date(now.getTime() + value * 60 * 60 * 1000);
    case "d":
      return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  }
};

const register = async ({ firstName, lastName, email, password }) => {
  const existingUser = await authRepository.findByEmail(email);
  if (existingUser) {
    const error = new Error("Email already registered");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await authRepository.create({
    firstName,
    lastName,
    email,
    passwordHash,
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await authRepository.createRefreshToken({
    token: refreshToken,
    userId: user.id,
    expiresAt: parseExpiry(config.jwt.refreshExpiry),
  });

  const { passwordHash: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

const login = async ({ email, password }) => {
  const user = await authRepository.findByEmail(email);
  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error("Account has been deactivated");
    error.statusCode = 403;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  await authRepository.update(user.id, { lastLoginAt: new Date() });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await authRepository.deleteExpiredTokens(user.id);

  await authRepository.createRefreshToken({
    token: refreshToken,
    userId: user.id,
    expiresAt: parseExpiry(config.jwt.refreshExpiry),
  });

  const { passwordHash: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token) => {
  let payload;
  try {
    payload = jwt.verify(token, config.jwt.refreshSecret);
  } catch (err) {
    const error = new Error("Invalid or expired refresh token");
    error.statusCode = 401;
    throw error;
  }

  const storedToken = await authRepository.findRefreshToken(token);
  if (!storedToken) {
    const error = new Error("Refresh token not found");
    error.statusCode = 401;
    throw error;
  }

  if (new Date(storedToken.expiresAt) < new Date()) {
    await authRepository.deleteRefreshToken(token);
    const error = new Error("Refresh token has expired");
    error.statusCode = 401;
    throw error;
  }

  const user = await authRepository.findById(payload.id);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error("Account has been deactivated");
    error.statusCode = 403;
    throw error;
  }

  await authRepository.deleteRefreshToken(token);

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  await authRepository.createRefreshToken({
    token: newRefreshToken,
    userId: user.id,
    expiresAt: parseExpiry(config.jwt.refreshExpiry),
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

const logout = async (token) => {
  try {
    jwt.verify(token, config.jwt.refreshSecret);
  } catch {
    const error = new Error("Invalid refresh token");
    error.statusCode = 401;
    throw error;
  }

  await authRepository.deleteRefreshToken(token);
};

const getProfile = async (userId) => {
  const user = await authRepository.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const { passwordHash: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const updatePassword = async (userId, oldPassword, newPassword) => {
  const user = await authRepository.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!isPasswordValid) {
    const error = new Error("Current password is incorrect");
    error.statusCode = 401;
    throw error;
  }

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await authRepository.update(userId, { passwordHash });
};

const updateSubscription = async (userId, tier) => {
  const allowedTiers = ["NEWBIE", "PRO", "PRO_PLUS"];
  if (!allowedTiers.includes(tier)) {
    const error = new Error("Invalid subscription tier");
    error.statusCode = 400;
    throw error;
  }

  const limits = {
    NEWBIE: 5,
    PRO: 20,
    PRO_PLUS: 50,
  };

  const updatedUser = await authRepository.update(userId, {
    subscriptionTier: tier,
    chatLimitRemaining: limits[tier] || 5,
    lastLimitReset: new Date(),
  });

  const { passwordHash: _, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
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
