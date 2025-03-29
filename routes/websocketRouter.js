const WebSocketController = require('../controllers/websocketController');

function setupWebSocketRoutes(wss) {
  wss.on("connection", (ws) => {
    WebSocketController.handleConnection(ws);
  });
}

module.exports = setupWebSocketRoutes;