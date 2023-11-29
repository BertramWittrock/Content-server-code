const { connectToDatabase } = require('./db');

async function removeAllComments() {
    const db = await connectToDatabase();

    try {
        await db.run('DELETE FROM comments');
        console.log('Alle kommentarer er fjernet.');
    } catch (error) {
        console.error('Fejl ved sletning af kommentarer:', error.message);
        throw error;
    } finally {
        db.close();
    }
}

module.exports = { removeAllComments };
