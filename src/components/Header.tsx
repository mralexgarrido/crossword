import React, { useRef } from 'react';
import { Printer, Edit3, Play, Sparkles, Download, Upload } from 'lucide-react';

interface HeaderProps {
  mode: 'builder' | 'play';
  showAnswers: boolean;
  onToggleMode: () => void;
  onToggleAnswers: () => void;
  onPrint: () => void;
  onOpenPresets: () => void;
  onExportJSON: () => void;
  onImportJSON: (jsonText: string) => void;
}

export function Header({
  mode,
  showAnswers,
  onToggleMode,
  onToggleAnswers,
  onPrint,
  onOpenPresets,
  onExportJSON,
  onImportJSON
}: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          onImportJSON(text);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-20 print:hidden shadow-sm">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            Crossword Forge
          </h1>
          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider hidden sm:block">
            Premium Puzzle Creator & Interactive Solver
          </p>
        </div>

        {/* Builder / Play Mode Switcher Pill */}
        <div className="bg-gray-100 p-1 rounded-xl flex items-center border border-gray-200">
          <button
            onClick={mode === 'play' ? onToggleMode : undefined}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              mode === 'builder'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Edit3 size={14} /> Builder
          </button>
          <button
            onClick={mode === 'builder' ? onToggleMode : undefined}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              mode === 'play'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Play size={14} /> Play Mode
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Presets Button */}
        <button
          onClick={onOpenPresets}
          className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all border border-transparent"
        >
          <Sparkles size={14} className="text-amber-500" /> Presets
        </button>

        {/* JSON Export/Import */}
        <button
          onClick={onExportJSON}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
          title="Save puzzle as JSON file"
        >
          <Download size={14} /> Save JSON
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
          title="Load puzzle from JSON file"
        >
          <Upload size={14} /> Load JSON
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />

        {mode === 'builder' && (
          <button
            onClick={onToggleAnswers}
            className="px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all border border-transparent"
            aria-pressed={showAnswers}
          >
            {showAnswers ? 'Hide Answers' : 'Show Answers'}
          </button>
        )}

        <button
          onClick={onPrint}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm shadow-blue-600/20"
          aria-label="Print Puzzle"
        >
          <Printer size={14} />
          Print
        </button>
      </div>
    </header>
  );
}
