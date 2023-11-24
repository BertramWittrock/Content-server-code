const express = require('express');
const sqlite3 = require('sqlite3');
const http = require('http');
const { Server } = require('socket.io');
const { open } = require('sqlite');
const { generateNoteHTML } = require('./helpers'); // Importer funktionen

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json()); // For at parse JSON requests
app.use(express.static('public')); // For at servere statiske filer fra public-mappen


const port = 3000;

// Opret forbindelse til SQLite database
open({
  filename: './opslagstavle.db',
  driver: sqlite3.Database
}).then(async (database) => {
  const db = database;
  console.log('Database forbundet!');

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

  // POST Endpoint til at Oprette en Sticky Note
  app.post('/sticky-notes', async (req, res) => {
    const { username, text } = req.body;
    const timestamp = new Date().toISOString();
    try {
      await db.run('INSERT INTO sticky_notes (username, timestamp, text) VALUES (?, ?, ?)', [username, timestamp, text]);
      res.status(201).send({ message: 'Sticky note oprettet!' });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

  // GET Endpoint til at Hente Sticky Notes
  app.get('/sticky-notes', async (req, res) => {
    try {
      const notes = await db.all('SELECT * FROM sticky_notes');
      const notesHTML = notes.map(generateNoteHTML).join('');
      res.status(200).send(notesHTML);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

  // POST Endpoint til at oprette en kommentar
app.post('/comments', async (req, res) => {
  const { noteId, username, comment } = req.body;
  const timestamp = new Date().toISOString();
  try {
    await db.run('INSERT INTO comments (note_id, username, comment, timestamp) VALUES (?, ?, ?, ?)', [noteId, username, comment, timestamp]);
    res.status(201).send({ message: 'Kommentar oprettet!' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET Endpoint til at hente kommentarer for en sticky note
app.get('/comments/:noteId', async (req, res) => {
  const noteId = req.params.noteId;
  try {
    const comments = await db.all('SELECT * FROM comments WHERE note_id = ?', [noteId]);
    res.status(200).send(comments);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

  // Socket.IO-kommunikation
  io.on('connection', (socket) => {
    console.log('En bruger er forbundet');

    socket.on('postReaction', async (data) => {
        try {
          const { noteId, reactionType } = data;
    
          // Valider reactionType
          const validReactions = ['reaction1', 'reaction2', 'reaction3', 'reaction4'];
          if (!validReactions.includes(reactionType)) {
            throw new Error('Ugyldig reaktionstype');
          }
    
          await db.run(`UPDATE sticky_notes SET ${reactionType} = ${reactionType} + 1 WHERE id = ?`, [noteId]);
          const updatedNote = await db.get('SELECT * FROM sticky_notes WHERE id = ?', [noteId]);
          io.emit('updateReactions', updatedNote);
        //   console.log("Reaktion opdateret")
        //   console.log("Modtaget data:", data);

        } catch (error) {
        //   console.log('Fejl under opdatering af reaktion:', error.message);
        }
      });
    
    socket.on('postComment', async (data) => {
      try {
        // Udpak data fra den modtagne besked
        const { noteId, username, comment } = data;
  
        // Valider data (her kunne du tilføje yderligere validering efter behov)
        if (!noteId || !username || !comment) {
          throw new Error('Manglende data for kommentar');
        }
  
        const timestamp = new Date().toISOString();
  
        // Indsæt kommentar i databasen
        const result = await db.run('INSERT INTO comments (note_id, username, comment, timestamp) VALUES (?, ?, ?, ?)', [noteId, username, comment, timestamp]);
  
        // Hvis indsættelse lykkes, send en opdatering til alle klienter
        if (result && result.lastID) {
          const newComment = { id: result.lastID, noteId, username, comment, timestamp };
          
          // Udsend opdateringen
          io.emit('newComment', newComment);
        }
      } catch (error) {
        console.error('Fejl under oprettelse af kommentar:', error.message);
        // Du kan også vælge at sende en fejlbesked tilbage til klienten, hvis nødvendigt
      }
    });

    
      
  });

  // Start serveren efter databaseforbindelsen er etableret
  server.listen(port, () => {
    console.log(`Server kører på http://localhost:${port}`);
  });

}).catch(error => {
  console.error('Fejl ved tilslutning til databasen:', error.message);
});
