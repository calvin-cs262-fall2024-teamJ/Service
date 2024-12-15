const pgp = require('pg-promise')();

const db = pgp({
  host: process.env.DB_SERVER,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
});

const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const router = express.Router();
router.use(express.json());

// Logging
console.log('DB_SERVER:', process.env.DB_SERVER);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_DATABASE:', process.env.DB_DATABASE);
console.log('DB_USER:', process.env.DB_USER);

// DungeonMaster functions
router.get('/dungeonmasters', readDMs);
router.get('/dungeonmasters/:id', readDM);
router.put('/dungeonmasters/:id', updateDM);
router.post('/dungeonmasters', createDM);

function readDMs(req, res, next) {
  db.any('SELECT * FROM DungeonMaster;')
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function readDM(req, res, next) {
  db.oneOrNone('SELECT * FROM DungeonMaster WHERE ID=${id};', req.params)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

function updateDM(req, res, next) {
  db.oneOrNone('UPDATE DungeonMaster SET nickname=${body.nickname}, loginid=${body.loginid}, password=${body.password} WHERE ID=${params.id} RETURNING ID;', req)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

function createDM(req, res, next) {
  db.one('INSERT INTO DungeonMaster(nickname, loginid, password) VALUES (${nickname}, ${loginid}, ${password}) RETURNING ID;', req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

// Map functions
router.get('/maps', readMaps);
router.get('/maps/image/:id', readMapImage);
router.post('/maps', createMap);
router.delete('/maps/:id', deleteMap);

function readMaps(req, res, next) {
  db.any('SELECT * FROM Map;')
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function readMapImage(req, res, next) {
  db.one('SELECT MapImage FROM Map WHERE ID=${id};', req.params)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function createMap(req, res, next) {
  db.one('INSERT INTO Map(DungeonMasterID, MapImage, MapName, supermapID) VALUES (${DungeonMasterID}, ${MapImage}, ${MapName}, ${supermapID}) RETURNING ID;', req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function deleteMap(req, res, next) {
  db.oneOrNone('DELETE FROM Map WHERE ID=${id} RETURNING ID;', req.params)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

// Note functions
router.get('/notes/:id', readNotes);
router.get('/notes/map/:id', readMapNotes);
router.get('/note/:id', readNote);
router.post('/notes', createNote);
router.put('/notes/:id', updateNote);
router.delete('/notes/:id', deleteNote);

function readNotes(req, res, next) {
  db.any('SELECT * FROM Note WHERE WorldMapID=${id};', req.params)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function readMapNotes(req, res, next) {
  db.any('SELECT Title, Content FROM Note WHERE WorldMapID=${id};', req.params)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function readNote(req, res, next) {
  db.one('SELECT ID, Content FROM Note WHERE ID=${id};', req.params)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function createNote(req, res, next) {
  db.one('INSERT INTO Note(WorldMapID, Title, Content) VALUES (${WorldMapID}, ${Title}, ${Content}) RETURNING ID;', req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function deleteNote(req, res, next) {
  db.oneOrNone('DELETE FROM Note WHERE ID=${id} RETURNING ID;', req.params)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

function updateNote(req, res, next) {
  db.oneOrNone('UPDATE Note SET Title=${body.Title}, Content=${body.Content} WHERE ID=${params.id} RETURNING ID;', req)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

// Pin functions
router.get('/pins/:id', readPins);
router.put('/pins/:id', updatePin);
router.post('/pins', createPin);
router.delete('/pins/:id', deletePin);
router.post('/pins/images', createPinImage);

function readPins(req, res, next) {
  db.any('SELECT Pin.ID, Pin.NoteID, Pin.x, Pin.y, Pin.iconID, Pin.color FROM Pin JOIN Note ON Pin.NoteID = Note.ID WHERE WorldMapID=${id};', req.params)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function updatePin(req, res, next) {
  db.oneOrNone('UPDATE Pin SET NoteID=${body.NoteID}, x=${body.x}, y=${body.y}, iconID=${body.iconID}, color=${body.color} WHERE ID=${params.id} RETURNING ID;', req)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

function createPin(req, res, next) {
  db.one('INSERT INTO Pin(NoteID, x, y, iconID, color) VALUES (${NoteID}, ${x}, ${y}, ${iconID}, ${color}) RETURNING ID;', req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function deletePin(req, res, next) {
  db.oneOrNone('DELETE FROM Pin WHERE ID=${id} RETURNING ID;', req.params)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

function createPinImage(req, res, next) {
  db.one('INSERT INTO PinImage(icon) VALUES (${icon}) RETURNING ID;', req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

// Common utility function
function returnDataOr404(res, data) {
  if (data == null) {
    res.sendStatus(404);
  } else {
    res.send(data);
  }
}

// Ensure this line is at the very bottom of the script
app.use(router);
app.listen(port, () => console.log(`Listening on port ${port}`));
