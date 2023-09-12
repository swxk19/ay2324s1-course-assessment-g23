DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'user') THEN
        CREATE USER "user" WITH PASSWORD 'password';
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS users(
    user_id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);
CREATE TABLE IF NOT EXISTS questions(
    question_id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL,
    description VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    complexity VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions(
    session_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(user_id)
    role VARCHAR(255)
)