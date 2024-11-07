
--TESTING
INSERT INTO DungeonMaster VALUES (1,'THE LICH',1,'hello world');
INSERT INTO DungeonMaster VALUES (2,'NERUL',2,'this password');

--INSERT INTO Map(ID, DungeonMasterID, MapImage, MapName,supermapID) VALUES (1,1,'ok','Rivendel',NULL);
INSERT INTO Map VALUES (1,1,'ok','Rivendel',NULL);

INSERT INTO Note VALUES (1,1,'silk song will come out soon, I can feel it');

INSERT INTO Pin VALUES (1,1,3,4,'blue','pentagon');

SELECT * FROM DungeonMaster;
SELECT * FROM Map;
SELECT * FROM Note;
SELECT * FROM Pin;