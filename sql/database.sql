-- Drop existing tables if they exist
DROP TABLE IF EXISTS Pin;
DROP TABLE IF EXISTS Note;
DROP TABLE IF EXISTS Map;
DROP TABLE IF EXISTS DungeonMaster;

-- Create DungeonMaster table
CREATE TABLE DungeonMaster (
    ID SERIAL PRIMARY KEY,
    nickname VARCHAR(20) NOT NULL,
    loginid INTEGER NOT NULL,
    password VARCHAR(30) NOT NULL
);

-- Create Note table
CREATE TABLE Note (
    ID SERIAL PRIMARY KEY,
    WorldMapID INTEGER,
    Title VARCHAR(50),
    Content TEXT
);

-- Create Map table
CREATE TABLE Map (
    ID SERIAL PRIMARY KEY,
    DungeonMasterID INTEGER,
    MapImage BYTEA,
    MapName VARCHAR(50),
    supermapID INTEGER
);

-- Create Pin table
CREATE TABLE Pin (
    ID SERIAL PRIMARY KEY,
    NoteID INTEGER,
    x INTEGER,
    y INTEGER,
    iconID INTEGER,
    color VARCHAR(20)
);

-- Grant SELECT on tables to public
GRANT SELECT ON ALL TABLES IN SCHEMA public TO PUBLIC;

-- Insert example data
INSERT INTO DungeonMaster (nickname, loginid, password) VALUES ('dm1', 1, 'password1');
INSERT INTO DungeonMaster (nickname, loginid, password) VALUES ('dm2', 2, 'password2');

INSERT INTO Map (DungeonMasterID, MapImage, MapName) VALUES (1, decode('42696e6172792044617461','hex'), 'Rivendel');
INSERT INTO Map (DungeonMasterID, MapImage, MapName) VALUES (2, decode('42696e6172792044617461','hex'), 'Mordor');

INSERT INTO Note (WorldMapID, Title, Content) VALUES (1, 'Note1', 'Content for Note 1');
INSERT INTO Note (WorldMapID, Title, Content) VALUES (2, 'Note2', 'Content for Note 2');

INSERT INTO Pin (NoteID, x, y, iconID, color) VALUES (1, 3, 4, 1, 'blue');
INSERT INTO Pin (NoteID, x, y, iconID, color) VALUES (2, 6, 7, 2, 'red');
