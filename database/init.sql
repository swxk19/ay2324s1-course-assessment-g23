DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'user') THEN
        CREATE USER "user" WITH PASSWORD 'password';
    END IF;
END $$;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS users(
    user_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(255) NOT NULL DEFAULT 'normal'
);
CREATE TABLE IF NOT EXISTS questions(
    question_id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL,
    description VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    complexity VARCHAR(255) NOT NULL
);
INSERT INTO users (username, password, email, role) VALUES ('admin', 'password', 'admin@email.com', 'maintainer');