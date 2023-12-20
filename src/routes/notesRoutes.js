const express = require('express');
const router = express.Router();
const { createNote, getNotes, updateReactions } = require('../database/notes'); 
const { generateNoteHTML } = require('../utils/helpers'); 

// POST Endpoint to create sticky note
router.post('/', async (req, res) => {
  try {
    const { username, text } = req.body;
    await createNote(username, text); 
    res.status(201).send({ message: 'Sticky note oprettet!' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET Endpoint to get sticky notes
router.get('/', async (req, res) => {
  try {
    const notes = await getNotes(); 
    
    // Convert notes to HTML here
    const notesHTML = notes.map(note => generateNoteHTML(note)).join('');
    
    res.status(200).send(notesHTML);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// PUT Endpoint to update reactions on a stickynote
router.put('/:noteId/reactions', async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const { reactionType } = req.body;
    const updatedNote = await updateReactions(noteId, reactionType); 
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
