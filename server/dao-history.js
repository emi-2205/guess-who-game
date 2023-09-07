'use strict';

/* Data Access Object (DAO) module for accessing films data */

const db = require('./db');


//! HISTORIES
exports.createHistory = (history) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO histories (date, difficulty, item, score, won, user) VALUES(?, ?, ?, ?, ?, ?)';
    db.run(sql, [history.date, history.difficulty, history.item, history.score, history.won, history.user], function (err) {
      if (err) {
        reject(err);
      }
      resolve(null);
    });
  })
};

exports.getUserHistory = (user) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM histories WHERE user = ? ORDER BY date DESC';
    db.all(sql, [user], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const history = rows.map(row => ({
          date: row.date,
          difficulty: row.difficulty,
          secretItem: row.item,
          score: row.score
        }));
        resolve(history);
      }
    })
  })
}