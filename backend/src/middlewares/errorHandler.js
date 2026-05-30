class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const handlePrismaError = (error) => {
  if (error.code === "P2025") {
    return new AppError("Resource not found", 404);
  }
  if (error.code === "P2002") {
    const field = error.meta?.target?.[0] || "field";
    return new AppError(`A record with this ${field} already exists`, 409);
  }
  if (error.code === "P2003") {
    return new AppError("Related resource not found", 400);
  }
  if (error.code === "P2014") {
    return new AppError("Required relation violation", 400);
  }
  return new AppError("Database error occurred", 500);
};

const errorHandler = (err, req, res, _next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(`[Error] ${err.message}`, {
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  if (err.name === "PrismaClientKnownRequestError" || err.code) {
    error = handlePrismaError(err);
  }

  if (err.name === "JsonWebTokenError") {
    error = new AppError("Invalid token. Please log in again.", 401);
  }

  if (err.name === "TokenExpiredError") {
    error = new AppError("Token expired. Please log in again.", 401);
  }

  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      error = new AppError("File size too large. Maximum size is 5MB.", 400);
    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
      error = new AppError("Unexpected file field.", 400);
    } else {
      error = new AppError("File upload error.", 400);
    }
  }

  if (err.type === "entity.too.large") {
    error = new AppError("Request payload too large.", 413);
  }

  const statusCode = error.statusCode || 500;
  const message = error.isOperational ? error.message : "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && !error.isOperational && {
      stack: err.stack,
    }),
  });
};

const notFoundHandler = (req, res, _next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

module.exports = { AppError, errorHandler, notFoundHandler };
