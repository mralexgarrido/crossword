import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { WordInput } from '../lib/crossword';

interface WordListProps {
  words: WordInput[];
  onChange: (id: string, field: 'word' | 'clue', value: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onAdd: () => void;
}

export function WordList({ words, onChange, onRemove, onClear, onAdd }: WordListProps) {
  const validWordsCount = words.filter(w => w.word.trim() !== '').length;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
          Words ({validWordsCount}/50)
        </span>
        <div className="flex items-center gap-2">
          {words.length > 0 && (
            <button
              onClick={onClear}
              className="text-xs font-medium text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors border border-red-200 hover:border-red-300 rounded px-2 py-1 bg-white hover:bg-red-50 shadow-sm"
            >
              <Trash2 size={12} /> Clear All
            </button>
          )}
          <button
            onClick={onAdd}
            className="text-xs font-medium text-stone-700 hover:text-stone-900 flex items-center gap-1 transition-colors border border-stone-300 rounded px-2 py-1 bg-white hover:bg-stone-50 shadow-sm"
          >
            <Plus size={12} /> Add Word
          </button>
        </div>
      </div>

      {words.map((word) => (
        <div key={word.id} className="bg-stone-50 p-3 rounded-lg border border-stone-200 relative group transition-all hover:border-stone-300 shadow-sm">
          <button
            onClick={() => onRemove(word.id)}
            className="absolute -top-2 -right-2 bg-white text-red-500 border border-stone-200 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 focus:opacity-100"
            title="Remove word"
            aria-label={`Remove word ${word.word}`}
          >
            <Trash2 size={14} />
          </button>
          <div className="space-y-2">
            <input
              type="text"
              value={word.word}
              onChange={(e) => onChange(word.id, 'word', e.target.value)}
              placeholder="WORD"
              className="w-full px-2 py-1.5 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-900 uppercase font-mono text-sm bg-white"
            />
            <textarea
              value={word.clue}
              onChange={(e) => onChange(word.id, 'clue', e.target.value)}
              placeholder="Clue description..."
              rows={2}
              className="w-full px-2 py-1.5 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-900 text-sm resize-none bg-white"
            />
          </div>
        </div>
      ))}

      <button
        onClick={onAdd}
        className="w-full py-3 border-2 border-dashed border-stone-300 text-stone-500 rounded-lg hover:border-stone-500 hover:text-stone-800 transition-colors flex items-center justify-center gap-2 font-medium bg-stone-50 hover:bg-stone-100"
      >
        <Plus size={18} /> Add Another Word
      </button>
    </div>
  );
}
