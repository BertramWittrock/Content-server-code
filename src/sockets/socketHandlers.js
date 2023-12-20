const { Server } = require('socket.io');
const { updateReactions } = require('../database/notes');
const { addComment } = require('../database/comments');
const { encrypt, decrypt } = require('../utils/encryption'); 

function createSocketServer(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('En bruger er forbundet - socket');

    // Handles "post reaction" event
    socket.on('postReaction', async (data) => {
      try {
        const { noteId, reactionType } = data;
        //validate reactionType
        const validReactions = ['reaction1', 'reaction2', 'reaction3', 'reaction4'];
        if (!validReactions.includes(reactionType)) {
          throw new Error('Ugyldig reaktionstype');
        }

        const updatedNote = await updateReactions(noteId, reactionType);
        io.emit('updateReactions', updatedNote);
      } catch (error) {
        console.error('Fejl under håndtering af postReaction:', error);
      }
    });
    // Handle 'postCommenct' event
    socket.on('postComment', async (data) => {
      console.log("modtaget kommentar")
      try {
        const { noteId, username, comment } = data;
        const encryptedComment = encrypt(comment);

        if (!noteId || !username || !comment) {
          throw new Error('Manglende data for kommentar');
        }

        const timestamp = new Date().toISOString();
        const result = await addComment(noteId, username, encryptedComment, timestamp);

        if (result.success) {
          const newComment = { noteId, username, comment: decrypt(encryptedComment), timestamp };
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
