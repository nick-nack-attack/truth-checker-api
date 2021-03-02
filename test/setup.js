process.env.TZ          = 'UTC';
process.env.NODE_ENV    = 'test';
process.env.JWT_SECRET  = 'test-jwt-secret';
process.env.JWT_EXPIRY  = '3m';

require('dotenv').config();

process.env.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || "postgresql://postgres@localhost/truth_checker_test"

const { expect } = require('chai');
const supertest = require('supertest');

global.expect = expect;
global.supertest = supertest;

// password not longer than 8 characters
// password longer than 72 characters
// password starts with space
// password ends with space
// email already exists
