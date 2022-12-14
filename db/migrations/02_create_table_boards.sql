-- psql -d db_name -a -f db/migrations/02_create_table_boards.sql

CREATE TABLE boards(
  id SERIAL,

  name VARCHAR(255) NOT NULL,
  icon VARCHAR(50) NOT NULL,
  colour VARCHAR(15) NOT NULL,
  user_id INTEGER NOT NULL,

  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  active BOOLEAN DEFAULT TRUE,

  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);