const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

async function connectToDatabase() {
  try {
    // Open connection to the SQLite database
    const db = await open({
      filename: './opslagstavle.db', 
      driver: sqlite3.Database
    });

    //return databaseobject to further use
    return db;
  } catch (error) {
    console.error('Fejl ved tilslutning til databasen:', error.message);
    throw error; 
  }
}

module.exports = { connectToDatabase };
