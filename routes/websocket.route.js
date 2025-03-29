const WebSocketController = require("./controllers/websocket.controller");

function setupWebSocketRoutes(wss) {
  wss.on("connection", (ws) => {
    WebSocketController.handleConnection(ws);
  });
}

module.exports = setupWebSocketRoutes;