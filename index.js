const express = require("express");
const WebSocket = require("ws");
const { spawn } = require("child_process");
const app = express();
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });
const cors = require("cors");
const helmet = require("helmet");
const errorHandler = require("./utils/errorHandler");
const CustomError = require("./utils/CustomError");
require("dotenv").config();
const PORT = process.env.PORT || 4000;

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};

// Update helmet options to allow WebSocket
const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://chukkitechnologies.com", "ws:", "wss:"],
      fontSrc: ["'self'", "https:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'"],
    },
  },
};

// Middleware
app.use(helmet(helmetOptions));
app.use(cors(corsOptions));
app.use(express.static(require("path").join(process.cwd(), "static")));

// WebSocket connection handling
wss.on("connection", (ws) => {
  console.log("Client connected");

  // For Windows, we'll use DirectShow (dshow) instead of v4l2
  const ffmpeg = spawn('ffmpeg', [
    '-f', 'dshow',
    '-i', 'video=USB Video Device', // Default webcam name, might need to be adjusted
    '-vf', 'scale=640:480',
    '-f', 'mjpeg',
    'pipe:1'
  ]);

  ffmpeg.stdout.on("data", (data) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  });

  ffmpeg.stderr.on('data', (data) => {
    console.log(`FFmpeg stderr: ${data}`);
  });

  ws.on("close", () => {
    ffmpeg.kill("SIGINT");
    console.log("Client disconnected");
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'static', 'index.html'));
});

app.get("/send-message", (req, res) => {
  res.status(200).json({ status: "ok", message: "Connected to server!" });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Connected to server!" });
});

// Handle undefined routes
app.all("*", (req, res, next) => {
  next(
    new CustomError(404, false, `Can't find ${req.originalUrl} on this server!`)
  );
});

// Error handling middleware
app.use(errorHandler);

// Use server.listen instead of app.listen for WebSocket support
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



