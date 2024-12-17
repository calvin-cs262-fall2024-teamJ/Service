const cors = require('cors');  // Make sure cors is imported here
const pgp = require('pg-promise')();
const db = pgp({
  host: process.env.DB_SERVER,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
});

db.connect()
  .then(obj => {
    obj.done(); // success, release connection
    console.log('Database connection successful');
  })
  .catch(error => {
    console.error('ERROR connecting to database:', error.message || error);
  });

const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const router = express.Router();

app.use(cors({
  origin: 'http://localhost:8081',  // Ensure this matches your client URL
}));
app.use(express.json());
app.use(router); // Make sure to use the router after applying CORS and express.json()

// Root route
router.get('/', (req, res) => {
  res.send('Hello, JourneySmith WebService!');
});

// Login endpoint
router.post('/login', (req, res, next) => {
  console.log('Login request received:', req.body);
  const { loginid, password } = req.body;

  db.oneOrNone('SELECT * FROM DungeonMaster WHERE loginid = $1 AND password = $2', [loginid, password])
    .then(user => {
      if (user) {
        console.log('Login successful:', user);
        res.json({ success: true, message: 'Login successful', user });
      } else {
        console.log('Invalid email or password');
        res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    })
    .catch(err => {
      console.error('Error during login:', err);
      next(err);
    });
});

// Create account endpoint
router.post('/create-account', (req, res, next) => {
  console.log('Create account request received:', req.body);
  const { nickname, loginid, password } = req.body;

  console.log('Inserting values:', nickname, loginid, password);

  if (!nickname || !loginid || !password) {
    console.error('Validation failed: Missing required fields');
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  // Check if loginid already exists
  db.oneOrNone('SELECT * FROM DungeonMaster WHERE loginid = $1', [loginid])
    .then(user => {
      if (user) {
        console.log('Email already in use');
        res.status(409).json({ success: false, message: 'Email already in use' });
      } else {
        return db.none('INSERT INTO DungeonMaster(nickname, loginid, password) VALUES($1, $2, $3)', [nickname, loginid, password]);
      }
    })
    .then(() => {
      console.log('Account created successfully');
      res.json({ success: true, message: 'Account created successfully' });
    })
    .catch(err => {
      console.error('Error during account creation:', err);
      res.status(500).json({ success: false, message: 'Error during account creation', error: err.message });
    });
});

//dms
router.get('/', readHelloMessage);
router.get('/dungeonmasters', readDMs);
router.get('/dungeonmasters/:id', readDM);
router.put('/dungeonmasters/:id', updateDM);
router.post('/dungeonmasters', createDM);

//maps
router.get('/maps', readMaps);
router.get('/maps/image/:id', readMapImage);
router.post('/maps', createMap);
router.delete('/maps/:id', deleteMap);

//notes
router.get('/notes', readNotes);
router.get('/notes/:id', readNote);
router.put('/notes/:id', updateNote);
router.post('/notes', createNote);
router.delete('/notes/:id', deleteNote);
router.get('/notes/map/:id', readMapNotes);

//pins
router.get('/pins/:id', readPins);
router.put('/pins/:id', updatePin);
router.post('/pins', createPin);
router.delete('/pins/:id', deletePin);
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
  db.any('SELECT * FROM DungeonMaster;')
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
  db.oneOrNone('UPDATE DungeonMaster SET nickname=${body.nickname}, loginid=${body.loginid}, password=${body.password} WHERE id=${params.id} RETURNING id;', req)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

function createDM(req, res, next) {
  db.one('INSERT INTO DungeonMaster(nickname, loginid, password) VALUES (${nickname}, ${loginid}, ${password}) RETURNING id;', req.body)
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
  db.one('INSERT INTO Map(DungeonMasterID, MapImage, MapName) VALUES (${DungeonMasterID}, ${MapImage}, ${MapName}) RETURNING id;', req.body)
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
  db.any('SELECT * FROM Note WHERE WorldMapID=${id};', req.params)
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
  db.one('SELECT ID, Content FROM Note WHERE id=${id};', req.params)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function createNote(req, res, next) {
  console.log('Accessing /notes create Note');
  db.one('INSERT INTO Note(WorldMapID, Title, Content) VALUES (${WorldMapID}, ${Title}, ${Content}) RETURNING id;', req.body)
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
  db.any('SELECT Pin.ID, Pin.NoteID, Pin.x, Pin.y, Pin.iconID FROM Pin, Note WHERE WorldMapID=${id} AND NoteID=Note.ID;', req)
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => console.log(`Listening on port ${port}`));
