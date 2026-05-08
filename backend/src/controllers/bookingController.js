const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Expert = require("../models/Expert");

const withValidation = (req) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 400;
    error.details = result.array();
    throw error;
  }
};

const createBooking = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    withValidation(req);
    const { expertId, name, email, phone, date, timeSlot, notes } = req.body;

    session.startTransaction();

    const expert = await Expert.findById(expertId).session(session);
    if (!expert) {
      const error = new Error("Expert not found.");
      error.statusCode = 404;
      throw error;
    }

    const slotGroup = expert.availableSlots.find((slot) => slot.date === date);
    if (!slotGroup || !slotGroup.times.includes(timeSlot)) {
      const error = new Error("Selected slot is not available.");
      error.statusCode = 400;
      throw error;
    }

    const existing = await Booking.findOne({ expertId, date, timeSlot }).session(session);
    if (existing) {
      const error = new Error("This slot is already booked.");
      error.statusCode = 409;
      throw error;
    }

    const booking = await Booking.create(
      [
        {
          expertId,
          expertName: expert.name,
          name,
          email,
          phone,
          date,
          timeSlot,
          notes: notes || "",
        },
      ],
      { session }
    );

    slotGroup.times = slotGroup.times.filter((time) => time !== timeSlot);
    expert.availableSlots = expert.availableSlots.filter((slot) => slot.times.length > 0);
    await expert.save({ session });

    await session.commitTransaction();

    req.io.to(expertId).emit("slot-booked", {
      expertId,
      date,
      timeSlot,
    });

    res.status(201).json({
      message: "Booking created successfully.",
      booking: booking[0],
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    if (error && error.code === 11000) {
      return res.status(409).json({ message: "This slot is already booked." });
    }

    next(error);
  } finally {
    await session.endSession();
  }
};

const getBookingsByEmail = async (req, res, next) => {
  try {
    const email = (req.query.email || "").trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ message: "Email query parameter is required." });
    }

    const bookings = await Booking.find({ email }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    withValidation(req);
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    res.status(200).json({
      message: "Booking status updated.",
      booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getBookingsByEmail,
  updateBookingStatus,
};
