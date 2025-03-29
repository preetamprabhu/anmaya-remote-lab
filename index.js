const express = require("express");
const WebSocket = require("ws");
const app = express();
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });
const cors = require("cors");
const helmet = require("helmet");
const errorHandler = require("./utils/errorHandler");
const CustomError = require("./utils/CustomError");
const setupWebSocketRoutes = require('./routes/websocket.route');
const path = require('path');
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

// Setup WebSocket routes
setupWebSocketRoutes(wss);


// Remove these as they're now handled by the health routes
// app.get("/send-message", (req, res) => {...});
// app.get("/api/health", (req, res) => {...});

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



