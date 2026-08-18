import React, { useRef } from 'react';
import { Printer, Edit3, Play, Sparkles, Download, Upload, Volume2, VolumeX, Grid } from 'lucide-react';

interface HeaderProps {
  mode: 'builder' | 'play';
  showAnswers: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
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
  soundEnabled,
  onToggleSound,
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
    <header className="bg-zinc-900 text-zinc-100 border-b border-zinc-800 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30 print:hidden shadow-md">
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-600 to-red-500 flex items-center justify-center text-white shadow-sm shadow-orange-500/20">
            <Grid size={18} />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
              Crossword<span className="text-orange-500 font-black">Forge</span>
            </h1>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider hidden sm:block">
              Pro Studio & Interactive Solver
            </p>
          </div>
        </div>

        {/* Builder / Play Mode Switcher Pill */}
        <div className="bg-zinc-800/80 p-1 rounded-xl flex items-center border border-zinc-700/60">
          <button
            onClick={mode === 'play' ? onToggleMode : undefined}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
              mode === 'builder'
                ? 'bg-zinc-100 text-zinc-900 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Edit3 size={14} /> Builder
          </button>
          <button
            onClick={mode === 'builder' ? onToggleMode : undefined}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
              mode === 'play'
                ? 'bg-gradient-to-r from-orange-600 to-red-500 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Play size={14} /> Play Mode
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mute/Sound Toggle */}
        <button
          onClick={onToggleSound}
          className="p-2 text-zinc-400 hover:text-zinc-100 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-all border border-zinc-700/50"
          title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
        >
          {soundEnabled ? <Volume2 size={16} className="text-orange-400" /> : <VolumeX size={16} />}
        </button>

        {/* Presets Button */}
        <button
          onClick={onOpenPresets}
          className="hidden md:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-zinc-200 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-all border border-zinc-700/60"
        >
          <Sparkles size={14} className="text-orange-400" /> Presets
        </button>

        {/* JSON Export/Import */}
        <button
          onClick={onExportJSON}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-all border border-zinc-700/50"
          title="Save puzzle as JSON file"
        >
          <Download size={14} /> Save JSON
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-all border border-zinc-700/50"
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
            className="px-3 py-2 text-xs font-bold text-zinc-200 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-all border border-zinc-700/50"
            aria-pressed={showAnswers}
          >
            {showAnswers ? 'Hide Answers' : 'Show Answers'}
          </button>
        )}

        <button
          onClick={onPrint}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 rounded-xl transition-all shadow-md shadow-orange-600/20"
          aria-label="Print Puzzle"
        >
          <Printer size={14} />
          Print PDF
        </button>
      </div>
    </header>
  );
}
