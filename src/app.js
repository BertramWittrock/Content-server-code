const express = require('express');
const notesRoutes = require('./routes/notesRoutes');
const commentsRoutes = require('./routes/commentsRoutes');
const app = express();
const auth = require('./middleware/auth')
const cors = require('cors');
const helmet = require('helmet');
app.use(express.json());
app.use(express.static('public'));
app.use(cors(corsOptions));

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}

app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], // Only allow scripts from the same origin
        scriptSrc: ["'self'", "'unsafe-inline'"], // Allow scripts from the same origin and inline scripts
        styleSrc: ["'self'", 'https://fonts.googleapis.com'], // Allow styles from the same origin and Google Fonts
        fontSrc: ["'self'", 'https://fonts.gstatic.com'], // Allow fonts from the same origin and Google Fonts
        imgSrc: ["'self'", 'data:'], // Allow images from the same origin and data URLs
        connectSrc: ["'self'", "wss://eu.joeandthejuice.digital"], // Allow connections to the same origin and your WebSocket server
        // Add other resource directives as needed
      }
    }
  }));
app.use('/sticky-notes', notesRoutes);
app.use('/comments', commentsRoutes);

module.exports = app

