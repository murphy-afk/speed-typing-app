const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 1. Get a random quote
app.get('/api/quotes', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM quotes');
    const randomQuote = rows[Math.floor(Math.random() * rows.length)];
    res.json(randomQuote);
  } catch (error) {
    console.error('Database error fetching quotes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Get leaderboard
app.get('/api/scores', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, username, wpm, accuracy, time_limit AS timeLimit, created_at AS date FROM scores ORDER BY wpm DESC, accuracy DESC LIMIT 10'
    );
    res.json(rows);
  } catch (error) {
    console.error('Database error fetching scores:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. Post a new score
app.post('/api/scores', async (req, res) => {
  const { username, wpm, accuracy, timeLimit } = req.body;
  
  try {
    const [result] = await pool.query(
      'INSERT INTO scores (username, wpm, accuracy, time_limit) VALUES (?, ?, ?, ?)',
      [username.trim() || 'Anonymous', wpm, accuracy, timeLimit || 'quote']
    );

    res.status(201).json({ 
      message: 'Score saved successfully!', 
      scoreId: result.insertId 
    });
  } catch (error) {
    console.error('Database error saving score:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});