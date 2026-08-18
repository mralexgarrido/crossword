import React, { useEffect, useRef } from 'react';
import { Play, Pause, CheckCircle, Eye, RotateCcw, HelpCircle } from 'lucide-react';
import { CrosswordLayout, Direction } from '../lib/crossword';
import { CompletionModal } from './CompletionModal';

interface InteractivePlayerProps {
  layout: CrosswordLayout;
  title: string;
  showWordBank: boolean;
  showLetterCounts: boolean;
  userAnswers: { [key: string]: string };
  focusedCell: { x: number; y: number } | null;
  direction: Direction;
  checkedCells: { [key: string]: 'correct' | 'incorrect' };
  elapsedTime: number;
  isTimerRunning: boolean;
  isCompleted: boolean;
  setIsTimerRunning: (running: boolean) => void;
  onCellClick: (x: number, y: number) => void;
  onCellInputChange: (letter: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onCheckLetter: () => void;
  onCheckWord: () => void;
  onCheckPuzzle: () => void;
  onRevealLetter: () => void;
  onRevealWord: () => void;
  onRevealPuzzle: () => void;
  onReset: () => void;
  onSwitchToBuilder: () => void;
}

export function InteractivePlayer({
  layout,
  title,
  showWordBank,
  showLetterCounts,
  userAnswers,
  focusedCell,
  direction,
  checkedCells,
  elapsedTime,
  isTimerRunning,
  isCompleted,
  setIsTimerRunning,
  onCellClick,
  onCellInputChange,
  onKeyDown,
  onCheckLetter,
  onCheckWord,
  onCheckPuzzle,
  onRevealLetter,
  onRevealWord,
  onRevealPuzzle,
  onReset,
  onSwitchToBuilder
}: InteractivePlayerProps) {
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const [showHintDropdown, setShowHintDropdown] = React.useState(false);

  // Auto focus hidden input so keyboard events capture seamlessly
  useEffect(() => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  }, [focusedCell]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Find active word based on focusedCell and direction
  const activeWord = focusedCell
    ? layout.placedWords.find(w => {
        if (w.direction !== direction) return false;
        if (direction === 'across') {
          return focusedCell.y === w.y && focusedCell.x >= w.x && focusedCell.x < w.x + w.word.length;
        } else {
          return focusedCell.x === w.x && focusedCell.y >= w.y && focusedCell.y < w.y + w.word.length;
        }
      })
    : null;

  // Check if cell is in active word
  const isCellInActiveWord = (x: number, y: number) => {
    if (!activeWord) return false;
    if (activeWord.direction === 'across') {
      return y === activeWord.y && x >= activeWord.x && x < activeWord.x + activeWord.word.length;
    } else {
      return x === activeWord.x && y >= activeWord.y && y < activeWord.y + activeWord.word.length;
    }
  };

  const getCellSize = () => {
    const maxDim = Math.max(layout.cols, layout.rows);
    const sizePx = Math.floor(650 / maxDim);
    return `${Math.min(42, Math.max(24, sizePx))}px`;
  };

  const cellSize = getCellSize();

  return (
    <div
      className="max-w-5xl mx-auto space-y-6 outline-none"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {/* Hidden input for smooth mobile/desktop key handling */}
      <input
        ref={hiddenInputRef}
        type="text"
        className="opacity-0 absolute -z-50 pointer-events-none"
        onChange={(e) => {
          onCellInputChange(e.target.value);
          e.target.value = '';
        }}
        autoCapitalize="characters"
        autoComplete="off"
        spellCheck={false}
      />

      {/* Solver Top Control Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-200/80 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-0.5">Interactive Solver Mode</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Stopwatch Timer */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3.5 py-2 rounded-xl text-sm font-mono font-semibold text-gray-800">
            <span>{formatTime(elapsedTime)}</span>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="text-gray-500 hover:text-gray-900 p-0.5 transition-colors"
              title={isTimerRunning ? 'Pause Timer' : 'Resume Timer'}
            >
              {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
            </button>
          </div>

          {/* Hint Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setShowHintDropdown(!showHintDropdown)}
              className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
            >
              <HelpCircle size={16} />
              Check / Reveal
            </button>

            {showHintDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-30 text-sm">
                <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Check</div>
                <button
                  onClick={() => { onCheckLetter(); setShowHintDropdown(false); }}
                  className="w-full text-left px-4 py-1.5 hover:bg-gray-50 text-gray-700 font-medium flex items-center gap-2"
                >
                  <CheckCircle size={14} className="text-blue-500" /> Check Letter
                </button>
                <button
                  onClick={() => { onCheckWord(); setShowHintDropdown(false); }}
                  className="w-full text-left px-4 py-1.5 hover:bg-gray-50 text-gray-700 font-medium flex items-center gap-2"
                >
                  <CheckCircle size={14} className="text-blue-500" /> Check Word
                </button>
                <button
                  onClick={() => { onCheckPuzzle(); setShowHintDropdown(false); }}
                  className="w-full text-left px-4 py-1.5 hover:bg-gray-50 text-gray-700 font-medium flex items-center gap-2"
                >
                  <CheckCircle size={14} className="text-blue-500" /> Check Puzzle
                </button>

                <div className="border-t border-gray-100 my-1.5" />

                <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Reveal</div>
                <button
                  onClick={() => { onRevealLetter(); setShowHintDropdown(false); }}
                  className="w-full text-left px-4 py-1.5 hover:bg-amber-50 text-amber-700 font-medium flex items-center gap-2"
                >
                  <Eye size={14} /> Reveal Letter
                </button>
                <button
                  onClick={() => { onRevealWord(); setShowHintDropdown(false); }}
                  className="w-full text-left px-4 py-1.5 hover:bg-amber-50 text-amber-700 font-medium flex items-center gap-2"
                >
                  <Eye size={14} /> Reveal Word
                </button>
                <button
                  onClick={() => { onRevealPuzzle(); setShowHintDropdown(false); }}
                  className="w-full text-left px-4 py-1.5 hover:bg-amber-50 text-amber-700 font-medium flex items-center gap-2"
                >
                  <Eye size={14} /> Reveal Puzzle
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onReset}
            className="p-2 text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
            title="Reset Progress"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* Active Clue Bar */}
      <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-sm flex items-center justify-between gap-3 min-h-[60px]">
        {activeWord ? (
          <div className="flex items-center gap-3">
            <span className="font-bold text-xs uppercase px-2 py-1 bg-blue-700/80 rounded-lg shrink-0">
              {activeWord.number} {activeWord.direction}
            </span>
            <p className="text-sm font-medium leading-tight">
              {activeWord.clue}
              {showLetterCounts && (
                <span className="text-blue-200 ml-1.5 text-xs">({activeWord.word.length})</span>
              )}
            </p>
          </div>
        ) : (
          <p className="text-sm font-medium text-blue-100 italic">Select a cell in the grid to see its clue.</p>
        )}
      </div>

      {/* Main Solver Grid & Clues Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Crossword Grid */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center justify-center">
          <div
            className="grid select-none"
            style={{
              gridTemplateColumns: `repeat(${layout.cols}, ${cellSize})`,
            }}
          >
            {layout.grid.map((row, y) =>
              row.map((cell, x) => {
                if (!cell) {
                  return (
                    <div
                      key={`${x}-${y}`}
                      style={{ width: cellSize, height: cellSize }}
                      className="bg-transparent"
                    />
                  );
                }

                const key = `${x},${y}`;
                const isFocused = focusedCell?.x === x && focusedCell?.y === y;
                const isInActiveWord = isCellInActiveWord(x, y);
                const userVal = userAnswers[key] || '';
                const checkStatus = checkedCells[key];

                let bgClass = 'bg-white';
                if (isFocused) {
                  bgClass = 'bg-blue-500 text-white';
                } else if (isInActiveWord) {
                  bgClass = 'bg-blue-50/90 text-blue-900';
                }

                let borderClass = 'border-gray-800';
                if (isFocused) {
                  borderClass = 'border-blue-600 ring-2 ring-blue-500/50 z-20';
                } else if (checkStatus === 'correct') {
                  borderClass = 'border-emerald-500 ring-1 ring-emerald-400 z-10';
                } else if (checkStatus === 'incorrect') {
                  borderClass = 'border-rose-500 ring-1 ring-rose-400 z-10';
                }

                return (
                  <div
                    key={`${x}-${y}`}
                    onClick={() => {
                      onCellClick(x, y);
                      if (hiddenInputRef.current) hiddenInputRef.current.focus();
                    }}
                    className={`relative border flex items-center justify-center cursor-pointer transition-colors duration-150 ${bgClass} ${borderClass}`}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      marginLeft: x > 0 && row[x - 1] ? '-1px' : '0',
                      marginTop: y > 0 && layout.grid[y - 1][x] ? '-1px' : '0',
                    }}
                  >
                    {cell.number && (
                      <span className={`absolute top-0.5 left-1 text-[9px] sm:text-[10px] font-bold leading-none select-none ${isFocused ? 'text-blue-100' : 'text-gray-700'}`}>
                        {cell.number}
                      </span>
                    )}
                    <span className={`text-base sm:text-lg font-bold font-mono uppercase select-none ${
                      isFocused
                        ? 'text-white'
                        : checkStatus === 'correct'
                        ? 'text-emerald-700'
                        : checkStatus === 'incorrect'
                        ? 'text-rose-600'
                        : 'text-gray-900'
                    }`}>
                      {userVal}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Optional Word Bank */}
          {showWordBank && (
            <div className="w-full mt-6 pt-5 border-t border-gray-200">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Word Bank</h4>
              <div className="flex flex-wrap gap-2">
                {layout.placedWords.map(w => {
                  // Check if word is fully entered
                  let isFilled = true;
                  for (let i = 0; i < w.word.length; i++) {
                    const cx = w.direction === 'across' ? w.x + i : w.x;
                    const cy = w.direction === 'across' ? w.y : w.y + i;
                    if (!userAnswers[`${cx},${cy}`]) {
                      isFilled = false;
                      break;
                    }
                  }
                  return (
                    <span
                      key={w.id}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                        isFilled ? 'bg-gray-100 text-gray-400 line-through' : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {w.word}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Clues Column */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">

            {/* Across Clues */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">Across</h3>
              <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {layout.placedWords
                  .filter(w => w.direction === 'across')
                  .sort((a, b) => a.number - b.number)
                  .map(w => {
                    const isActive = activeWord?.id === w.id;
                    return (
                      <li
                        key={w.id}
                        onClick={() => {
                          onCellClick(w.x, w.y);
                          if (hiddenInputRef.current) hiddenInputRef.current.focus();
                        }}
                        className={`p-2 rounded-xl text-xs flex gap-2 cursor-pointer transition-all ${
                          isActive
                            ? 'bg-blue-50 text-blue-900 font-semibold border-l-4 border-blue-600'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <span className="font-bold shrink-0 w-4 text-right">{w.number}.</span>
                        <span>
                          {w.clue}
                          {showLetterCounts && (
                            <span className="text-gray-400 ml-1">({w.word.length})</span>
                          )}
                        </span>
                      </li>
                    );
                  })}
              </ul>
            </div>

            {/* Down Clues */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">Down</h3>
              <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {layout.placedWords
                  .filter(w => w.direction === 'down')
                  .sort((a, b) => a.number - b.number)
                  .map(w => {
                    const isActive = activeWord?.id === w.id;
                    return (
                      <li
                        key={w.id}
                        onClick={() => {
                          onCellClick(w.x, w.y);
                          if (hiddenInputRef.current) hiddenInputRef.current.focus();
                        }}
                        className={`p-2 rounded-xl text-xs flex gap-2 cursor-pointer transition-all ${
                          isActive
                            ? 'bg-blue-50 text-blue-900 font-semibold border-l-4 border-blue-600'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <span className="font-bold shrink-0 w-4 text-right">{w.number}.</span>
                        <span>
                          {w.clue}
                          {showLetterCounts && (
                            <span className="text-gray-400 ml-1">({w.word.length})</span>
                          )}
                        </span>
                      </li>
                    );
                  })}
              </ul>
            </div>

          </div>
        </div>

      </div>

      {/* Completion Celebration Modal */}
      {isCompleted && (
        <CompletionModal
          elapsedTime={elapsedTime}
          wordCount={layout.placedWords.length}
          title={title}
          onReset={onReset}
          onSwitchToBuilder={onSwitchToBuilder}
        />
      )}
    </div>
  );
}
