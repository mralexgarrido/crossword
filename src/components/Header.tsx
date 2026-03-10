import React from 'react';
import { Printer } from 'lucide-react';

interface HeaderProps {
  showAnswers: boolean;
  onToggleAnswers: () => void;
  onPrint: () => void;
}

export function Header({ showAnswers, onToggleAnswers, onPrint }: HeaderProps) {
  return (
    <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 print:hidden shadow-sm">
      <div>
        <h1 className="text-2xl font-bold font-serif text-stone-900 tracking-tight">Crossword Forge</h1>
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest mt-1">Premium Puzzle Creator</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleAnswers}
          className="px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors border border-stone-200 focus:ring-2 focus:ring-offset-2 focus:ring-stone-200"
          aria-pressed={showAnswers}
        >
          {showAnswers ? 'Hide Answers' : 'Show Answers'}
        </button>
        <button
          onClick={onPrint}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-stone-900"
          aria-label="Print Puzzle"
        >
          <Printer size={16} />
          Print Puzzle
        </button>
      </div>
    </header>
  );
}
