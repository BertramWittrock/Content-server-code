const express = require('express');
const router = express.Router();
const notesController = require('../database/notes');

// POST Endpoint til at oprette en Sticky Note
router.post('/', async (req, res) => {
  try {
    const { username, text } = req.body;
    await notesController.createNote(username, text);
    res.status(201).send({ message: 'Sticky note oprettet!' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET Endpoint til at hente Sticky Notes
router.get('/', async (req, res) => {
  try {
    const notes = await notesController.getNotes();
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// PUT Endpoint til at opdatere reaktioner på en note
router.put('/:noteId/reactions', async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const { reactionType } = req.body;
    const updatedNote = await notesController.updateReactions(noteId, reactionType);
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
