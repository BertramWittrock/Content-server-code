const express = require('express');
const router = express.Router();
const { createNote, getNotes, updateReactions } = require('../database/notes'); // Opdateret import
const { generateNoteHTML } = require('../utils/helpers'); 

// POST Endpoint til at oprette en Sticky Note
router.post('/', async (req, res) => {
  try {
    const { username, text } = req.body;
    await createNote(username, text); // Opdateret til at bruge funktionen direkte
    res.status(201).send({ message: 'Sticky note oprettet!' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET Endpoint til at hente Sticky Notes
router.get('/', async (req, res) => {
  try {
    const notes = await getNotes(); // Opdateret til at bruge funktionen direkte
    
    // Convert notes to HTML here
    const notesHTML = notes.map(note => generateNoteHTML(note)).join('');
    
    res.status(200).send(notesHTML);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// PUT Endpoint til at opdatere reaktioner på en note
router.put('/:noteId/reactions', async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const { reactionType } = req.body;
    const updatedNote = await updateReactions(noteId, reactionType); // Opdateret til at bruge funktionen direkte
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
