import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./resources/db/fishtank.sl3', sqlite3.OPEN_READWRITE, err => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the fishtank database.');
});

export default db;
