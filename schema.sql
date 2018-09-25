CREATE TABLE IF NOT EXISTS booklist (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(255),
  description VARCHAR(8000),
  image_url VARCHAR(8000)
)