module.exports = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres@localhost/truth_checker",
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
    JWT_EXPIRY: process.env.JWT_EXPIRY || 6000,
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN
}

