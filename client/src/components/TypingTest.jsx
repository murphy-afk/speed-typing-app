import React, { useState, useEffect, useRef } from 'react';

export default function TypingTest() {
  const [quote, setQuote] = useState({ text: 'Loading quote from server...' });
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsFinished] = useState(false);
  const [username, setUsername] = useState('Anonymous');
  const [difficulty, setDifficulty] = useState('random');
  
  const inputRef = useRef(null);

  const fetchQuote = async (selectedDifficulty = difficulty) => {
    try {
      let url = 'http://localhost:5000/api/quotes';
      if (selectedDifficulty !== 'random') {
        url += `?difficulty=${selectedDifficulty}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setQuote(data);
      setUserInput('');
      setStartTime(null);
      setWpm(0);
      setAccuracy(100);
      setIsFinished(false);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
    } catch (error) {
      console.error('Failed to fetch quote:', error);
      setQuote({ text: 'Make sure your Express server is running on port 5000!' });
    }
  };

  useEffect(() => {
    fetchQuote('random');
  }, []);

  const handleDifficultyChange = (e) => {
    const newDifficulty = e.target.value;
    setDifficulty(newDifficulty);
    fetchQuote(newDifficulty);
  };

  // Listen for the Enter key when the test is finished
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && isFinished) {
        fetchQuote(difficulty);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFinished, difficulty]);

  const saveScore = async (finalWpm, finalAccuracy) => {
    const scoreData = {
      username: username.trim() || 'Anonymous',
      wpm: finalWpm,
      accuracy: finalAccuracy,
      timeLimit: 'quote',
      date: new Date().toISOString()
    };

    // Save to browser localStorage
    try {
      const existingHistory = JSON.parse(localStorage.getItem('typing_history') || '[]');
      localStorage.setItem('typing_history', JSON.stringify([scoreData, ...existingHistory]));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }

    // Save to db
    try {
      await fetch('http://localhost:5000/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scoreData)
      });
    } catch (error) {
      console.error('Failed to save score to backend:', error);
    }
  };

  const handleTyping = (e) => {
    if (isFinished) return;

    const value = e.target.value;
    
    if (!startTime && value.length > 0) {
      setStartTime(Date.now());
    }

    if (value.length <= quote.text.length) {
      setUserInput(value);

      if (startTime && value.length > 0) {
        const timeElapsed = (Date.now() - startTime) / 60000;
        const wordsTyped = value.trim().split(/\s+/).length;
        const calculatedWpm = Math.round(wordsTyped / (timeElapsed || 0.001));
        const currentWpm = calculatedWpm > 0 ? calculatedWpm : 0;
        setWpm(currentWpm);

        let correctChars = 0;
        for (let i = 0; i < value.length; i++) {
          if (value[i] === quote.text[i]) correctChars++;
        }
        const calculatedAccuracy = Math.round((correctChars / value.length) * 100);
        setAccuracy(calculatedAccuracy);

        if (value.length === quote.text.length) {
          setIsFinished(true);
          saveScore(currentWpm, calculatedAccuracy);
        }
      }
    }
  };

  return (
    <div className="typing-box">
      <div className="stats-bar">
        <span>WPM: {wpm}</span>
        <span>Accuracy: {accuracy}%</span>
        {quote.difficulty && <span className="difficulty-badge">Level: {quote.difficulty}</span>}
        {isFinished && <span className="completion-message">Saved & Completed! Press Enter ↵</span>}
      </div>

      <div className="quote-display" onClick={() => inputRef.current?.focus()}>
        {quote.text.split('').map((char, index) => {
          let charClass = "char-pending";
          if (index < userInput.length) {
            charClass = userInput[index] === char ? "char-correct" : "char-incorrect";
          }
          return <span key={index} className={charClass}>{char}</span>;
        })}
      </div>

      <input ref={inputRef} type="text" value={userInput} onChange={handleTyping} disabled={isFinished} className="hidden-input" />

      <div className="controls-container">
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Your name" 
          className="text-input"/>
        
        <select 
          value={difficulty} 
          onChange={handleDifficultyChange}
          className="difficulty-select">
          <option value="random">Random Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <button onClick={() => fetchQuote(difficulty)} className="restart-btn">
          {isFinished ? 'Next Test & Save Score' : 'New Quote / Reset'}
        </button>
      </div>
    </div>
  );
}