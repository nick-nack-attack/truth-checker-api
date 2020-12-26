// Users Service
const xss       = require('xss');
const { db }    = require('../database/connect');

const UsersService = {

    getAllUsers: (db) => {

        return db
            .from('users')
            .select('*')
    },
    insertUser: (newUser) => {
        return db
            .insert(newUser)
            .into('users')
            .return('*')
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
            return `Password must contain 1 upper case, lower case, and number`;
        }
        return null;
    },
    hashPassword: (pw) => {
        return bcrypt.hash(pw, 12);
    },
    hasUserWithEmail: (email) => {
        console.log('checkingEmail::', email)
        return db('users')
            .where({ email })
            .first()
            .then(user => !!user);
    },  
    // prevent malicious attacks by form submissions
    serializeUser: (user) => {
        return {
            user_id: user.user_id,
            role: xss(user.role),
            email: xss(user.email),
            password: xss(user.password),
            date_created: user.date_created
        };
    }

};

module.exports = UsersService;