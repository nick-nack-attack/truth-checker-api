CREATE TYPE report_status AS ENUM ('Processing', 'Approved', 'Denied');

CREATE TABLE reports (
    report_id SERIAL PRIMARY KEY,
    fact_id INTEGER REFERENCES facts(fact_id) ON DELETE CASCADE NOT NULL,
    date_created TIMESTAMPTZ DEFAULT now(),
    report_status report_status NOT NULL
);