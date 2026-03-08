import { useState } from "react";

function Square({ value, isSquareWinner, onClickSquare }) {
  return (
    <button
      className={`square ${isSquareWinner ? "square-winner" : ""}`}
      onClick={onClickSquare}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const winnerLine = calculateWinner(squares);
  const winner = winnerLine ? squares[winnerLine[0]] : null;

  function handleClick(i) {
    if (winnerLine || squares[i]) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares);
  }

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (!squares.includes(null)) {
    status = "The game is a draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const boardRow = [];

  for (let row = 0; row < 3; row++) {
    const rowSquares = [];

    for (let col = 0; col < 3; col++) {
      const index = row * 3 + col;
      const isSquareWinner = winnerLine?.includes(index) ?? false;

      rowSquares.push(
        <Square
          key={index}
          isSquareWinner={isSquareWinner}
          value={squares[index]}
          onClickSquare={() => handleClick(index)}
        />,
      );
    }

    boardRow.push(
      <div key={row} className="board-row">
        {rowSquares}
      </div>,
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRow}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function handleToggle() {
    setIsAscending((prev) => !prev);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let movePosition = "";

    if (move > 0) {
      const prevSquares = history[move - 1];
      const changedIndex = squares.findIndex(
        (square, i) => square !== prevSquares[i],
      );

      const row = Math.floor(changedIndex / 3) + 1;
      const col = (changedIndex % 3) + 1;

      movePosition = ` (${row}, ${col})`;
    }

    let description = "";
    if (move === currentMove) {
      description = `You are at move #${move}${movePosition}`;
    } else if (move === 0) {
      description = "Go to game start";
    } else {
      description = `Go to move #${move}${movePosition}`;
    }

    const displayEl =
      move === currentMove ? (
        <span className="current-move">{description}</span>
      ) : (
        <button onClick={() => jumpTo(move)}>{description}</button>
      );

    return <li key={move}>{displayEl}</li>;
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <span>Sort:</span>
        <button className="toggle" onClick={handleToggle}>
          {isAscending ? "Asc" : "Desc"}
        </button>
        <ol>{isAscending ? moves : [...moves].reverse()}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return line;
    }
  }
  return null;
}
