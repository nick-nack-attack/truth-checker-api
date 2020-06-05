CREATE TYPE role AS ENUM ('Admin', 'End-User');

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    role role NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    date_created TIMESTAMPTZ NOT NULL DEFAULT now()
);