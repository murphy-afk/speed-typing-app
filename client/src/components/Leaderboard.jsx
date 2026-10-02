import React, { useState, useEffect } from 'react';

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/scores');
        const data = await response.json();
        setScores(data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchScores();
  }, []);

  return (
    <div className="leaderboard-container">
      <h2 className="section-title">Top High Scores</h2>
      {loading ? (
        <p className="section-desc">Loading scores from database...</p>
      ) : scores.length === 0 ? (
        <p className="section-desc">No scores recorded yet. Complete a test to get on the board!</p>
      ) : (
        <div className="table-wrapper">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>User</th>
                <th>WPM</th>
                <th>Accuracy</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, index) => (
                <tr key={score.id || index}>
                  <td className="rank-cell">#{index + 1}</td>
                  <td className="username-cell">{score.username}</td>
                  <td className="wpm-cell">{score.wpm} WPM</td>
                  <td>{score.accuracy}%</td>
                  <td className="date-cell">{new Date(score.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}