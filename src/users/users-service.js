const xss = require('xss');

const UsersService = {

    getAllUsers(db) {
        return db
            .from('users')
            .select('*')
    },

    serializeUser(user) {
        return {
            user_id: user.user_id,
            role: user.role,
            email: xss(user.email),
            password: xss(user.password),
            date_created: user.date_created
        };
    }

};

module.exports = UsersService