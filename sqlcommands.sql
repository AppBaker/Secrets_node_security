
-- Creatr database
CREATE DATABASE secretsDB OWNER = postgres ENCODING = 'UTF8' CONNECTION LIMIT = -1 IS_TEMPLATE = False;
-- Create users table
CREATE TABLE usersDB (
	id SERIAL PRIMARY KEY,
	email VARCHAR(100),
	password VARCHAR(100)
);


