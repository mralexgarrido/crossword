import React from 'react';
import { WordList } from './WordList';
import { BulkImport } from './BulkImport';
import { RefreshCw, Shuffle, Sparkles, SlidersHorizontal } from 'lucide-react';
import { WordInput } from '../lib/crossword';

interface SidebarProps {
  title: string;
  setTitle: (title: string) => void;
  words: WordInput[];
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

  return (
    <aside className="w-full lg:w-96 bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-61px)] print:hidden shadow-sm z-10">
      {/* Title & Presets Bar */}
      <div className="p-4 border-b border-gray-200 bg-gray-50/50 space-y-3">
        <div className="flex justify-between items-center">
          <label htmlFor="puzzle-title" className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            Puzzle Title
          </label>
          <button
            onClick={onOpenPresets}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
          >
            <Sparkles size={12} className="text-amber-500" /> Presets Library
          </button>
        </div>
        <input
          id="puzzle-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 font-semibold bg-white shadow-sm transition-all text-sm"
          placeholder="e.g., Chapter 4 Vocabulary"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white px-2 pt-2">
        <button
          className={`flex-1 py-2.5 text-xs font-semibold text-center transition-all duration-200 rounded-t-lg mx-1 ${!isBulkImport ? 'bg-gray-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50 border-b-2 border-transparent'}`}
          onClick={() => setIsBulkImport(false)}
        >
          Manual Entry
        </button>
        <button
          className={`flex-1 py-2.5 text-xs font-semibold text-center transition-all duration-200 rounded-t-lg mx-1 ${isBulkImport ? 'bg-gray-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50 border-b-2 border-transparent'}`}
          onClick={() => setIsBulkImport(true)}
        >
          Bulk Import
        </button>
      </div>

      {/* Word Inputs / Bulk */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30 space-y-4">
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

      {/* Options & Controls Footer */}
      <div className="p-4 border-t border-gray-200 bg-white space-y-3">
        {/* Toggleable Print/Worksheet Options */}
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50/50">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="w-full px-3 py-2 text-xs font-bold text-gray-700 flex items-center justify-between hover:bg-gray-100 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <SlidersHorizontal size={14} className="text-gray-500" /> Worksheet & Clue Options
            </span>
            <span className="text-[10px] uppercase font-bold text-blue-600">{showOptions ? 'Hide' : 'Show'}</span>
          </button>

          {showOptions && (
            <div className="p-3 bg-white border-t border-gray-200 space-y-2.5 text-xs">
              <label className="flex items-center justify-between text-gray-700 cursor-pointer">
                <span>Include Word Bank on Print</span>
                <input
                  type="checkbox"
                  checked={showWordBank}
                  onChange={(e) => setShowWordBank(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between text-gray-700 cursor-pointer">
                <span>Show Letter Counts in Clues (e.g. (14))</span>
                <input
                  type="checkbox"
                  checked={showLetterCounts}
                  onChange={(e) => setShowLetterCounts(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
              </label>
            </div>
          )}
        </div>

        {/* Generate / Shuffle Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onReshuffle}
            className="px-3 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 border border-gray-200"
            title="Reshuffle Grid Layout"
          >
            <Shuffle size={14} /> Reshuffle
          </button>

          <button
            onClick={onGenerate}
            className="flex-1 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-all font-semibold text-xs flex items-center justify-center gap-2 shadow-md"
          >
            <RefreshCw size={14} /> Generate Puzzle
          </button>
        </div>
      </div>
    </aside>
  );
}
