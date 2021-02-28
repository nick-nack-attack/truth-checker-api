// Users Service
const xss       = require('xss');
const bcrypt    = require('bcryptjs');
const { db }    = require('../database/connect');

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const UsersService = {

    getAllUsers: () => {
        return db
            .from('users')
            .select('*')
    },

    insertUser: (newUser) => {
        return db
            .insert(newUser)
            .into('users')
            .returning('*')
            .then(([user]) => user);
    },

    validatePassword: (password) => {
        if (password.length < 8) {
            return 'Password must be longer than 8 characters';
        }
        if (password.length > 72) {
            return 'Password cannot be longer than 72 characters';
        }
        if (password.startsWith(' ')) {
            return 'Password cannot start with a space';
        }
        if (password.endsWith(' ')) {
            return 'Password cannot end with a space';
        }
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return 'Password must contain 1 upper case, lower case, number and special character'
        }
        return null;
    },

    hashPassword: (pw) => {
        return bcrypt.hash(pw, 12);
    },

    hasUserWithEmail: (email) => {
        return db('users')
            .where({ email })
            .first()
            .then(user => !!user);
    },

    // prevent malicious attacks by form submissions
    serializeUser: (user) => {
        return {
            user_id: user.user_id,
            email: xss.filterXSS(user.email),
            date_created: new Date (user.date_created),
        };
    }

};

module.exports = UsersService;
