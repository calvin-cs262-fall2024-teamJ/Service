
--DROP TABLE IF EXISTS NULL;
DROP TABLE IF EXISTS Pin;
DROP TABLE IF EXISTS Note;
DROP TABLE IF EXISTS Map;
DROP TABLE IF EXISTS DungeonMaster;

CREATE TABLE DungeonMaster(--main user
    ID integer Primary Key,
    nickname char(50) NOT NULL,
    loginID integer NOT NULL,
    password char(50) NOT NULL -- hopefuly will be encrypted
);

CREATE TABLE Map(
    ID integer Primary Key,
    DungeonMasterID integer REFERENCES DungeonMaster(ID) NOT NULL,
    MapImage char(20),--MAY NEED to be changed to hold file
    MapName char(20) NOT NULL,
    supermapID integer REFERENCES Map(ID) -- should be null for first map
);

CREATE TABLE Note(
    ID integer Primary Key,
    WorldMapID integer REFERENCES Map(ID),
    Content text
);

CREATE TABLE Pin(
    ID integer Primary Key,
    NoteID integer REFERENCES Note(ID),--this needs to change probably switched
    x integer NOT NULL,
    y integer NOT NULL,
    color char(20),
    icon char(20) -- also needs to change for image
);

GRANT SELECT ON DungeonMaster TO PUBLIC;
GRANT SELECT ON Map TO PUBLIC;
GRANT SELECT ON Note TO PUBLIC;
GRANT SELECT ON Pin TO PUBLIC;


-- --TESTING
-- INSERT INTO DungeonMaster VALUES (1,'THE LICH',1,'hello world');
-- INSERT INTO DungeonMaster VALUES (2,'NERUL',2,'this password');

-- --INSERT INTO Map(ID, DungeonMasterID, MapImage, MapName,supermapID) VALUES (1,1,'ok','Rivendel',NULL);
-- INSERT INTO Map VALUES (1,1,'ok','Rivendel',NULL);

-- INSERT INTO Note VALUES (1,1,'silk song will come out soon, I can feel it');

-- INSERT INTO Pin VALUES (1,1,3,4,'blue','pentagon');

-- SELECT * FROM DungeonMaster;
-- SELECT * FROM Note;
-- SELECT * FROM Pin;