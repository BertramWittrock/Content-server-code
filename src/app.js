const express = require('express');
const notesRoutes = require('./routes/notesRoutes');
const commentsRoutes = require('./routes/commentsRoutes');
const app = express();
const auth = require('./middleware/auth')
app.use(express.json());
app.use(express.static('public'));
app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "wss://eu.joeandthejuice.digital"]
    }
  }));
app.use('/sticky-notes', notesRoutes);
app.use('/comments', commentsRoutes);

module.exports = app

