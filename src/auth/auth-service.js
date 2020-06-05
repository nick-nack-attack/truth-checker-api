const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const AuthService = {

    checkAllFields(loginUser) {
        for (const [key, value] of Object.entries(loginUser))
                if (value == null)
            return res.status(400).json({
                error: `Missing '${key}' in request body`
            })
    },

    comparePasswords(password, hash) {
        return bcrypt.compare(password, hash)
    },

    createJwt(subject, payload) {
        return jwt.sign(payload, config.JWT_SECRET, {
            subject,
            expiresIn: config.JWT_EXPIRY,
            algorithm: 'HS256'
        })
    },

    getUserWithUsername(db, user_name) {
        return db('users')
        .where({ user_name })
        .first()
    },

    parseBasicToken(token) {
        return Buffer
            .from(token, 'base64')
            .toSpring()
            .split(':')
    },

    verifyJwt(token) {
        return jwt.verify(token, config.JWT_SECRET,
            {algorithms: ['HS256']
        })
    }

}

module.exports = AuthService