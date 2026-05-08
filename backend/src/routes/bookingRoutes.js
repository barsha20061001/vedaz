const express = require("express");
const {
  createBooking,
  getBookingsByEmail,
  updateBookingStatus,
} = require("../controllers/bookingController");
const {
  createBookingValidation,
  updateStatusValidation,
} = require("../validations/bookingValidation");

const router = express.Router();

router.post("/", createBookingValidation, createBooking);
router.patch("/:id/status", updateStatusValidation, updateBookingStatus);
router.get("/", getBookingsByEmail);

module.exports = router;
