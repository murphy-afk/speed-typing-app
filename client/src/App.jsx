import React, { useState } from 'react';
import { Trophy, History, Play } from 'lucide-react';
import TypingTest from './components/TypingTest';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('play');

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="logo"><Play size={20} /> TypeRush</h1>
        <nav className="nav">
          <button onClick={() => setActiveTab('play')} className={`nav-btn ${activeTab === 'play' ? 'active' : ''}`}><Play size={16} /> Test</button>
          <button onClick={() => setActiveTab('leaderboard')} className={`nav-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}><Trophy size={16} /> Leaderboard</button>
          <button onClick={() => setActiveTab('history')} className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`}><History size={16} /> History</button>
        </nav>
      </header>

      <main className="main-content">
        {activeTab === 'play' && <TypingTest />}
        {activeTab === 'leaderboard' && (
          <div>
            <h2 className="section-title">Top High Scores</h2>
            <p className="section-desc">Leaderboard fetched from Express backend goes here.</p>
          </div>
        )}
        {activeTab === 'history' && (
          <div>
            <h2 className="section-title">Your Past Results</h2>
            <p className="section-desc">Local history goes here.</p>
          </div>
        )}
      </main>
    </div>
  );
}