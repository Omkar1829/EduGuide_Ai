require("dotenv").config();

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  jwt: {
    secret: process.env.JWT_SECRET || "your-default-jwt-secret-change-in-production",
    expiry: process.env.JWT_EXPIRY || "15m",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "your-default-refresh-secret-change-in-production",
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || "7d",
  },

  gemini: {
    apiKey: process.env.GEMINI_API_KEY || "",
  },

  cors: {
    origins: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim())
      : ["http://localhost:3000", "http://localhost:5173"],
  },

  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024,
  },

  cookie: {
    secret: process.env.COOKIE_SECRET || "cookie-secret-change-in-production",
  },
};

module.exports = config;
