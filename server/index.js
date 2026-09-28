const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Temporary data
// TODO: setup database
let quotes = [
  { id: 1, text: "The quick brown fox jumps over the lazy dog.", difficulty: "easy" },
  { id: 2, text: "Programming is the art of telling another human what one wants the computer to do.", difficulty: "medium" },
  { id: 3, text: "In order to be irreplaceable, one must always be different.", difficulty: "easy" },
  { id: 4, text: "Simplicity is prerequisite for reliability. Complex systems tend to fail in complex ways.", difficulty: "hard" },
  { id: 5, text: "React makes it painless to create interactive UIs. Design simple views for each state in your application.", difficulty: "medium" }
];

let scores = [];

// ROUTES

// 1. Get a random quote
app.get('/api/quotes', (req, res) => {
  const { difficulty } = req.query;
  let filtered = quotes;
  if (difficulty) {
    filtered = quotes.filter(q => q.difficulty === difficulty);
  }
  const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
  res.json(randomQuote || quotes[0]);
});

// 2. Post a new score
app.post('/api/scores', (req, res) => {
  const { username, wpm, accuracy, timeLimit } = req.body;
  
  if (!username || typeof wpm !== 'number' || typeof accuracy !== 'number') {
    return res.status(400).json({ error: 'Invalid score data provided.' });
  }

  const newScore = {
    id: scores.length + 1,
    username: username.trim() || 'Anonymous',
    wpm,
    accuracy,
    timeLimit,
    date: new Date().toISOString()
  };

  scores.push(newScore);
  res.status(201).json({ message: 'Score saved successfully!', score: newScore });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});