import React from 'react';
import { WordList } from './WordList';
import { BulkImport } from './BulkImport';
import { RefreshCw, Shuffle, Sparkles, SlidersHorizontal, BarChart2 } from 'lucide-react';
import { WordInput, CrosswordLayout } from '../lib/crossword';

interface SidebarProps {
  title: string;
  setTitle: (title: string) => void;
  words: WordInput[];
  layout: CrosswordLayout | null;
  showWordBank: boolean;
  setShowWordBank: (show: boolean) => void;
  showLetterCounts: boolean;
  setShowLetterCounts: (show: boolean) => void;
  onAddWord: () => void;
  onRemoveWord: (id: string) => void;
  onClearWords: () => void;
  onChangeWord: (id: string, field: 'word' | 'clue', value: string) => void;
  onGenerate: () => void;
  onReshuffle: () => void;
  onBulkImport: (text: string) => boolean;
  onOpenPresets: () => void;
}

export function Sidebar({
  title,
  setTitle,
  words,
  layout,
  showWordBank,
  setShowWordBank,
  showLetterCounts,
  setShowLetterCounts,
  onAddWord,
  onRemoveWord,
  onClearWords,
  onChangeWord,
  onGenerate,
  onReshuffle,
  onBulkImport,
  onOpenPresets
}: SidebarProps) {
  const [isBulkImport, setIsBulkImport] = React.useState(false);
  const [showOptions, setShowOptions] = React.useState(false);
  const [showStats, setShowStats] = React.useState(false);

  // Compute stats
  const totalWords = words.filter(w => w.word.trim()).length;
  const placedWordsCount = layout?.placedWords.length || 0;
  const unplacedCount = layout?.unplacedWords.length || 0;
  const totalCells = layout ? layout.cols * layout.rows : 0;
  let activeCells = 0;
  if (layout) {
    for (const row of layout.grid) {
      for (const cell of row) {
        if (cell) activeCells++;
      }
    }
  }
  const density = totalCells > 0 ? Math.round((activeCells / totalCells) * 100) : 0;

  return (
    <aside className="w-full lg:w-96 bg-zinc-900 border-r border-zinc-800 flex flex-col h-[calc(100vh-57px)] print:hidden shadow-lg z-10 text-zinc-100">
      {/* Title & Presets Bar */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-950/50 space-y-2.5">
        <div className="flex justify-between items-center">
          <label htmlFor="puzzle-title" className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">
            Puzzle Title
          </label>
          <button
            onClick={onOpenPresets}
            className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 hover:underline"
          >
            <Sparkles size={12} className="text-orange-400" /> Theme Library
          </button>
        </div>
        <input
          id="puzzle-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 text-white font-bold text-sm shadow-inner transition-all placeholder-zinc-500"
          placeholder="e.g., Science Chapter 4"
        />
      </div>

      {/* Mode Tabs */}
      <div className="flex border-b border-zinc-800 bg-zinc-900 px-2 pt-2">
        <button
          className={`flex-1 py-2 text-xs font-bold text-center transition-all duration-200 rounded-t-lg mx-1 ${!isBulkImport ? 'bg-zinc-800 text-orange-400 border-b-2 border-orange-500' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border-b-2 border-transparent'}`}
          onClick={() => setIsBulkImport(false)}
        >
          Manual Entry
        </button>
        <button
          className={`flex-1 py-2 text-xs font-bold text-center transition-all duration-200 rounded-t-lg mx-1 ${isBulkImport ? 'bg-zinc-800 text-orange-400 border-b-2 border-orange-500' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border-b-2 border-transparent'}`}
          onClick={() => setIsBulkImport(true)}
        >
          Bulk Import
        </button>
      </div>

      {/* Word Inputs / Bulk */}
      <div className="flex-1 overflow-y-auto p-4 bg-zinc-950/30 space-y-4">
        {isBulkImport ? (
          <BulkImport
            onImport={onBulkImport}
            onSuccess={() => setIsBulkImport(false)}
          />
        ) : (
          <WordList
            words={words}
            onAdd={onAddWord}
            onRemove={onRemoveWord}
            onClear={onClearWords}
            onChange={onChangeWord}
          />
        )}
      </div>

      {/* Options & Analytics Footer */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900 space-y-2.5">
        {/* Toggleable Analytics / Stats */}
        {layout && (
          <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950/40">
            <button
              onClick={() => setShowStats(!showStats)}
              className="w-full px-3 py-2 text-xs font-bold text-zinc-300 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <BarChart2 size={13} className="text-orange-400" /> Puzzle Analytics
              </span>
              <span className="text-[10px] uppercase font-extrabold text-orange-400">{showStats ? 'Hide' : 'View'}</span>
            </button>

            {showStats && (
              <div className="p-3 bg-zinc-900/90 border-t border-zinc-800 grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-zinc-800/60 p-2 rounded-lg">
                  <div className="text-[10px] text-zinc-400 uppercase">Grid Size</div>
                  <div className="font-bold text-zinc-100">{layout.cols} × {layout.rows}</div>
                </div>
                <div className="bg-zinc-800/60 p-2 rounded-lg">
                  <div className="text-[10px] text-zinc-400 uppercase">Density</div>
                  <div className="font-bold text-orange-400">{density}% fill</div>
                </div>
                <div className="bg-zinc-800/60 p-2 rounded-lg">
                  <div className="text-[10px] text-zinc-400 uppercase">Placed Words</div>
                  <div className="font-bold text-emerald-400">{placedWordsCount}/{totalWords}</div>
                </div>
                <div className="bg-zinc-800/60 p-2 rounded-lg">
                  <div className="text-[10px] text-zinc-400 uppercase">Unplaced</div>
                  <div className={`font-bold ${unplacedCount > 0 ? 'text-rose-400' : 'text-zinc-400'}`}>{unplacedCount}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Toggleable Print/Worksheet Options */}
        <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950/40">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="w-full px-3 py-2 text-xs font-bold text-zinc-300 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <SlidersHorizontal size={13} className="text-zinc-400" /> Print & Worksheet Settings
            </span>
            <span className="text-[10px] uppercase font-extrabold text-orange-400">{showOptions ? 'Hide' : 'Show'}</span>
          </button>

          {showOptions && (
            <div className="p-3 bg-zinc-900/90 border-t border-zinc-800 space-y-2.5 text-xs text-zinc-300">
              <label className="flex items-center justify-between cursor-pointer">
                <span>Include Word Bank on Page 1</span>
                <input
                  type="checkbox"
                  checked={showWordBank}
                  onChange={(e) => setShowWordBank(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-800 text-orange-500 focus:ring-orange-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>Show Letter Counts in Clues (14)</span>
                <input
                  type="checkbox"
                  checked={showLetterCounts}
                  onChange={(e) => setShowLetterCounts(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-800 text-orange-500 focus:ring-orange-500 h-4 w-4"
                />
              </label>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onReshuffle}
            className="px-3 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 border border-zinc-700/60"
            title="Reshuffle Grid Layout"
          >
            <Shuffle size={14} /> Reshuffle
          </button>

          <button
            onClick={onGenerate}
            className="flex-1 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl transition-all font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-600/20"
          >
            <RefreshCw size={14} /> Generate Grid
          </button>
        </div>
      </div>
    </aside>
  );
}
