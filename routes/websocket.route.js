const WebSocketController = require("../controllers/websocket.controllerjs");

function setupWebSocketRoutes(wss) {
  wss.on("connection", (ws) => {
    WebSocketController.handleConnection(ws);
  });
}

module.exports = setupWebSocketRoutes;