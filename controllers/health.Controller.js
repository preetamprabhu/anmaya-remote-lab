class HealthController {
    checkHealth(req, res) {
        res.status(200).json({ status: "ok", message: "Connected to server!" });
    }

    sendMessage(req, res) {
        res.status(200).json({ status: "ok", message: "Connected to server!" });
    }
}

module.exports = new HealthController();