
const express = require('express');
const cors = require('cors');

const app = express();

let projectData = {}; // holds the latest entry

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve client
app.use(express.static('website'));

// GET route returns the projectData
app.get('/all', (req, res) => {
  return res.json(projectData);
});

// POST route creates a new entry in projectData
app.post('/add', (req, res) => {
  const { date, temp, feel } = req.body || {};
  projectData = { date, temp, feel };
  return res.status(201).json({ ok: true });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
