import React from 'react';
import { AlertCircle } from 'lucide-react';
import { CrosswordLayout } from '../lib/crossword';

interface PuzzlePreviewProps {
  layout: CrosswordLayout | null;
  title: string;
  showAnswers: boolean;
  showWordBank?: boolean;
  showLetterCounts?: boolean;
}

export function PuzzlePreview({
  layout,
  title,
  showAnswers,
  showWordBank = false,
  showLetterCounts = true
}: PuzzlePreviewProps) {
  const getCellSize = () => {
    if (!layout) return '2rem';
    const maxDim = Math.max(layout.cols, layout.rows);
    const sizePx = Math.floor(700 / maxDim);
    return `${Math.min(32, Math.max(16, sizePx))}px`;
  };

  const cellSize = getCellSize();

  if (!layout) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-zinc-500 print:hidden mt-20">
        <div className="w-24 h-24 border-2 border-dashed border-zinc-400 rounded-2xl flex items-center justify-center mb-6 bg-white/50 shadow-sm">
          <span className="text-4xl text-zinc-400 font-light">?</span>
        </div>
        <p className="text-lg font-bold text-zinc-800">No puzzle generated yet</p>
        <p className="text-sm max-w-sm text-center mt-2 text-zinc-600 leading-relaxed">Add some words and clues on the left, then click "Generate Grid" to see it here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 print:space-y-0 print:max-w-none">

      {/* Unplaced Words Warning */}
      {layout.unplacedWords.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl print:hidden shadow-sm flex items-start gap-3" role="alert">
          <AlertCircle className="text-amber-600 mt-0.5 shrink-0" size={20} />
          <div>
            <h3 className="text-sm font-bold text-amber-900">Could not place {layout.unplacedWords.length} word(s)</h3>
            <p className="text-sm text-amber-800 mt-1 leading-relaxed">
              The generator couldn't find a valid intersection for: <span className="font-extrabold">{layout.unplacedWords.map(w => w.word).join(', ')}</span>.
              Try adding more words to create more intersection opportunities.
            </p>
          </div>
        </div>
      )}

      {/* PAGE 1: The Puzzle Grid & Word Bank */}
      <div className="bg-white text-zinc-900 p-8 md:p-12 rounded-2xl shadow-sm border border-zinc-200 print:shadow-none print:border-none print:p-0 print:m-0">

        {/* Web Preview Header */}
        <div className="text-center mb-10 print:hidden">
          <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">{title}</h2>
          <p className="text-zinc-600 mt-2 uppercase tracking-widest text-xs font-bold">Crossword Puzzle</p>
        </div>

        {/* Premium Print Header */}
        <div className="hidden print:block mb-8">
          <div className="flex justify-between items-end border-b-2 border-black pb-3 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-black tracking-tight">{title}</h2>
              <p className="text-zinc-700 mt-1 uppercase tracking-widest text-[10px] font-bold">Crossword Puzzle</p>
            </div>
            <div className="flex gap-8 text-sm text-black">
              <div className="flex flex-col">
                <span className="uppercase text-[10px] font-bold tracking-wider text-black mb-1">Name</span>
                <div className="w-48 border-b border-black h-3"></div>
              </div>
              <div className="flex flex-col">
                <span className="uppercase text-[10px] font-bold tracking-wider text-black mb-1">Date</span>
                <div className="w-32 border-b border-black h-3"></div>
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
                  className={`relative flex items-center justify-center ${cell ? 'bg-white border border-zinc-900 shadow-sm print:shadow-none' : 'bg-transparent'}`}
                  style={{
                    height: cellSize,
                    marginLeft: cell && x > 0 && row[x-1] ? '-1px' : '0',
                    marginTop: cell && y > 0 && layout.grid[y-1][x] ? '-1px' : '0',
                    zIndex: cell ? 10 : 0
                  }}
                  role={cell ? "gridcell" : "presentation"}
                >
                  {cell && cell.number && (
                    <span className="absolute top-0.5 left-1 text-[10px] sm:text-xs leading-none font-extrabold text-black select-none">
                      {cell.number}
                    </span>
                  )}
                  {cell && showAnswers && (
                    <span className="text-lg font-black uppercase text-orange-600 print:text-black select-none" style={{fontFamily: 'monospace'}}>
                      {cell.letter}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Word Bank on Print & Web Preview */}
        {showWordBank && layout.placedWords.length > 0 && (
          <div className="mt-8 pt-6 border-t border-zinc-300 print:mt-6 print:pt-4">
            <h3 className="text-xs font-extrabold text-zinc-700 uppercase tracking-wider mb-3 text-center">
              Word Bank
            </h3>
            <div className="flex flex-wrap justify-center gap-2 print:gap-1.5">
              {layout.placedWords.map((w) => (
                <span
                  key={w.id}
                  className="px-3 py-1 bg-zinc-100 print:bg-transparent print:border print:border-black text-black rounded-lg text-xs font-mono font-bold uppercase print:text-[10px] print:py-0.5 print:px-2"
                >
                  {w.word}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PAGE 2: The Clues */}
      <div className="page-break bg-white text-zinc-900 p-8 md:p-12 rounded-2xl shadow-sm border border-zinc-200 print:shadow-none print:border-none print:p-0 print:m-0 print:pt-2">
        <div className="hidden print:hidden mb-8 text-center">
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">{title}</h2>
          <p className="text-zinc-600 mt-1 uppercase tracking-widest text-[10px] font-bold">Clues</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 print:grid-cols-2 print:gap-4">
          {/* Across Clues */}
          <div>
            <h3 className="text-lg print:text-sm font-extrabold text-zinc-900 border-b-2 border-zinc-900 pb-2 mb-4 print:pb-1 print:mb-2">Across</h3>
            <ul className="space-y-4 print:space-y-1">
              {layout.placedWords
                .filter(w => w.direction === 'across')
                .sort((a, b) => a.number - b.number)
                .map(w => (
                  <li key={w.id} className="flex gap-4 print:gap-2 text-zinc-900 leading-relaxed print:leading-tight">
                    <span className="font-extrabold text-zinc-900 shrink-0 w-6 print:w-3.5 text-right print:text-[10px]">{w.number}.</span>
                    <span className="text-[15px] font-medium print:text-[10px]">
                      {w.clue}
                      {showLetterCounts && (
                        <span className="text-zinc-600 font-bold ml-1 print:text-[9px]">({w.word.length})</span>
                      )}
                      {showAnswers && <span className="ml-2 text-orange-600 print:text-black text-sm print:text-[9px] uppercase font-bold" style={{fontFamily: 'monospace'}}>[{w.word}]</span>}
                    </span>
                  </li>
                ))}
              {layout.placedWords.filter(w => w.direction === 'across').length === 0 && (
                <li className="text-zinc-500 italic print:text-[10px]">No across words.</li>
              )}
            </ul>
          </div>

          {/* Down Clues */}
          <div>
            <h3 className="text-lg print:text-sm font-extrabold text-zinc-900 border-b-2 border-zinc-900 pb-2 mb-4 print:pb-1 print:mb-2">Down</h3>
            <ul className="space-y-4 print:space-y-1">
              {layout.placedWords
                .filter(w => w.direction === 'down')
                .sort((a, b) => a.number - b.number)
                .map(w => (
                  <li key={w.id} className="flex gap-4 print:gap-2 text-zinc-900 leading-relaxed print:leading-tight">
                    <span className="font-extrabold text-zinc-900 shrink-0 w-6 print:w-3.5 text-right print:text-[10px]">{w.number}.</span>
                    <span className="text-[15px] font-medium print:text-[10px]">
                      {w.clue}
                      {showLetterCounts && (
                        <span className="text-zinc-600 font-bold ml-1 print:text-[9px]">({w.word.length})</span>
                      )}
                      {showAnswers && <span className="ml-2 text-orange-600 print:text-black text-sm print:text-[9px] uppercase font-bold" style={{fontFamily: 'monospace'}}>[{w.word}]</span>}
                    </span>
                  </li>
                ))}
              {layout.placedWords.filter(w => w.direction === 'down').length === 0 && (
                <li className="text-zinc-500 italic print:text-[10px]">No down words.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}
