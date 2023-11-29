const express = require('express');
const notesRoutes = require('./routes/notesRoutes');
const commentsRoutes = require('./routes/commentsRoutes');
const app = express();
app.use(express.json());
app.use(express.static('public'));

app.use('/sticky-notes', notesRoutes);
app.use('/comments', commentsRoutes);

module.exports = app

