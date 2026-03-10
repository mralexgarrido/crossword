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
      <div className="h-full flex flex-col items-center justify-center text-stone-400 print:hidden">
        <div className="w-24 h-24 border-4 border-dashed border-stone-300 rounded-xl flex items-center justify-center mb-4 bg-white/50">
          <span className="font-serif text-4xl text-stone-300">?</span>
        </div>
        <p className="text-lg font-medium text-stone-500 font-serif">No puzzle generated yet</p>
        <p className="text-sm max-w-sm text-center mt-2 text-stone-500">Add some words and clues on the left, then click "Generate Puzzle" to see it here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 print:space-y-0 print:max-w-none">

      {/* Unplaced Words Warning */}
      {layout.unplacedWords.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-md print:hidden shadow-sm" role="alert">
          <div className="flex items-start">
            <AlertCircle className="text-amber-500 mt-0.5 mr-3 shrink-0" size={20} />
            <div>
              <h3 className="text-sm font-medium text-amber-800">Could not place {layout.unplacedWords.length} word(s)</h3>
              <p className="text-sm text-amber-700 mt-1">
                The generator couldn't find a valid intersection for: {layout.unplacedWords.map(w => w.word).join(', ')}.
                Try adding more words to create more intersection opportunities.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 1: The Puzzle */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-200 print:shadow-none print:border-none print:p-0 print:m-0">

        {/* Web Preview Header */}
        <div className="text-center mb-8 print:hidden">
          <h2 className="text-3xl font-serif font-bold text-stone-900">{title}</h2>
          <p className="text-stone-500 mt-2 uppercase tracking-widest text-xs font-semibold">Crossword Puzzle</p>
        </div>

        {/* Premium Print Header */}
        <div className="hidden print:block mb-6">
          <div className="flex justify-between items-end border-b-2 border-stone-800 pb-2 mb-4">
            <div>
              <h2 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">{title}</h2>
              <p className="text-stone-500 font-sans mt-1 uppercase tracking-widest text-[10px] font-semibold">Crossword Puzzle</p>
            </div>
            <div className="flex gap-6 text-sm font-sans text-stone-600">
              <div className="flex flex-col">
                <span className="uppercase text-[10px] font-bold tracking-wider text-stone-400 mb-1">Name</span>
                <div className="w-40 border-b border-stone-400 h-3"></div>
              </div>
              <div className="flex flex-col">
                <span className="uppercase text-[10px] font-bold tracking-wider text-stone-400 mb-1">Date</span>
                <div className="w-24 border-b border-stone-400 h-3"></div>
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
                  className={`relative flex items-center justify-center ${cell ? 'bg-white border border-stone-800 shadow-sm print:shadow-none' : 'bg-transparent'}`}
                  style={{
                    height: cellSize,
                    marginLeft: cell && x > 0 && row[x-1] ? '-1px' : '0',
                    marginTop: cell && y > 0 && layout.grid[y-1][x] ? '-1px' : '0',
                    zIndex: cell ? 10 : 0
                  }}
                  role={cell ? "gridcell" : "presentation"}
                >
                  {cell && cell.number && (
                    <span className="absolute top-0.5 left-0.5 text-[10px] sm:text-xs leading-none font-bold text-stone-800 select-none">
                      {cell.number}
                    </span>
                  )}
                  {cell && showAnswers && (
                    <span className="text-lg font-bold uppercase text-blue-800 select-none font-sans" style={{fontFamily: 'monospace'}}>
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
      <div className="page-break bg-white p-8 rounded-xl shadow-sm border border-stone-200 print:shadow-none print:border-none print:p-0 print:m-0 print:pt-6">
        <div className="hidden print:block mb-6 text-center">
          <h2 className="text-2xl font-serif font-bold text-stone-900">{title}</h2>
          <p className="text-stone-500 font-sans mt-1 uppercase tracking-widest text-[10px] font-semibold">Clues</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2 print:gap-8">
          {/* Across Clues */}
          <div>
            <h3 className="text-xl print:text-base font-serif font-bold text-stone-900 border-b border-stone-300 pb-2 print:pb-1 mb-4 print:mb-2">Across</h3>
            <ul className="space-y-4 print:space-y-1.5">
              {layout.placedWords
                .filter(w => w.direction === 'across')
                .sort((a, b) => a.number - b.number)
                .map(w => (
                  <li key={w.id} className="flex gap-4 print:gap-2 text-stone-800 leading-relaxed print:leading-snug">
                    <span className="font-bold font-sans text-stone-900 shrink-0 w-6 print:w-4 text-right print:text-xs">{w.number}.</span>
                    <span className="font-serif text-lg print:text-xs">
                      {w.clue}
                      {showAnswers && <span className="ml-2 text-blue-800 font-sans text-sm print:text-[10px] uppercase font-semibold" style={{fontFamily: 'monospace'}}>[{w.word}]</span>}
                    </span>
                  </li>
                ))}
              {layout.placedWords.filter(w => w.direction === 'across').length === 0 && (
                <li className="text-stone-400 italic font-serif print:text-xs">No across words.</li>
              )}
            </ul>
          </div>

          {/* Down Clues */}
          <div>
            <h3 className="text-xl print:text-base font-serif font-bold text-stone-900 border-b border-stone-300 pb-2 print:pb-1 mb-4 print:mb-2">Down</h3>
            <ul className="space-y-4 print:space-y-1.5">
              {layout.placedWords
                .filter(w => w.direction === 'down')
                .sort((a, b) => a.number - b.number)
                .map(w => (
                  <li key={w.id} className="flex gap-4 print:gap-2 text-stone-800 leading-relaxed print:leading-snug">
                    <span className="font-bold font-sans text-stone-900 shrink-0 w-6 print:w-4 text-right print:text-xs">{w.number}.</span>
                    <span className="font-serif text-lg print:text-xs">
                      {w.clue}
                      {showAnswers && <span className="ml-2 text-blue-800 font-sans text-sm print:text-[10px] uppercase font-semibold" style={{fontFamily: 'monospace'}}>[{w.word}]</span>}
                    </span>
                  </li>
                ))}
              {layout.placedWords.filter(w => w.direction === 'down').length === 0 && (
                <li className="text-stone-400 italic font-serif print:text-xs">No down words.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}
