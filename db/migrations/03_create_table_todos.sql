-- psql -d react_node_todo -a -f db/migrations/02_create_table_todos.sql

CREATE TABLE todos(
  id SERIAL,

  content VARCHAR(250) NOT NULL,
  done BOOLEAN DEFAULT FALSE,
  board_id INTEGER NOT NULL,

  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  active BOOLEAN DEFAULT TRUE,

  PRIMARY KEY (id),
  FOREIGN KEY (board_id) REFERENCES boards(id)
);
