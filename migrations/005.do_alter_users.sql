CREATE TYPE GENDER AS ENUM (
    'Male',
    'Female'
);

ALTER TABLE users
    ADD COLUMN "gender" GENDER,
    ADD COLUMN "full_name" TEXT,
    ADD COLUMN "address" TEXT,
    ADD COLUMN "latitude" DECIMAL,
    ADD COLUMN "longitude" DECIMAL,
    ADD COLUMN "uuid" TEXT,
    ADD COLUMN "inbox" TEXT,
    ADD COLUMN "date_of_birth" TEXT,
    ADD COLUMN "phone" TEXT,
    ADD COLUMN "ssn" TEXT,
    ADD COLUMN "photo_url" TEXT;