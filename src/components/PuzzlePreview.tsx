import React from 'react';
import { AlertCircle } from 'lucide-react';
import { CrosswordLayout } from '../lib/crossword';

interface PuzzlePreviewProps {
  layout: CrosswordLayout | null;
  title: string;
  showAnswers: boolean;
}

export function PuzzlePreview({ layout, title, showAnswers }: PuzzlePreviewProps) {
  // Calculate dynamic cell size for print to fit page
  const getCellSize = () => {
    if (!layout) return '2rem';
    const maxDim = Math.max(layout.cols, layout.rows);
    // Max width ~700px. 700 / maxDim
    const sizePx = Math.floor(700 / maxDim);
    return `${Math.min(32, Math.max(16, sizePx))}px`;
  };

  const cellSize = getCellSize();

  if (!layout) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 print:hidden mt-20">
        <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center mb-6 bg-white/50 shadow-sm">
          <span className="text-4xl text-gray-300 font-light">?</span>
        </div>
        <p className="text-lg font-semibold text-gray-700">No puzzle generated yet</p>
        <p className="text-sm max-w-sm text-center mt-2 text-gray-500 leading-relaxed">Add some words and clues on the left, then click "Generate Puzzle" to see it here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 print:space-y-0 print:max-w-none">

      {/* Unplaced Words Warning */}
      {layout.unplacedWords.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl print:hidden shadow-sm flex items-start gap-3" role="alert">
          <AlertCircle className="text-amber-500 mt-0.5 shrink-0" size={20} />
          <div>
            <h3 className="text-sm font-bold text-amber-800">Could not place {layout.unplacedWords.length} word(s)</h3>
            <p className="text-sm text-amber-700 mt-1 leading-relaxed">
              The generator couldn't find a valid intersection for: <span className="font-semibold">{layout.unplacedWords.map(w => w.word).join(', ')}</span>.
              Try adding more words to create more intersection opportunities.
            </p>
          </div>
        </div>
      )}

      {/* PAGE 1: The Puzzle */}
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 print:shadow-none print:border-none print:p-0 print:m-0">

        {/* Web Preview Header */}
        <div className="text-center mb-10 print:hidden">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h2>
          <p className="text-gray-500 mt-2 uppercase tracking-widest text-xs font-semibold">Crossword Puzzle</p>
        </div>

        {/* Premium Print Header */}
        <div className="hidden print:block mb-8">
          <div className="flex justify-between items-end border-b-2 border-gray-900 pb-3 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
              <p className="text-gray-500 mt-1 uppercase tracking-widest text-[10px] font-bold">Crossword Puzzle</p>
            </div>
            <div className="flex gap-8 text-sm text-gray-600">
              <div className="flex flex-col">
                <span className="uppercase text-[10px] font-bold tracking-wider text-gray-400 mb-1">Name</span>
                <div className="w-48 border-b border-gray-400 h-3"></div>
              </div>
              <div className="flex flex-col">
                <span className="uppercase text-[10px] font-bold tracking-wider text-gray-400 mb-1">Date</span>
                <div className="w-32 border-b border-gray-400 h-3"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center overflow-x-auto pb-4 print:pb-0 print:overflow-visible">
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${layout.cols}, ${cellSize})`,
            }}
            role="grid"
            aria-label="Crossword Grid"
          >
            {layout.grid.map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${x}-${y}`}
                  className={`relative flex items-center justify-center ${cell ? 'bg-white border border-gray-800 shadow-sm print:shadow-none' : 'bg-transparent'}`}
                  style={{
                    height: cellSize,
                    marginLeft: cell && x > 0 && row[x-1] ? '-1px' : '0',
                    marginTop: cell && y > 0 && layout.grid[y-1][x] ? '-1px' : '0',
                    zIndex: cell ? 10 : 0
                  }}
                  role={cell ? "gridcell" : "presentation"}
                >
                  {cell && cell.number && (
                    <span className="absolute top-0.5 left-1 text-[10px] sm:text-xs leading-none font-bold text-gray-800 select-none">
                      {cell.number}
                    </span>
                  )}
                  {cell && showAnswers && (
                    <span className="text-lg font-bold uppercase text-blue-600 select-none" style={{fontFamily: 'monospace'}}>
                      {cell.letter}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* PAGE 2: The Clues */}
      <div className="page-break bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 print:shadow-none print:border-none print:p-0 print:m-0 print:pt-2">
        <div className="hidden print:hidden mb-8 text-center">
          {/* Header explicitly hidden in print to save space for dense clues */}
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
          <p className="text-gray-500 mt-1 uppercase tracking-widest text-[10px] font-bold">Clues</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 print:grid-cols-2 print:gap-4">
          {/* Across Clues */}
          <div>
            <h3 className="text-lg print:text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4 print:pb-1 print:mb-2">Across</h3>
            <ul className="space-y-4 print:space-y-1">
              {layout.placedWords
                .filter(w => w.direction === 'across')
                .sort((a, b) => a.number - b.number)
                .map(w => (
                  <li key={w.id} className="flex gap-4 print:gap-2 text-gray-700 leading-relaxed print:leading-tight">
                    <span className="font-bold text-gray-900 shrink-0 w-6 print:w-3.5 text-right print:text-[10px]">{w.number}.</span>
                    <span className="text-[15px] print:text-[10px]">
                      {w.clue}
                      {showAnswers && <span className="ml-2 text-blue-600 text-sm print:text-[9px] uppercase font-bold" style={{fontFamily: 'monospace'}}>[{w.word}]</span>}
                    </span>
                  </li>
                ))}
              {layout.placedWords.filter(w => w.direction === 'across').length === 0 && (
                <li className="text-gray-400 italic print:text-[10px]">No across words.</li>
              )}
            </ul>
          </div>

          {/* Down Clues */}
          <div>
            <h3 className="text-lg print:text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4 print:pb-1 print:mb-2">Down</h3>
            <ul className="space-y-4 print:space-y-1">
              {layout.placedWords
                .filter(w => w.direction === 'down')
                .sort((a, b) => a.number - b.number)
                .map(w => (
                  <li key={w.id} className="flex gap-4 print:gap-2 text-gray-700 leading-relaxed print:leading-tight">
                    <span className="font-bold text-gray-900 shrink-0 w-6 print:w-3.5 text-right print:text-[10px]">{w.number}.</span>
                    <span className="text-[15px] print:text-[10px]">
                      {w.clue}
                      {showAnswers && <span className="ml-2 text-blue-600 text-sm print:text-[9px] uppercase font-bold" style={{fontFamily: 'monospace'}}>[{w.word}]</span>}
                    </span>
                  </li>
                ))}
              {layout.placedWords.filter(w => w.direction === 'down').length === 0 && (
                <li className="text-gray-400 italic print:text-[10px]">No down words.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}
