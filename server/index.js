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