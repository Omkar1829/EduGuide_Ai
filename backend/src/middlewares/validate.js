const { validationResult } = require("express-validator");

const validate = (reqOrValidations, res, next) => {
  // If used as a wrapper function: validate([rules])
  if (Array.isArray(reqOrValidations)) {
    const validations = reqOrValidations;
    return async (req, res, next) => {
      for (const validation of validations) {
        await validation.run(req);
      }

      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      const extractedErrors = errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
        value: err.value,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: extractedErrors,
      });
    };
  }

  // If used directly as a middleware: validate
  const req = reqOrValidations;
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = errors.array().map((err) => ({
    field: err.path,
    message: err.msg,
    value: err.value,
  }));

  return res.status(400).json({
    success: false,
    message: "Validation failed",
    errors: extractedErrors,
  });
};

module.exports = validate;
