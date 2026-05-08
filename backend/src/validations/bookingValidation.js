const { body, param } = require("express-validator");

const createBookingValidation = [
  body("expertId").isMongoId().withMessage("Valid expertId is required."),
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("email").isEmail().withMessage("Valid email is required."),
  body("phone")
    .trim()
    .matches(/^[0-9+\-\s]{7,15}$/)
    .withMessage("Valid phone number is required."),
  body("date")
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Date must be in YYYY-MM-DD format."),
  body("timeSlot")
    .matches(/^\d{2}:\d{2}$/)
    .withMessage("Time slot must be in HH:mm format."),
  body("notes").optional().isString().isLength({ max: 500 }),
];

const updateStatusValidation = [
  param("id").isMongoId().withMessage("Valid booking id is required."),
  body("status")
    .isIn(["Pending", "Confirmed", "Completed"])
    .withMessage("Status must be Pending, Confirmed, or Completed."),
];

module.exports = {
  createBookingValidation,
  updateStatusValidation,
};
