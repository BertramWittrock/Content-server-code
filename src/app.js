const express = require('express');
const notesRoutes = require('./routes/notesRoutes');
const commentsRoutes = require('./routes/commentsRoutes');
const app = express();
const auth = require('./middleware/auth')
app.use(express.json());
app.use(express.static('public'));

app.use('/sticky-notes', auth, notesRoutes);
app.use('/comments',auth, commentsRoutes);

module.exports = app

