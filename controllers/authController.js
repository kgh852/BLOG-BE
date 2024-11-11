const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username }, 'access_secret_key', { expiresIn: '15m' })
}

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username }, 'refresh_secret_key', { expiresIn: '7d' })
}

const register = async (req, res) => {
    const { username, password } = req.body
    try {
        const existingUser = await prisma.user.findUnique({ where: { username } })
        if (existingUser) return res.status(409).json({ error: '똑같은 이름의 유저가 존재합니다' })

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await prisma.user.create({ data: { username, password: hashedPassword } })
        res.status(201).json(newUser)
    } catch (error) {
        res.status(500).json({ error: '내부 서버 오류' })
    }
}

const login = async (req, res) => {
    try {
        const { username, password: inputPassword } = req.body
        const findUser = await prisma.user.findUnique({ where: { username } })

        if(!findUser) {
            const err = new Error('잘못된 정보입니다')
            err.statusCode = 400
            throw err
        }

        const { id, password: hashedPassword } = findUser
        const validPassword = await bcrypt.compare(inputPassword, hashedPassword)

        if(!validPassword) {
            const err = new Error('잘못된 정보입니다')
            err.statusCode = 400
            throw err
        }

        const accessToken = jwt.sign({ id }, 'access_secret_key', { expiresIn: '1h' })
        const refreshToken = jwt.sign({ id }, 'refresh_secret_key', { expiresIn: '7d' })  

        res.status(200).json({ message: '로그인 성공', accessToken })  
    }
    catch (err) {
        res.status(err.statusCode).json({ message: err.message })
    }
}

const refresh = async (req, res) => {
    const { refreshToken } = req.body

    if (!refreshToken) return res.status(401).json({ message: 'Refresh token이 없습니다' })

    jwt.verify(refreshToken, 'refresh_secret_key', (err, user) => {
        if (err) return res.status(403).json({ message: '유효하지 않은 Refresh token입니다' })

        const accessToken = jwt.sign({ id: user.id }, 'access_secret_key', { expiresIn: '1h' })
        res.status(200).json({ accessToken })
    })
}

const updateUser = async (req, res) => {
    const { username, password } = req.body
    const userId = req.user.id 

    try {
        const dataToUpdate = {}

        if (username) {
            const existingUser = await prisma.user.findUnique({ where: { username } })
            if (existingUser) return res.status(409).json({ error: '똑같은 이름의 유저가 존재합니다' })
            dataToUpdate.username = username
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10)
            dataToUpdate.password = hashedPassword
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: dataToUpdate,
        })
        res.status(200).json({ message: '정보가 성공적으로 수정되었습니다', updatedUser })
    } catch (error) {
        res.status(500).json({ error: '내부 서버 오류' })
    }
}

const deleteUser = async (req, res) => {
    const userId = req.user.id

    try {
        await prisma.user.delete({ where: { id: userId } })
        res.status(200).json({ message: '사용자 계정이 삭제되었습니다' })
    } catch (error) {
        res.status(500).json({ error: '내부 서버 오류' })
    }
}

module.exports = { register, login, refresh, updateUser, deleteUser }