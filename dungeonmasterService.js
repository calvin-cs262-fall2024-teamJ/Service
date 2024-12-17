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

// Other routes...

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => console.log(`Listening on port ${port}`));
