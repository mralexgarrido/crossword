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
    <div className="space-y-3.5">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-extrabold text-zinc-300 uppercase tracking-wider">
          Word List ({validWordsCount}/50)
        </span>
        <div className="flex items-center gap-2">
          {words.length > 0 && (
            <button
              onClick={onClear}
              className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-all border border-rose-500/30 rounded-lg px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20"
            >
              <Trash2 size={13} /> Clear
            </button>
          )}
          <button
            onClick={onAdd}
            className="text-xs font-extrabold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-all border border-orange-500/40 rounded-lg px-2.5 py-1 bg-orange-500/10 hover:bg-orange-500/20"
          >
            <Plus size={13} /> Add Word
          </button>
        </div>
      </div>

      {words.map((word, idx) => (
        <div key={word.id} className="bg-zinc-900 p-3.5 rounded-xl border border-zinc-700/80 relative group transition-all hover:border-zinc-500 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold font-mono text-zinc-400">#{idx + 1}</span>
            <button
              onClick={() => onRemove(word.id)}
              className="text-zinc-400 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/20 transition-colors"
              title="Remove word"
              aria-label={`Remove word ${word.word}`}
            >
              <Trash2 size={13} />
            </button>
          </div>
          <div className="space-y-2.5">
            <div>
              <label htmlFor={`word-input-${word.id}`} className="block text-[10px] font-bold text-zinc-300 uppercase mb-1">
                Word
              </label>
              <input
                id={`word-input-${word.id}`}
                type="text"
                value={word.word}
                onChange={(e) => onChange(word.id, 'word', e.target.value)}
                placeholder="e.g. PHOTOSYNTHESIS"
                className="w-full px-3 py-2 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 uppercase font-mono font-bold text-xs bg-zinc-950 text-white placeholder-zinc-500 transition-colors"
              />
            </div>
            <div>
              <label htmlFor={`clue-input-${word.id}`} className="block text-[10px] font-bold text-zinc-300 uppercase mb-1">
                Clue
              </label>
              <textarea
                id={`clue-input-${word.id}`}
                value={word.clue}
                onChange={(e) => onChange(word.id, 'clue', e.target.value)}
                placeholder="Clue description..."
                rows={2}
                className="w-full px-3 py-2 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-xs font-medium resize-none bg-zinc-950 text-zinc-100 placeholder-zinc-500 transition-colors leading-relaxed"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={onAdd}
        className="w-full py-3 border-2 border-dashed border-zinc-700 text-zinc-300 rounded-xl hover:border-orange-500 hover:text-orange-400 hover:bg-orange-500/10 transition-all flex items-center justify-center gap-2 font-bold text-xs bg-zinc-900"
      >
        <Plus size={16} /> Add Another Word
      </button>
    </div>
  );
}
