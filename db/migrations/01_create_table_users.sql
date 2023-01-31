-- psql -d react_node_todo -a -f db/migrations/01_create_table_users.sql

CREATE TABLE users(
  id SERIAL,

  email VARCHAR(75) NOT NULL UNIQUE,
  password VARCHAR(75) NOT NULL,
  first_name VARCHAR(75) NOT NULL,
  last_name VARCHAR(75) NOT NULL,
  dark_mode BOOLEAN NOT NULL DEFAULT FALSE,

  active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id)
);
