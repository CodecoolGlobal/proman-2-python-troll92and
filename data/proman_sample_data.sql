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

INSERT INTO boards(title, owner) VALUES ('Board 1', 'public');
INSERT INTO boards(title, owner) VALUES ('Board 2', 'public');

INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'new card 1', 1, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'new card 2', 2, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 2, 'in progress card', 1, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 3, 'planning', 1, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 4, 'done card 1', 1, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 4, 'done card 1', 2, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 1, 'new card 1', 1, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 1, 'new card 2', 2, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 2, 'in progress card', 1, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 3, 'planning', 1, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 4, 'done card 1', 1, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 4, 'done card 1', 2, false);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'archive card 1', 1, True);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'archive card 2', 2, True);


---
--- add constraints
---

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_board_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE;

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_status_id FOREIGN KEY (status_id) REFERENCES statuses(id) ON DELETE CASCADE;
