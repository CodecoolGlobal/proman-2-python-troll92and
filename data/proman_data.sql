--
-- PostgreSQL database Proman
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET default_tablespace = '';

SET default_with_oids = false;

---
--- drop tables
---

DROP TABLE IF EXISTS statuses CASCADE;
DROP TABLE IF EXISTS boards CASCADE;
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS users;

---
--- create tables
---

CREATE TABLE statuses (
    id       SERIAL PRIMARY KEY     NOT NULL,
    title    VARCHAR(200)           NOT NULL,
    owner    VARCHAR(200)           NOT NULL
);

CREATE TABLE boards (
    id          SERIAL PRIMARY KEY  NOT NULL,
    title       VARCHAR(200)        NOT NULL,
    owner       VARCHAR(200)        NOT NULL
);

CREATE TABLE cards (
    id          SERIAL PRIMARY KEY  NOT NULL,
    board_id    INTEGER             NOT NULL,
    status_id   INTEGER             NOT NULL,
    title       VARCHAR (200)       NOT NULL,
    card_order  INTEGER             NOT NULL,
    archived    BOOLEAn             NOT NULL
);

CREATE TABLE users(
    id          SERIAL PRIMARY KEY NOT NULL ,
    username    varchar (200)      NOT NULL ,
    salt        text               NOT NULL ,
    hash        text               NOT NULL ,
    email       text               NOT NULL
);

---
--- insert data
---

INSERT INTO statuses(title, owner) VALUES ('new','global');
INSERT INTO statuses(title, owner) VALUES ('in progress','global');
INSERT INTO statuses(title, owner) VALUES ('testing','global');
INSERT INTO statuses(title, owner) VALUES ('done','global');

INSERT INTO boards(title, owner) VALUES ('Tasks Groups', 'public');
INSERT INTO boards(title, owner) VALUES ('Board Tasks', 'public');
INSERT INTO boards(title, owner) VALUES ('Column Tasks', 'public');
INSERT INTO boards(title, owner) VALUES ('Card Tasks', 'public');
INSERT INTO boards(title, owner) VALUES ('Order Tasks', 'public');
INSERT INTO boards(title, owner) VALUES ('Login Related Tasks', 'public');
INSERT INTO boards(title, owner) VALUES ('Misc Task', 'public');

INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 4, 'Board Tasks', 1, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 4, 'Column Tasks', 2, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 4, 'Card Tasks', 3, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 3, 'Drag&Drop Tasks', 1, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 2, 'Login Related Tasks', 1, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'Misc Tasks', 1, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 2, 'Get Boss Fired', 1, True);

INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 4, 'Board List', 1, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 4, 'Create Public Boards', 2, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 4, 'Rename Board', 3, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 4, 'Delete Public Board', 4, false);

INSERT INTO cards VALUES (nextval('cards_id_seq'), 3, 4, 'Board Columns', 1, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 3, 4, 'Add Columns', 2, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 3, 4, 'Rename Columns', 3, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 3, 4, 'Delete Columns', 4, false);

INSERT INTO cards VALUES (nextval('cards_id_seq'), 4, 4, 'Add Columns', 1, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 4, 4, 'Rename Columns', 2, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 4, 4, 'Delete Columns', 3, false);

INSERT INTO cards VALUES (nextval('cards_id_seq'), 5, 1, 'Add Cards', 1, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 5, 1, 'Rename Cards', 2, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 5, 1, 'Delete Cards', 3, false);

INSERT INTO cards VALUES (nextval('cards_id_seq'), 6, 4, 'Dragstart event', 1, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 6, 4, 'Dragend event', 2, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 6, 4, 'Dragover event', 3, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 6, 4, 'Dragleave event', 4, false);

INSERT INTO cards VALUES (nextval('cards_id_seq'), 6, 4, 'Log In', 1, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 6, 4, 'Log Out', 2, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 6, 3, 'Register', 1, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 6, 3, 'Create Private Boards', 1, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 6, 3, 'Delete Private Boards', 2, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 6, 3, 'Rename Private Boards', 3, false);

INSERT INTO cards VALUES (nextval('cards_id_seq'), 7, 1, 'Manual Synchronization', 1, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 7, 1, 'Live Synchronization', 2, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 7, 2, 'Offline save', 1, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 7, 3, 'Archive', 1, false);

INSERT INTO users VALUES (nextval('users_id_seq'), 'bens','KxgBZAbMlf0peOOlDLDN6UlxzEWo01EGRZKFiJcfM/uNJK3T/w0Q3SrMeiBw','$2b$12$J3lG9PNH17iVOLS8CUXar.rwwUxzp3CG/yeS20uAayNPlRG6f7eJm','szabo.bence.x@gmail.com');


---
--- add constraints
---

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_board_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE;

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_status_id FOREIGN KEY (status_id) REFERENCES statuses(id) ON DELETE CASCADE;
