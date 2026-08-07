const http = require("http");
const { Server } = require("socket.io");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const hospitalRoutes = require("./routes/hospitalRoutes");
const donorRoutes = require("./routes/donorRoutes");
const requestRoutes = require("./routes/requestRoutes");

connectDB();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚑 Welcome to RaktSetu Backend",
  });
});

// Routes
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/requests", requestRoutes);

io.on("connection", (socket) => {
  console.log("🟢 Client Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Client Disconnected");
  });
});

// Server
const PORT = process.env.PORT || 5000;

app.set("io", io);

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

