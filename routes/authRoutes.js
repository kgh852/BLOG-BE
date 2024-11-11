const express = require('express')
const { register, login, refresh, updateUser, deleteUser } = require('../controllers/authController')
const authenticateToken = require('../middlewares/authMiddleware')
const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refresh)
router.put('/update', authenticateToken, updateUser) 
router.delete('/delete', authenticateToken, deleteUser)

module.exports = router

.