/*** Importing modules ***/
const express = require('express');
const morgan = require('morgan');                                  // logging middleware
const cors = require('cors');

const { check, validationResult, } = require('express-validator'); // validation middleware

const userDao = require('./dao-users'); // module for accessing the users table in the DB
const itemDao = require('./dao-items'); // module for accessing the items table in the DB
const historyDao = require('./dao-history'); // module for accessing the histories table in the DB

/*** init express and set-up the middlewares ***/
const app = express();
app.use(morgan('dev'));
app.use(express.json());

/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));


/*** Passport ***/

/** Authentication-related imports **/
const passport = require('passport');                              // authentication middleware
const LocalStrategy = require('passport-local');                   // authentication strategy (username and password)

/** Set up authentication strategy to search in the DB a user with a matching password.
 * The user object will contain other information extracted by the method userDao.getUser (i.e., id, username, name).
 **/
passport.use(new LocalStrategy(async function verify(username, password, callback) {
  const user = await userDao.getUser(username, password)
  if (!user)
    return callback(null, false, 'Incorrect username or password');

  return callback(null, user); // NOTE: user info in the session (all fields returned by userDao.getUser, i.e, id, username, name)
}));

// Serializing in the session the user object given from LocalStrategy(verify).
passport.serializeUser(function (user, callback) { // this user is id + username + name 
  callback(null, user);
});

// Starting from the data in the session, we extract the current (logged-in) user.
passport.deserializeUser(function (user, callback) { // this user is id + email + name 
  // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
  // e.g.: return userDao.getUserById(id).then(user => callback(null, user)).catch(err => callback(err, null));

  return callback(null, user); // this will be available in req.user
});

/** Creating the session */
const session = require('express-session');

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));


/** Defining authentication verification middleware **/
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Not authorized' });
}

/*** Users APIs ***/

// POST /api/sessions 
// This route is used for performing login.
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json({ error: info });
    }
    // success, perform the login and extablish a login session
    req.login(user, (err) => {
      if (err)
        return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser() in LocalStratecy Verify Fn
      return res.json(req.user);
    });
  })(req, res, next);
});

// GET /api/sessions/current
// This route checks whether the user is logged in or not.
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Not authenticated' });
});

// DELETE /api/session/current
// This route is used for loggin out the current user.
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.status(200).json({});
  });
});


/*** ITEMS APIs ***/
app.get('/api/items/:difficulty',
  async (req, res) => {
    try {
      const result = await itemDao.listItems(req.params.difficulty)
      if (result.error)
        res.status(404).json(result);
      else
        res.json(result);
    } catch (err) {
      res.status(500).end();
    }
  }
);

let secretItem = "{}";

app.post('/api/item',
  async (req, res) => {
    try {
      const itemList = req.body.itemList;
      const randomIndex = Math.floor(Math.random() * itemList.length);
      const randomItem = itemList[randomIndex];
      secretItem = randomItem;
      res.status(200).json({ message: "set" });
    } catch (err) {
      res.status(500).end();
    }
  }
);

app.get('/api/item',
  async (req, res) => {
    try {
        res.status(200).json(secretItem);
    } catch (err) {
      res.status(500).end();
    }
  }
);

app.get('/api/item/:name',
  async (req, res) => {
    try {
      const name = req.params.name;
      if (name == secretItem.name) {
        res.status(200).json(true);
      } else {
        res.status(200).json(false);
      }
    } catch (err) {
      res.status(500).end();
    }
  }
);

app.get('/api/item/:property/:value',
  async (req, res) => {
    try {
      const property = req.params.property;
      const value = req.params.value;
      if (secretItem.properties[property] === value) {
        res.status(200).json(true);
      } else {
        res.status(200).json(false);
      }
    } catch (err) {
      res.status(500).end();
    }
  }
);

/*** HISTORY API's ***/
app.post('/api/history/store',
  isLoggedIn,
  async (req, res) => {
    const history = {
      date: req.body.matchResult['date'],
      difficulty: req.body.matchResult['difficulty'], // A different method is required if also time is present. For instance: (req.body.watchDate || '').split('T')[0]
      item: secretItem.name,
      score: req.body.matchResult['score'],
      won: req.body.matchResult['won'],
      user: req.user.id  // user is overwritten with the id of the user that is doing the request and it is logged in
    };

    try {
      const result = await historyDao.createHistory(history); // NOTE: createFilm returns the new created object
      res.status(200).json({ message: "created" });
    } catch (err) {
      res.status(504).json({ error: `Database error during the creation of new history: ${err}` });
    }
  }
);

app.get('/api/history/get',
  isLoggedIn,
  async (req, res) => {
    try {
      const result = await historyDao.getUserHistory(req.user.id);
      if (result.error)
        res.status(404).json(result);
      else
        res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
);

// app.post('/api/register', (req, res) => {

//   const email = req.body.email;
//   const name = req.body.name;
//   const password = req.body.password;

//   result = userDao.register(email, name, password);
//   if (result) {
//     res.status(200).json({message: "FUNZIA"});
//   } else {
//     res.status(400).json({error: "NON FUNZIA"});
//   }
// });

// Activating the server
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));
