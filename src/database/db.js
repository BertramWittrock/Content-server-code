const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

async function connectToDatabase() {
  try {
    // Åbn forbindelsen til SQLite-databasen
    const db = await open({
      filename: './opslagstavle.db', // Angiv stien til din databasefil
      driver: sqlite3.Database
    });

    // console.log('Database er forbundet!');

    // Returner databaseobjektet til yderligere brug
    return db;
  } catch (error) {
    // Log fejl, hvis forbindelsen fejler
    console.error('Fejl ved tilslutning til databasen:', error.message);
    throw error; // Kast fejlen videre for yderligere håndtering
  }
}

module.exports = { connectToDatabase };
