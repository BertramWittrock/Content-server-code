const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

async function connectToDatabase() {
  try {
    // Open connection to the SQLite database
    const db = await open({
      filename: './opslagstavle.db', 
      driver: sqlite3.Database
    });

    await db.exec(`
    CREATE TABLE IF NOT EXISTS sticky_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      timestamp TEXT,
      text TEXT,
      reaction1 INTEGER DEFAULT 0,
      reaction2 INTEGER DEFAULT 0,
      reaction3 INTEGER DEFAULT 0,
      reaction4 INTEGER DEFAULT 0
    )
    `);
    
    await db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      note_id INTEGER,
      username TEXT,
      comment TEXT,
      timestamp TEXT,
      FOREIGN KEY(note_id) REFERENCES sticky_notes(id)
    )
    `);

    // Returner databaseobjekt til yderligere brug
    return db;
  } catch (error) {
    console.error('Fejl ved tilslutning til databasen:', error.message);
    throw error; 
  }
}

module.exports = { connectToDatabase };