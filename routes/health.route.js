const express = require('express');
const router = express.Router();
const HealthController = require('../controllers/health.Controller');

router.get('/health', HealthController.checkHealth);
router.get('/send-message', HealthController.sendMessage);

module.exports = router;