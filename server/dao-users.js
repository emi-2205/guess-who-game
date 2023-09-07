'use strict';

/* Data Access Object (DAO) module for accessing users data */

const db = require('./db');
const crypto = require('crypto');

// This function returns user's information given its id.
exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE id=?';
    db.get(sql, [id], (err, row) => {
      if (err)
        reject(err);
      else if (row === undefined)
        resolve({ error: 'User not found.' });
      else {
        // By default, the local strategy looks for "username": 
        // for simplicity, instead of using "email", we create an object with that property.
        const user = { id: row.id, username: row.email, name: row.name }
        resolve(user);
      }
    });
  });
};

// This function is used at log-in time to verify username and password.
exports.getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE email=?';
    db.get(sql, [email], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(false);
      }
      else {
        const user = { id: row.id, username: row.email, name: row.name };
        // Check the hashes with an async call, this operation may be CPU-intensive (and we don't want to block the server)
        crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) { // WARN: it is 64 and not 32 (as in the week example) in the DB
          if (err) reject(err);
          if (!crypto.timingSafeEqual(Buffer.from(row.hash, 'hex'), hashedPassword)) // WARN: it is hash and not password (as in the week example) in the DB
            resolve(false);
          else
            resolve(user);
        });
      }
    });
  });
};

function hashPassword(pass, salt) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(pass, salt, 32, (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password:", err);
        reject(err);
      } else {
        console.log("Hashed password:", hashedPassword);
        resolve(hashedPassword);
      }
    });
  });
}

exports.register = (email, name,  pass) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO users (email, name, hash, salt) VALUES (?, ?, ?, ?)';
    const salt = crypto.randomBytes(16);
    let password;
    hashPassword(pass, salt)
      .then((hashedPassword) => {
        // Use the hashed password here
        password = hashedPassword
        console.log('Hashed password2:', hashedPassword);
        db.run(sql, [email, name, password, salt], (err, row) => {
          if (err) {
            reject(err);
          }
          else if (row === undefined) {
            resolve(false);
          } else {
            resolve(true);
          }
        });
      })
      .catch((err) => {
        // Handle error here
        console.error('Error hashing password:', err);
      });
  })
};
