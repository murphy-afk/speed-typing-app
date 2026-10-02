import React, { useState, useEffect } from 'react';

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('typing_history') || '[]');
    setHistory(savedHistory);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('typing_history');
    setHistory([]);
  };

  return (
    <div className="history-container">
      <div className="history-header">
        <h2 className="section-title">Your Past Results</h2>
        {history.length > 0 && (
          <button onClick={clearHistory} className="danger-btn">
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="section-desc">No past tests recorded yet. Complete a test to see your history here!</p>
      ) : (
        <div className="table-wrapper">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Attempt</th>
                <th>WPM</th>
                <th>Accuracy</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr key={index}>
                  <td className="rank-cell">#{history.length - index}</td>
                  <td className="wpm-cell">{item.wpm} WPM</td>
                  <td>{item.accuracy}%</td>
                  <td className="date-cell">{new Date(item.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}