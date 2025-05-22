// App.jsx
import { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import openingsData from './chessopenings.json';

import bookgif from './assets/gifs/book.gif';
import inaccuracygif from './assets/gifs/inaccuracy.gif';
import greatgif from './assets/gifs/great.gif';
import bestgif from './assets/gifs/best.gif';
import excellentgif from './assets/gifs/excellent.gif';
import missgif from './assets/gifs/miss.gif';
import goodGif from './assets/gifs/good.gif';
import mistakeGif from './assets/gifs/mistake.gif';
import blunderGif from './assets/gifs/blunder.gif';
import brilliantGif from './assets/gifs/brilliant.gif';

import normalSoundFile from './assets/sounds/normal.mp3';
import captureSoundFile from './assets/sounds/capture.mp3';
import checkSoundFile from './assets/sounds/check.mp3';
import checkmateSoundFile from './assets/sounds/checkmate.mp3';
import castlingSoundFile from './assets/sounds/castling.mp3';
import promotionSoundFile from './assets/sounds/promotion.mp3';

const qualityToGif = {
  brilliant: brilliantGif,
  great: greatgif,
  best: bestgif,
  excellent: excellentgif,
  good: goodGif,
  book: bookgif,
  inaccuracy: inaccuracygif,
  mistake: mistakeGif,
  miss: missgif,
  blunder: blunderGif,
};

const soundRefs = {
  normal: new Audio(normalSoundFile),
  capture: new Audio(captureSoundFile),
  check: new Audio(checkSoundFile),
  checkmate: new Audio(checkmateSoundFile),
  castling: new Audio(castlingSoundFile),
  promotion: new Audio(promotionSoundFile),
};

function App() {
  const boardRef = useRef();
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [moves, setMoves] = useState([]);
  const [selectedOpeningIndex, setSelectedOpeningIndex] = useState(0);
  const [selectedVariationIndex, setSelectedVariationIndex] = useState(0);
  const [lastMoveTo, setLastMoveTo] = useState(null);
  const [lastMoveQuality, setLastMoveQuality] = useState(null);

  const squareSize = 60;
  const boardSize = 8;

  useEffect(() => {
    const variation =
      openingsData.openings[selectedOpeningIndex].variations[
        selectedVariationIndex
      ];
    const moveList = variation.moves;
    const newGame = new Chess();
    setGame(newGame);
    setMoves(moveList);
    setCurrentMoveIndex(0);
    setFen(newGame.fen());
    setLastMoveTo(null);
    setLastMoveQuality(null);
  }, [selectedOpeningIndex, selectedVariationIndex]);

  const nextMove = () => {
    if (currentMoveIndex < moves.length) {
      const moveData = moves[currentMoveIndex];
      const move = game.move(moveData.san, { sloppy: true });
      if (move) {
        setFen(game.fen());
        setCurrentMoveIndex(currentMoveIndex + 1);
        setLastMoveTo(move.to);
        setLastMoveQuality(moveData.quality || null);

        const soundKey = moveData.sound || 'normal';
        const audio = soundRefs[soundKey] || soundRefs['normal'];

        audio.pause();
        audio.currentTime = 0;
        audio.play();
      }
    }
  };

  const getSquareStyle = (square) => {
    if (!square || !boardRef.current) return {};

    const file = square.charCodeAt(0) - 97;
    const rank = 8 - parseInt(square[1]);

    return {
      position: 'absolute',
      width: '15px',
      height: '15px',
      left: `${(file + 1) * squareSize - 15 - 2}px`,
      top: `${rank * squareSize + 2}px`,
      pointerEvents: 'none',
      zIndex: 5,
    };
  };

  return (
    <div style={{ padding: '1rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
        ChessReps - Vite Edition
      </h1>

      <div style={{ marginBottom: '1rem' }}>
        <label>Opening: </label>
        <select
          value={selectedOpeningIndex}
          onChange={(e) => setSelectedOpeningIndex(Number(e.target.value))}
        >
          {openingsData.openings.map((opening, index) => (
            <option key={opening.name} value={index}>
              {opening.name}
            </option>
          ))}
        </select>

        <label style={{ marginLeft: '1rem' }}>Variation: </label>
        <select
          value={selectedVariationIndex}
          onChange={(e) => setSelectedVariationIndex(Number(e.target.value))}
        >
          {openingsData.openings[selectedOpeningIndex].variations.map(
            (variation, index) => (
              <option key={variation.name} value={index}>
                {variation.name}
              </option>
            )
          )}
        </select>
      </div>

      <button onClick={nextMove} disabled={currentMoveIndex >= moves.length}>
        Next Move
      </button>

      <div
        ref={boardRef}
        style={{
          position: 'relative',
          marginTop: '1rem',
          display: 'inline-block',
          width: `${squareSize * boardSize}px`,
          height: `${squareSize * boardSize}px`,
        }}
      >
        <Chessboard
          position={fen}
          arePiecesDraggable={false}
          boardWidth={squareSize * boardSize}
        />

        {lastMoveTo && lastMoveQuality && (
          <img
            src={qualityToGif[lastMoveQuality]}
            alt={lastMoveQuality}
            style={getSquareStyle(lastMoveTo)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
