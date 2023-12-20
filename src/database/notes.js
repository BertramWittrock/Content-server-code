
const { connectToDatabase } = require('./db');

async function createNote(username, text) {
  const db = await connectToDatabase();
  const timestamp = new Date().toISOString();
  try {
    await db.run('INSERT INTO sticky_notes (username, timestamp, text) VALUES (?, ?, ?)', [username, timestamp, text]);
  } catch (error) {
    console.error('Fejl ved oprettelse af note:', error.message);
    throw error;
  } finally {
    db.close();
  }
}

async function getNotes() {
  const db = await connectToDatabase();
  try {
    const notes = await db.all('SELECT * FROM sticky_notes');
    return notes;
  } catch (error) {
    console.error('Fejl ved hentning af notes:', error.message);
    throw error;
  } finally {
    db.close();
  }
}

async function updateReactions(noteId, reactionType) {
  const db = await connectToDatabase();
  try {
    await db.run(`UPDATE sticky_notes SET ${reactionType} = ${reactionType} + 1 WHERE id = ?`, [noteId]);
    const updatedNote = await db.get('SELECT * FROM sticky_notes WHERE id = ?', [noteId]);
    return updatedNote;
  } catch (error) {
    console.error('Fejl under opdatering af reaktion:', error.message);
    throw error;
  } finally {
    db.close();
  }
}

module.exports = { createNote, getNotes, updateReactions };
