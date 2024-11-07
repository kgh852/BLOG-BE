const jwt = require('jsonwebtoken')

const generateAccessToken = (userId) => {
    return jwt.sign({ id: userId }, 'access_secret_key', { expiresIn: '1h' })
}

const generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, 'refresh_secret_key', { expiresIn: '7d' })
}

module.exports = { generateAccessToken, generateRefreshToken }
