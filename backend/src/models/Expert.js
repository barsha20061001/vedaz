const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    times: {
      type: [String],
      required: true,
      default: [],
    },
  },
  { _id: false }
);

const expertSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, index: true },
    experience: { type: Number, required: true, min: 0 },
    rating: { type: Number, required: true, min: 0, max: 5 },
    bio: { type: String, default: "" },
    availableSlots: { type: [slotSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expert", expertSchema);
