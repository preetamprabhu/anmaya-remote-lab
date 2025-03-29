const { spawn } = require("child_process");
const WebSocket = require('ws');  // Add this import

class WebSocketController {
  handleConnection(ws) {
    console.log("Client connected");
    const ffmpegProcess = this.initializeFFmpeg();
    this.setupEventListeners(ws, ffmpegProcess);
  }

  initializeFFmpeg() {
    return spawn('ffmpeg', [
      '-f', 'v4l2',
      '-input_format', 'yuyv422',
      '-video_size', '640x480',
      '-i', '/dev/video0',
      '-vf', 'scale=640:480',
      '-f', 'mjpeg',
      '-q:v', '5',
      '-r', '30',
      'pipe:1'
    ]);
  }

  setupEventListeners(ws, ffmpeg) {
    ffmpeg.stdout.on("data", (data) => {
      if (ws.readyState === WebSocket.OPEN) {  // Now WebSocket.OPEN will be defined
        ws.send(data);
      }
    });

    ffmpeg.stderr.on('data', (data) => {
      console.log(`FFmpeg stderr: ${data}`);
    });

    ffmpeg.on("error", (err) => {
      console.error("FFmpeg process error:", err);
    });

    ws.on("close", () => {
      ffmpeg.kill("SIGINT");
      console.log("Client disconnected");
    });
  }
}

module.exports = new WebSocketController();