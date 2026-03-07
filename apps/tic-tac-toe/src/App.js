import { useState } from "react";

function Square({ value, onClickSquare }) {
  return (
    <button className="square" onClick={onClickSquare}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
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

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const boardRow = [];

  for (let row = 0; row < 3; row++) {
    const rowSquares = [];

    for (let col = 0; col < 3; col++) {
      const index = row * 3 + col;

      rowSquares.push(
        <Square
          key={index}
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
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((_squares, move) => {
    let displayEl;
    if (move === currentMove) {
      displayEl = (
        <span className="current-move">{`You are at move #${move}`}</span>
      );
    } else {
      displayEl = (
        <button onClick={() => jumpTo(move)}>
          {move > 0 ? `Go to move #${move}` : "Go to game start"}
        </button>
      );
    }

    return <li key={move}>{displayEl}</li>;
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
