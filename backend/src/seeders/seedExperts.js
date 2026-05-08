const dotenv = require("dotenv");
const connectDB = require("../config/db");
const Expert = require("../models/Expert");

dotenv.config();

const sampleExperts = [
  {
    name: "Aarav Mehta",
    category: "Fitness",
    experience: 7,
    rating: 4.8,
    bio: "Certified fitness coach specializing in transformation programs.",
    availableSlots: [
      { date: "2026-05-09", times: ["10:00", "11:00", "12:00"] },
      { date: "2026-05-10", times: ["10:00", "13:00", "15:00"] },
    ],
  },
  {
    name: "Riya Sharma",
    category: "Career",
    experience: 5,
    rating: 4.6,
    bio: "Career mentor for product and software roles.",
    availableSlots: [
      { date: "2026-05-09", times: ["14:00", "15:00", "16:00"] },
      { date: "2026-05-10", times: ["09:00", "11:00", "17:00"] },
    ],
  },
  {
    name: "Kabir Arora",
    category: "Mental Wellness",
    experience: 9,
    rating: 4.9,
    bio: "Wellness and mindfulness expert with corporate coaching experience.",
    availableSlots: [
      { date: "2026-05-09", times: ["09:00", "10:00", "11:00"] },
      { date: "2026-05-10", times: ["16:00", "17:00", "18:00"] },
    ],
  },
];

const seed = async () => {
  try {
    await connectDB();
    await Expert.deleteMany({});
    await Expert.insertMany(sampleExperts);
    // eslint-disable-next-line no-console
    console.log("Experts seeded successfully.");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Seeding failed:", error);
  } finally {
    process.exit(0);
  }
};

seed();
