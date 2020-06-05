CREATE TYPE status AS ENUM (
    'Pending',
    'Under Review',
    'Approved',
    'Not True'
);

CREATE TABLE facts (
    fact_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    text TEXT,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
    status status NOT NULL,
    date_submitted TIMESTAMPTZ NOT NULL DEFAULT now(),
    date_under_review TIMESTAMPTZ,
    date_approved TIMESTAMPTZ,
    date_note_true TIMESTAMPTZ
);