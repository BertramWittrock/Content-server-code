// Importér nødvendige moduler eller biblioteker
const { Server } = require('socket.io');
const db = require('../database/db'); // Antager, at du har en separat db modul
const encrypt = require('../utils/encryption').encrypt; // Tilpasset efter din struktur
const secretKey = process.env.SECRET_KEY

// Funktion til at initialisere og konfigurere Socket.IO på serveren
function createSocketServer(server) {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('En bruger er forbundet');

    // Håndter 'postReaction' event
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
      } catch (error) {
        console.error('Fejl under håndtering af postReaction:', error);
      }
    });

    // Håndter 'postComment' event
    socket.on('postComment', async (data) => {
      try {
        const { noteId, username, comment } = data;
        const encryptedComment = encrypt(comment, secretKey);

        if (!noteId || !username || !comment) {
          throw new Error('Manglende data for kommentar');
        }

        const timestamp = new Date().toISOString();
        const result = await db.run('INSERT INTO comments (note_id, username, comment, timestamp) VALUES (?, ?, ?, ?)', [noteId, username, encryptedComment, timestamp]);

        if (result && result.lastID) {
          const newComment = { id: result.lastID, noteId, username, comment: encryptedComment, timestamp };
          io.emit('newComment', newComment);
        }
      } catch (error) {
        console.error('Fejl under oprettelse af kommentar:', error.message);
      }
    });

    socket.on('disconnect', () => {
      console.log('En bruger er afbrudt');
    });
  });
}

module.exports = { createSocketServer };
