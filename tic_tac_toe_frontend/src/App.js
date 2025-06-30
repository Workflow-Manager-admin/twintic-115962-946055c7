import React, { useState, useEffect } from "react";
import "./App.css";

// PUBLIC_INTERFACE
function Square({ value, onClick, highlight }) {
  /** A single square in the Tic Tac Toe board. */
  return (
    <button
      className={`ttt-square${highlight ? " ttt-square--highlight" : ""}`}
      onClick={onClick}
      aria-label={value ? `${value} mark` : "empty square"}
      tabIndex={0}
      style={{
        aspectRatio: "1/1",
        fontWeight: "bold",
        fontSize: "clamp(2rem, 5vw, 4rem)"
      }}
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onSquareClick, winningLine }) {
  /** Renders the 3x3 Game Board. */
  return (
    <div className="ttt-board">
      {Array(3)
        .fill(null)
        .map((_, row) => (
          <div className="ttt-row" key={row}>
            {Array(3)
              .fill(null)
              .map((_, col) => {
                const idx = row * 3 + col;
                return (
                  <Square
                    key={idx}
                    value={squares[idx]}
                    onClick={() => onSquareClick(idx)}
                    highlight={winningLine && winningLine.includes(idx)}
                  />
                );
              })}
          </div>
        ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function getWinner(squares) {
  /** Checks for a winner.
   * Returns: { winner: "X"|"O", line: [idx, idx, idx] } or null if no winner.
   */
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6], // diags
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[b] === squares[c]
    ) {
      return { winner: squares[a], line };
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function getStatus(squares, xIsNext, winnerObj) {
  /**
   * Returns the game status string.
   */
  if (winnerObj) {
    return `Winner: ${winnerObj.winner}`;
  }
  if (squares.every(Boolean)) {
    return "Draw!";
  }
  return `Next Turn: ${xIsNext ? "X" : "O"}`;
}

// PUBLIC_INTERFACE
function App() {
  /**
   * Main app component: handles state and game logic for Tic Tac Toe.
   */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXisNext] = useState(true);
  const [theme, setTheme] = useState("light");

  const winnerObj = getWinner(squares);
  const status = getStatus(squares, xIsNext, winnerObj);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // PUBLIC_INTERFACE
  const handleSquareClick = (idx) => {
    // Do nothing if won, square filled, or draw
    if (winnerObj || squares[idx]) return;
    const nextSquares = squares.slice();
    nextSquares[idx] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXisNext((prev) => !prev);
  };

  // PUBLIC_INTERFACE
  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setXisNext(true);
  };

  return (
    <div className="App">
      <header className="App-header" style={{paddingBottom: "3rem"}}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        <div className="ttt-container">
          <h1 className="ttt-title" style={{marginBottom: "0.5em", fontWeight: 700, fontSize: "2rem"}}>Tic Tac Toe</h1>
          <div className="ttt-status" aria-live="polite" style={{marginBottom: "1em"}}>
            {status}
          </div>
          <Board
            squares={squares}
            onSquareClick={handleSquareClick}
            winningLine={winnerObj ? winnerObj.line : null}
          />
          <button
            className="ttt-reset-btn"
            onClick={resetGame}
            aria-label="Reset game"
            style={{
              marginTop: "1.5em",
              padding: "0.6em 2em",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "600",
              background: "var(--button-bg)",
              color: "var(--button-text)",
              border: "none",
              cursor: "pointer"
            }}
          >
            Reset
          </button>
        </div>
        <footer className="ttt-footer" style={{marginTop: "2rem", opacity: 0.6, fontSize: "0.9rem"}}>
          Minimal, modern web tic-tac-toe &mdash; React + KAVIA UI
        </footer>
      </header>
    </div>
  );
}

export default App;
