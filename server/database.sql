CREATE DATABASE contodo; --\c contodo

CREATE TABLE items(
  item_id SERIAL PRIMARY KEY,
  title VARCHAR(30),
  content VARCHAR(255)
); --\d

ALTER TABLE items ADD COLUMN color VARCHAR(7);

ALTER TABLE items ADD COLUMN pinned BOOLEAN DEFAULT FALSE;
ALTER TABLE items ADD COLUMN importance INT CHECK (importance BETWEEN 1 AND 3) DEFAULT 3;

CREATE TABLE lists(
  list_id SERIAL PRIMARY KEY,
  name VARCHAR(16) NOT NULL
);

ALTER TABLE items ADD COLUMN list_id INTEGER REFERENCES lists(list_id);

/*To create:
- A lists table with columns id serial, name varchar 16 not null, and user
- Update the items table to have a new column list_id
- Use JOIN and only show items if list_id is equal to the one passed in when I click the button
- For this the backend has to be edited, and the nav has to pass in information.
*/

INSERT INTO items (title, content, importance, pinned, color, list_id)
VALUES ('Test Todo for List 2', 'This is a test task under list 2.', 2, false, '#f0f0f0', 2);

ALTER TABLE items ADD COLUMN remind_at TIMESTAMP;

/*USERS FEATURE*/

CREATE TABLE users(
  user_id BIGSERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  password VARCHAR(200) NOT NULL,
  UNIQUE (email)
);
/*use \d users to see the info on table*/


/*after like 15 characters, make it so it has ... when displayed*/