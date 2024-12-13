const express = require('express');
const { register, login, refresh, updateUser, deleteUser } = require('../controllers/authController');
const authenticateToken = require('../middlewares/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: 사용자 등록
 *     description: 새로운 사용자를 등록합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       201:
 *         description: 사용자 등록 성공
 *       400:
 *         description: 요청이 잘못됨
 */
router.post('/register', register);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: 사용자 로그인
 *     description: 사용자 인증 및 JWT 토큰 발급
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: 로그인 성공
 *       401:
 *         description: 인증 실패
 */
router.post('/login', login);

/**
 * @swagger
 * /user/refresh:
 *   post:
 *     summary: JWT 토큰 갱신
 *     description: 유효한 refresh token을 사용해 새로운 access token을 발급합니다.
 *     responses:
 *       200:
 *         description: 토큰 갱신 성공
 *       401:
 *         description: 인증 실패
 */
router.post('/refresh', refresh);

/**
 * @swagger
 * /user/update:
 *   put:
 *     summary: 사용자 정보 수정
 *     description: 인증된 사용자의 정보를 수정합니다.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 사용자 정보 수정 성공
 *       401:
 *         description: 인증 실패
 */
router.put('/update', authenticateToken, updateUser);

/**
 * @swagger
 * /user/delete:
 *   delete:
 *     summary: 사용자 삭제
 *     description: 인증된 사용자를 삭제합니다.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자 삭제 성공
 *       401:
 *         description: 인증 실패
 */
router.delete('/delete', authenticateToken, deleteUser);

module.exports = router;
