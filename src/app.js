const express = require("express");
const notesRoutes = require("./routes/notesRoutes");
const commentsRoutes = require("./routes/commentsRoutes");
const auth = require("./middleware/auth");
const app = express();
app.use(express.json());
app.use(express.static("src/public"));

app.use("/sticky-notes", auth, notesRoutes);
app.use("/comments", auth, commentsRoutes);

module.exports = app;

// const express = require('express');
// const path = require('path');
// const notesRoutes = require('./routes/notesRoutes');
// const commentsRoutes = require('./routes/commentsRoutes');

// const app = express();

// app.use(express.json());

// // Opdateret for at sikre den korrekte sti til 'public' mappen
// app.use(express.static(path.join(__dirname, '..', 'public')));

// app.use('/sticky-notes', notesRoutes);
// app.use('/comments', commentsRoutes);

// module.exports = app;
