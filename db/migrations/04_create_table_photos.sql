-- psql -d react_node_todo -a -f db/migrations/04_create_table_photos.sql

DROP TABLE IF EXISTS photos;
CREATE TABLE photos(
  id SERIAL,

  user_id INTEGER NOT NULL,
  filename VARCHAR(75) DEFAULT 'default',
  extension VARCHAR(5) DEFAULT 'jpg',

  active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
