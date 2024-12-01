//small change

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
const port = process.env.PORT || 3000;
const router = express.Router();
router.use(express.json());

//dms
router.get('/', readHelloMessage);
router.get('/dungeonmasters', readDMs);
router.get('/dungeonmasters/:id', readDM);
router.put('/dungeonmasters/:id', updateDM);
router.post('/dungeonmasters', createDM);

// //maps
// router.get('/maps', readMaps);
// router.get('/maps/:id', readMap);
// router.put('/maps/:id', updateMap);
// router.post('/maps', createMap);
// router.delete('/maps/:id', deleteMap);

// //note
// router.get('/notes', readNotes);
// router.get('/notes/:id', readNote);
// router.put('/notes/:id', updateNote);
// router.post('/notes', createNote);
// router.delete('/notes/:id', deleteNote);

// //pin
// router.get('/pins', readPins);//may need to change
// router.get('/pins/:id', readPin);
// router.put('/pins/:id', updatePin);
// router.post('/pins', createPin);
// router.delete('/pins/:id', deletePin);

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

function readDMs(req, res, next) {
  db.many('SELECT * FROM DungeonMaster;')
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
