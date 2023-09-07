'use strict';

/* Data Access Object (DAO) module for accessing items data */

const db = require('./db');

exports.listItems = (difficulty) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM items ORDER BY RANDOM() LIMIT ${difficulty}`;
    db.all(sql, (err, rows) => {
      if (err) { reject(err); }

      const items = rows.map((e) => {
        const item = Object.assign({}, e);
        return item;
      });
      resolve(items);
    });
  });
};











// This function retrieves the whole list of films from the database.
exports.listFilms = (user, filter) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM films WHERE user=?';
    db.all(sql, [user], (err, rows) => {
      if (err) { reject(err); }

      const films = rows.map((e) => {
        // WARNING: the database returns only lowercase fields. So, to be compliant with the client-side, we convert "watchdate" to the camelCase version ("watchDate").
        const film = Object.assign({}, e, { watchDate: e.watchdate });  // adding camelcase "watchDate"
        delete film.watchdate;  // removing lowercase "watchdate"
        if (film.rating == null)  // casting NULL value to 0
          film.rating = 0;
        return film;
      });

      // WARNING: if implemented as if(filters[filter]) returns true also for filter = 'constructor' but then .filterFunction does not exists
      if (filters.hasOwnProperty(filter))
        resolve(films.filter(filters[filter].filterFunction));
      else resolve(films);
    });
  });
};

// This function retrieves a film given its id and the associated user id.
exports.getFilm = (user, id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM films WHERE id=? and user=?';
    db.get(sql, [id, user], (err, row) => {
      if (err) {
        reject(err);
      }
      if (row == undefined) {
        resolve({ error: 'Film not found.' });
      } else {
        // WARN: database is case insensitive. Converting "watchDate" to camel case format
        const film = Object.assign({}, row, { watchDate: row.watchdate });  // adding camelcase "watchDate"
        delete film.watchdate;  // removing lowercase "watchdate"
        if (film.rating == null)  // casting NULL value to 0
          film.rating = 0;
        resolve(film);
      }
    });
  });
};


/**
 * This function adds a new film in the database.
 * The film id is added automatically by the DB, and it is returned as this.lastID.
 */
exports.createFilm = (film) => {
  // our database is configured to have a NULL value for films without rating
  if (film.rating <= 0)
    film.rating = null;
  if (film.watchDate == "")
    film.watchDate = null;

  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO films (title, favorite, watchDate, rating, user) VALUES(?, ?, ?, ?, ?)';
    db.run(sql, [film.title, film.favorite, film.watchDate, film.rating, film.user], function (err) {
      if (err) {
        reject(err);
      }
      // Returning the newly created object with the DB additional properties to the client.
      resolve(exports.getFilm(film.user, this.lastID));
    });
  });
};

// This function updates an existing film given its id and the new properties.
exports.updateFilm = (user, id, film) => {
  // our database is configured to have a NULL value for films without rating
  if (film.rating <= 0)
    film.rating = null;
  if (film.watchDate == "")
    film.watchDate = null;

  return new Promise((resolve, reject) => {
    const sql = 'UPDATE films SET title=?, favorite=?, watchDate=?, rating=? WHERE id=? and user=?';
    db.run(sql, [film.title, film.favorite, film.watchDate, film.rating, id, user], function (err) {
      if (err) {
        reject(err);
      }
      if (this.changes !== 1) {
        resolve({ error: 'No film was updated.' });
      } else {
        resolve(exports.getFilm(user, id));
      }
    });
  });
};

// This function deletes an existing film given its id.
exports.deleteFilm = (user, id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM films WHERE id=? and user=?';
    db.run(sql, [id, user], function (err) {
      if (err) {
        reject(err);
      }
      if (this.changes !== 1)
        resolve({ error: 'No film deleted.' });
      else
        resolve(null);
    });
  });
}
