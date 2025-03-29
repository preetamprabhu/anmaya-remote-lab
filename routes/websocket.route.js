const WebSocketController = require("../controllers/websocket.controller.js");

function setupWebSocketRoutes(wss) {
  wss.on("connection", (ws) => {
    WebSocketController.handleConnection(ws);
  });
}

module.exports = setupWebSocketRoutes;