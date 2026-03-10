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
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          Words ({validWordsCount}/50)
        </span>
        <div className="flex items-center gap-2">
          {words.length > 0 && (
            <button
              onClick={onClear}
              className="text-xs font-medium text-red-600 hover:text-red-700 flex items-center gap-1 transition-all border border-red-200 hover:border-red-300 rounded-lg px-2.5 py-1.5 bg-white hover:bg-red-50 shadow-sm"
            >
              <Trash2 size={14} /> Clear All
            </button>
          )}
          <button
            onClick={onAdd}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-all border border-blue-200 hover:border-blue-300 rounded-lg px-2.5 py-1.5 bg-white hover:bg-blue-50 shadow-sm"
          >
            <Plus size={14} /> Add Word
          </button>
        </div>
      </div>

      {words.map((word) => (
        <div key={word.id} className="bg-white p-4 rounded-xl border border-gray-200 relative group transition-all hover:border-gray-300 shadow-sm hover:shadow-md">
          <button
            onClick={() => onRemove(word.id)}
            className="absolute -top-2.5 -right-2.5 bg-white text-gray-400 hover:text-red-500 border border-gray-200 rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:border-red-200 hover:bg-red-50 focus:opacity-100"
            title="Remove word"
            aria-label={`Remove word ${word.word}`}
          >
            <Trash2 size={14} />
          </button>
          <div className="space-y-3">
            <input
              type="text"
              value={word.word}
              onChange={(e) => onChange(word.id, 'word', e.target.value)}
              placeholder="WORD"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 uppercase font-mono text-sm bg-gray-50/50 hover:bg-white transition-colors"
            />
            <textarea
              value={word.clue}
              onChange={(e) => onChange(word.id, 'clue', e.target.value)}
              placeholder="Clue description..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none bg-gray-50/50 hover:bg-white transition-colors"
            />
          </div>
        </div>
      ))}

      <button
        onClick={onAdd}
        className="w-full py-3.5 border-2 border-dashed border-gray-300 text-gray-500 rounded-xl hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 font-medium bg-white"
      >
        <Plus size={18} /> Add Another Word
      </button>
    </div>
  );
}
