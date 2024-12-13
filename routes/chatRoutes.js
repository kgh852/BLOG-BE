const express = require('express');
const { createRoom, sendMessage, getMessages } = require('../controllers/chatController');
const authenticateToken = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/rooms', authenticateToken, createRoom);
router.post('/messages', authenticateToken, sendMessage);
router.get('/rooms/:roomId/messages', authenticateToken, getMessages);

module.exports = router;
