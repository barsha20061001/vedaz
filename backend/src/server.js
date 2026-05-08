const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const app = require("./app");
const connectDB = require("./config/db");

dotenv.config();

const port = Number.parseInt(process.env.PORT || "5000", 10);
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  socket.on("watch-expert", (expertId) => {
    socket.join(expertId);
  });
});

app.set("io", io);

const startServer = async () => {
  await connectDB();
  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${port}`);
  });
};

startServer().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server:", error);
  process.exit(1);
});
