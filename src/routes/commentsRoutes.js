const express = require('express');
const router = express.Router();
const db = require('../database/db').connectToDatabase; // Antager at du har en funktion til at forbinde til databasen i db.js
const { encrypt, decrypt } = require('../utils/encryption'); // Antager, at du har separeret krypteringslogikken til en fil 'crypto.js'

// POST Endpoint til at oprette en kommentar
router.post('/', async (req, res) => {
  const { noteId, username, comment } = req.body;
  const encryptedComment = encrypt(comment);
  const timestamp = new Date().toISOString();
  const database = await db();
  
  try {
    await database.run('INSERT INTO comments (note_id, username, comment, timestamp) VALUES (?, ?, ?, ?)', [noteId, username, encryptedComment, timestamp]);
    res.status(201).send({ message: 'Kommentar oprettet!' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET Endpoint til at hente kommentarer for en sticky note
router.get('/:noteId', async (req, res) => {
  const noteId = req.params.noteId;
  const database = await db();
  
  try {
    const comments = await database.all('SELECT * FROM comments WHERE note_id = ?', [noteId]);
    const decryptedComments = comments.map(comment => ({
      ...comment,
      comment: decrypt(comment.comment)
    }));
    res.status(200).send(decryptedComments);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
