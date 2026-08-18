import React from 'react';
import { PRESET_THEMES } from '../lib/presets';
import { X, Sparkles, BookOpen } from 'lucide-react';

interface PresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (presetId: string) => void;
}

export function PresetModal({ isOpen, onClose, onSelectPreset }: PresetModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-gray-100 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Preset Theme Library</h2>
              <p className="text-xs text-gray-500 font-medium">Select a theme to instantly populate your crossword</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
          {PRESET_THEMES.map((theme) => (
            <div
              key={theme.id}
              className="p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 rounded-md">
                    {theme.category}
                  </span>
                  <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                    <BookOpen size={12} /> {theme.words.length} Words
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900">{theme.title}</h3>
                <p className="text-xs text-gray-500">{theme.description}</p>
              </div>

              <button
                onClick={() => {
                  onSelectPreset(theme.id);
                  onClose();
                }}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shrink-0 shadow-sm shadow-blue-600/20"
              >
                Load Preset
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
