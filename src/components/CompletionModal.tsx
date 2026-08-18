import React from 'react';
import { Trophy, Clock, CheckCircle2, RotateCcw, Edit3 } from 'lucide-react';

interface CompletionModalProps {
  elapsedTime: number;
  wordCount: number;
  title: string;
  onReset: () => void;
  onSwitchToBuilder: () => void;
}

export function CompletionModal({
  elapsedTime,
  wordCount,
  title,
  onReset,
  onSwitchToBuilder
}: CompletionModalProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center border border-gray-100 relative overflow-hidden">
        {/* Subtle Decorative top accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500" />

        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Trophy size={32} />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Puzzle Completed!</h2>
        <p className="text-gray-500 text-sm mt-1">You solved <span className="font-semibold text-gray-800">"{title}"</span></p>

        <div className="grid grid-cols-2 gap-4 my-6">
          <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex flex-col items-center">
            <Clock size={20} className="text-blue-600 mb-1" />
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Completion Time</span>
            <span className="text-xl font-bold text-gray-900 mt-1 font-mono">{formatTime(elapsedTime)}</span>
          </div>
          <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex flex-col items-center">
            <CheckCircle2 size={20} className="text-emerald-600 mb-1" />
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Words Solved</span>
            <span className="text-xl font-bold text-gray-900 mt-1">{wordCount}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onReset}
            className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} /> Replay Puzzle
          </button>
          <button
            onClick={onSwitchToBuilder}
            className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-all shadow-sm shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            <Edit3 size={16} /> Builder Mode
          </button>
        </div>
      </div>
    </div>
  );
}
