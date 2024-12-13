const express = require('express');
const router = express.Router();
const adminCheck = require('../middlewares/adminMiddleware');
const authenticateToken = require('../middlewares/authMiddleware');
const { getAllUsers, deleteUserByAdmin, deletePostByAdmin } = require('../controllers/adminController');

router.get('/users', authenticateToken, adminCheck, getAllUsers);
router.delete('/user/:id', authenticateToken, adminCheck, deleteUserByAdmin);
router.delete('/post/:id', authenticateToken, adminCheck, deletePostByAdmin);

module.exports = router;
