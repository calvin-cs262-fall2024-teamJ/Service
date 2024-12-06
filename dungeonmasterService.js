

// Set up the database connection.

const pgp = require('pg-promise')();

const db = pgp({
  host: process.env.DB_SERVER,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {rejectUnauthorized: false},
});

// Configure the server and its routes.

const express = require('express');

const app = express();
const port = process.env.PORT || 8080;
const router = express.Router();
router.use(express.json());

//logging
console.log('DB_SERVER:', process.env.DB_SERVER);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_DATABASE:', process.env.DB_DATABASE);
console.log('DB_USER:', process.env.DB_USER);

//dms
router.get('/', readHelloMessage);
router.get('/dungeonmasters', readDMs);
router.get('/dungeonmasters/:id', readDM);
router.put('/dungeonmasters/:id', updateDM);
router.post('/dungeonmasters', createDM);

//maps
router.get('/maps', readMaps);
router.get('/maps/image/:id', readMapImage)
// router.put('/maps/:id', updateMap);
router.post('/maps', createMap);
router.delete('/maps/:id', deleteMap);

// //note
router.get('/notes', readNotes);
router.get('/notes/:id', readNote);
router.put('/notes/:id', updateNote);
router.post('/notes', createNote);
router.delete('/notes/:id', deleteNote);
router.get('/notes/map/:id', readMapNotes)

// //pin
router.get('/pins/:id', readPins);//may need to change
// router.get('/pins/:id', readPin);
router.put('/pins/:id', updatePin);
router.post('/pins', createPin);
router.delete('/pins/:id', deletePin);
//pin image
router.post('/pins/images', createPinImage);

app.use(router);
app.listen(port, () => console.log(`Listening on port ${port}`));

// Implement the CRUD operations.

function returnDataOr404(res, data) {
  if (data == null) {
    res.sendStatus(404);
  } else {
    res.send(data);
  }
}

function readHelloMessage(req, res) {
  res.send('Hello, JourneySmith WebService!');
}

//dungeon master functions
function readDMs(req, res, next) {
  db.any('SELECT * FROM DungeonMaster;')//maybe db.many
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function readDM(req, res, next) {
  db.oneOrNone('SELECT * FROM DungeonMaster WHERE id=${id};', req.params)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

function updateDM(req, res, next) {
  db.oneOrNone('UPDATE DungeonMaster SET nickname=${body.nickname}, loginID=${body.loginID}, password=${body.password} WHERE id=${params.id} RETURNING id;', req)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

function createDM(req, res, next) {
  db.one('INSERT INTO DungeonMaster(nickname, loginID, password) VALUES (${nickname}, ${loginID}, ${password}) RETURNING id;', req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

// function deleteDM(req, res, next) {
//   db.oneOrNone('DELETE FROM DungeonMaster WHERE id=${id} RETURNING id;', req.params)
//     .then((data) => {
//       returnDataOr404(res, data);
//     })
//     .catch((err) => {
//       next(err);
//     });
// }

//Map functions
function readMaps(req, res, next){
  db.any('SELECT * FROM Map;')
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function readMapImage(req, res, next){
  db.one('SELECT MapImage FROM Map WHERE DungeonMasterID=${id};', req.params)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function createMap(req, res, next) {
  db.one('INSERT INTO Map(DungeonMasterID, MapImage, MapName) VALUES (${DungeonMaster}, ${MapImage}, ${MapName}) RETURNING id;', req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function deleteMap(req, res, next) {
  db.oneOrNone('DELETE FROM Map WHERE id=${id} RETURNING id;', req.params)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

//Note functions

//reads all SQL Note data from given dungeonMaster
function readNotes(req, res, next){
  console.log('Accessing /notes');
  db.any('SELECT Note.ID, Note.WorldMapID, Note.Title, Note.Content FROM Note, Map WHERE Map.ID=1 AND Map.ID=Note.WorldMapID;', req.params)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

//reads Notes content from the same given map id
function readMapNotes(req, res, next){
  db.any('SELECT Title, Content FROM Note WHERE WorldMapID=${id};', req.params)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

//reads one specific note based off given note id
function readNote(req, res, next){
  console.log('Accessing /note/:id');
  db.one('SELECT ID, Content FROM Note WHERE id=${id};',req.params)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function createNote(req, res, next) {
  console.log('Accessing /notes creat Note');
  db.one('INSERT INTO Note(WorldMapID, Title, Content) VALUES (${WorldMapID}, ${MapImage}, ${MapName}) RETURNING id;', req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function deleteNote(req, res, next) {
  db.oneOrNone('DELETE FROM Note WHERE id=${id} RETURNING id;', req.params)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

function updateNote(req, res, next) {
  db.oneOrNone('UPDATE Note SET Title=${body.Title}, Content=${body.Content} WHERE id=${params.id} RETURNING id;', req)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

//Pin function
function readPins(req, res, next) {
  db.any('SELECT Pin.ID, Pin.NoteID, Pin.x, Pin.y, Pin.iconID FROM Pin, Note WHERE WorldMapID=${id} AND NoteID=Note.ID;', req)//maybe db.many
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function updatePin(req, res, next) {
  db.oneOrNone('UPDATE Pin SET NoteID=${body.NoteID}, x=${body.x}, y=${body.y}, iconID=${body.iconID} WHERE id=${params.id} RETURNING id;', req)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

function createPin(req, res, next) {
  db.one('INSERT INTO Pin(NoteID, x, y, iconID) VALUES (${NoteID}, ${x}, ${y}, ${iconID}) RETURNING id;', req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function deletePin(req, res, next) {
  db.oneOrNone('DELETE FROM Pin WHERE id=${id} RETURNING id;', req.params)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

function createPinImage(req, res, next) {
  db.one('INSERT INTO PinImage(icon) VALUES (${icon}) RETURNING id;', req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

app.get('/notes', async (req, res, next) => {
  try {
    console.log('Fetching notes...'); // Debug log
    const notes = await db.any('SELECT * FROM Note WHERE WorldMapID=${id};', req.params);
    console.log('Notes fetched:', notes); // Debug log
    res.send(notes);
  } catch (err) {
    console.error('Error fetching notes:', err); // Debug log
    next(err);
  }
});
