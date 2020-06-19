BEGIN;

TRUNCATE
    users,
    facts,
    reports
    RESTART IDENTITY CASCADE;

INSERT INTO users ("role", "email", "password", "date_created")
    VALUES
        ('Admin', 'admin@gmail.com', '$2a$12$fWlkA.PfrRTQaG2Gqu1trO/JXF7R7biva7Wk98MAQ1ua/X6/bWLJy', '2020-01-01'),
        ('End-User', 'jill@gmail.com', '$2a$12$VQ5HgWm34QQK2rJyLc0lmu59cy2jcZiV6U1.bE8rBBnC9VxDf/YQO', '2020-02-13');

INSERT INTO facts ("title", "text", "user_id", "status")
    VALUES
        ('The Sky is Blue', 'During the day', 2, 'Pending'),
        ('Grass is Orange', '', 2, 'Under Review'),
        ('Chocolate is sweet', 'Milk Chocolate', 2, 'Approved'),
        ('The Moon is made of cheese', '', 2, 'Not True');

INSERT INTO reports ("report_id", "fact_id", "date_created", "report_status")
    VALUES
        (1, 1, '2020-06-06', 'Processing'),
        (2, 2, '2020-06-07', 'Processing'),
        (3, 3, '2020-06-08', 'Processing');

COMMIT;