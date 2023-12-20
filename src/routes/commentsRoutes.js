const express = require('express');
const router = express.Router();
const { getComments, addComment } = require('../database/comments');
const { encrypt, decrypt } = require('../utils/encryption');


// POST Endpoint to create a comment.
router.post('/', async (req, res) => {
  const { noteId, username, comment } = req.body;
  const encryptedComment = encrypt(comment);
  const timestamp = new Date().toISOString();
  
  try {
    const result = await addComment(noteId, username, encryptedComment, timestamp);
    if (result.success) {
      res.status(201).send({ message: 'Kommentar oprettet!' });
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET Endpoint to get comments from a stickynote
router.get('/:noteId', async (req, res) => {
  const noteId = req.params.noteId;
  
  try {
    const comments = await getComments(noteId);
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