const express = require('express');
const app = express();
const cors = require('cors');


// Para el parseo de respuestas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Configura el uso del router /* node src/index.js  */
app.use(require("./routes/index"));

module.exports = app;