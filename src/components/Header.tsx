import React from 'react';
import { Printer } from 'lucide-react';

interface HeaderProps {
  showAnswers: boolean;
  onToggleAnswers: () => void;
  onPrint: () => void;
}

export function Header({ showAnswers, onToggleAnswers, onPrint }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 print:hidden shadow-sm">
      <div className="flex flex-col">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Crossword Forge</h1>
        <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mt-0.5">Premium Puzzle Creator</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleAnswers}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 border border-transparent focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
          aria-pressed={showAnswers}
        >
          {showAnswers ? 'Hide Answers' : 'Show Answers'}
        </button>
        <button
          onClick={onPrint}
          className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all duration-200 shadow-sm shadow-blue-600/20 focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
          aria-label="Print Puzzle"
        >
          <Printer size={16} />
          Print Puzzle
        </button>
      </div>
    </header>
  );
}
