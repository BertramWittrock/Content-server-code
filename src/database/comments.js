const { connectToDatabase } = require('./db');

async function getComments(noteId) {
  const db = await connectToDatabase();

  try {
    const comments = await db.all('SELECT * FROM comments WHERE note_id = ?', noteId);
    return comments;
  } catch (error) {
    console.error('Fejl ved hentning af kommentarer:', error.message);
    throw error;
  } finally {
    db.close(); // Husk at lukke databasen
  }
}

async function addComment(noteId, username, comment, timestamp) {
  const db = await connectToDatabase();

  try {
    await db.run('INSERT INTO comments (note_id, username, comment, timestamp) VALUES (?, ?, ?, ?)', [noteId, username, comment, timestamp]);
    return { success: true };
  } catch (error) {
    console.error('Fejl ved tilføjelse af kommentar:', error.message);
    return { success: false, error: error.message };
  } finally {
    db.close();
  }
}

module.exports = {
  getComments,
  addComment
};
