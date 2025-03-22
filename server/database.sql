CREATE DATABASE items;

CREATE TABLE items(
  item_id SERIAL PRIMARY KEY,
  title VARCHAR(30),
  content VARCHAR(255)
);