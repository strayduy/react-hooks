// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import { useLocalStorageState } from '../utils';

const EMPTY_BOARD = Array(9).fill(null);

function Board({ selectSquare, squares }) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function MoveHistory({ currentMoveIndex, goToMove, moves }) {
  return (
    <ol>
      {moves.map((_, i) => {
        const label = i === 0 ? 'game start' : `move #${i}`;
        const isCurrentMove = i === currentMoveIndex;
        return (
          <li key={i}>
            <button
              disabled={isCurrentMove}
              onClick={() => goToMove(i)}
            >
              Go to {label}{isCurrentMove && ' (current)'}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function useMoveHistory() {
  const [moves, setMoves] = useLocalStorageState('tic-tac-toe:history', [EMPTY_BOARD]);
  const [currentMoveIndex, setCurrentMoveIndex] = useLocalStorageState('tic-tac-toe:step', 0);

  const currentSquares = moves[currentMoveIndex];
  const nextValue = calculateNextValue(currentSquares);
  const winner = calculateWinner(currentSquares);
  const status = calculateStatus(winner, currentSquares, nextValue);

  function selectSquare(square) {
    if (winner || currentSquares[square]) {
      return;
    }

    const previousMoves = moves.slice(0, currentMoveIndex + 1);
    const previousSquares = previousMoves[previousMoves.length - 1];
    const nextSquares = [...previousSquares];
    nextSquares[square] = nextValue;
    setMoves([...previousMoves, nextSquares]);
    setCurrentMoveIndex(currentMoveIndex + 1);
  }

  function restart() {
    setMoves([EMPTY_BOARD]);
    setCurrentMoveIndex(0);
  }

  return {
    currentMoveIndex,
    currentSquares,
    moves,
    restart,
    selectSquare,
    setCurrentMoveIndex,
    status,
  };
}

function Game() {
  const {
    currentMoveIndex,
    currentSquares,
    moves,
    restart,
    selectSquare,
    setCurrentMoveIndex,
    status,
  } = useMoveHistory();

  return (
    <div className="game">
      <div className="game-board">
        <Board selectSquare={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <MoveHistory
          currentMoveIndex={currentMoveIndex}
          goToMove={setCurrentMoveIndex}
          moves={moves}
        />
      </div>
    </div>
  )
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
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
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
