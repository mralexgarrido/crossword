import React from 'react';
import { WordList } from './WordList';
import { BulkImport } from './BulkImport';
import { RefreshCw } from 'lucide-react';
import { WordInput } from '../lib/crossword';

interface SidebarProps {
  title: string;
  setTitle: (title: string) => void;
  words: WordInput[];
  onAddWord: () => void;
  onRemoveWord: (id: string) => void;
  onClearWords: () => void;
  onChangeWord: (id: string, field: 'word' | 'clue', value: string) => void;
  onGenerate: () => void;
  onBulkImport: (text: string) => boolean;
}

export function Sidebar({
  title,
  setTitle,
  words,
  onAddWord,
  onRemoveWord,
  onClearWords,
  onChangeWord,
  onGenerate,
  onBulkImport
}: SidebarProps) {
  const [isBulkImport, setIsBulkImport] = React.useState(false);

  return (
    <aside className="w-full lg:w-96 bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-73px)] print:hidden shadow-sm z-10">
      <div className="p-5 border-b border-gray-200 bg-gray-50/50">
        <label htmlFor="puzzle-title" className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Puzzle Title</label>
        <input
          id="puzzle-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 font-semibold bg-white shadow-sm transition-all"
          placeholder="e.g., Chapter 4 Vocabulary"
        />
      </div>

      <div className="flex border-b border-gray-200 bg-white px-2 pt-2">
        <button
          className={`flex-1 py-3 text-sm font-medium text-center transition-all duration-200 rounded-t-lg mx-1 ${!isBulkImport ? 'bg-gray-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50 border-b-2 border-transparent'}`}
          onClick={() => setIsBulkImport(false)}
        >
          Manual Entry
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium text-center transition-all duration-200 rounded-t-lg mx-1 ${isBulkImport ? 'bg-gray-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50 border-b-2 border-transparent'}`}
          onClick={() => setIsBulkImport(true)}
        >
          Bulk Import
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 bg-gray-50/30">
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

      <div className="p-5 border-t border-gray-200 bg-white">
        <button
          onClick={onGenerate}
          className="w-full py-3.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
        >
          <RefreshCw size={18} /> Generate Puzzle
        </button>
      </div>
    </aside>
  );
}
