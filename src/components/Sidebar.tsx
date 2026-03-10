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
  onChangeWord,
  onGenerate,
  onBulkImport
}: SidebarProps) {
  const [isBulkImport, setIsBulkImport] = React.useState(false);

  return (
    <aside className="w-full lg:w-96 bg-white border-r border-stone-200 flex flex-col h-[calc(100vh-73px)] print:hidden shadow-sm z-10">
      <div className="p-4 border-b border-stone-200 bg-stone-50">
        <label htmlFor="puzzle-title" className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Puzzle Title</label>
        <input
          id="puzzle-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-900 font-serif text-lg bg-white"
          placeholder="e.g., Chapter 4 Vocabulary"
        />
      </div>

      <div className="flex border-b border-stone-200 bg-white">
        <button
          className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${!isBulkImport ? 'border-b-2 border-stone-900 text-stone-900' : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'}`}
          onClick={() => setIsBulkImport(false)}
        >
          Manual Entry
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${isBulkImport ? 'border-b-2 border-stone-900 text-stone-900' : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'}`}
          onClick={() => setIsBulkImport(true)}
        >
          Bulk Import
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-stone-50/50">
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
            onChange={onChangeWord}
          />
        )}
      </div>

      <div className="p-4 border-t border-stone-200 bg-white">
        <button
          onClick={onGenerate}
          className="w-full py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors font-medium flex items-center justify-center gap-2 shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-stone-900"
        >
          <RefreshCw size={18} /> Generate Puzzle
        </button>
      </div>
    </aside>
  );
}
