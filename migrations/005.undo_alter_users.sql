ALTER TABLE users
    DROP COLUMN "gender",
    DROP COLUMN "full_name",
    DROP COLUMN "address",
    DROP COLUMN "latitude",
    DROP COLUMN "longitude",
    DROP COLUMN "uuid",
    DROP COLUMN "inbox",
    DROP COLUMN "date_of_birth",
    DROP COLUMN "phone",
    DROP COLUMN "ssn",
    DROP COLUMN "photo_url";

 DROP TYPE IF EXISTS GENDER;