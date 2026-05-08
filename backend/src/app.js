const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const expertRoutes = require("./routes/expertRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/experts", expertRoutes);
app.use("/bookings", (req, res, next) => {
  req.io = app.get("io");
  next();
}, bookingRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.use(errorHandler);

module.exports = app;
