CREATE TYPE roles AS ENUM ('user', 'admin');

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    full_name varchar(255) NOT NULL,
    job_title varchar(255) NOT NULL,
    role roles NOT NULL DEFAULT 'user',
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_full_name ON users USING GIN (to_tsvector('indonesian', full_name));
CREATE INDEX idx_job_title ON users USING GIN (to_tsvector('indonesian', job_title));

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_update_trigger
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
