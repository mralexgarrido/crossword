import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface BulkImportProps {
  onImport: (text: string) => boolean;
  onSuccess: () => void;
}

export function BulkImport({ onImport, onSuccess }: BulkImportProps) {
  const [bulkText, setBulkText] = useState('');

  const handleImport = () => {
    if (bulkText.trim() === '') return;
    const success = onImport(bulkText);
    if (success) {
      setBulkText('');
      onSuccess();
    } else {
      alert('Could not parse any words. Please ensure format is "Word - Clue" or "Word: Clue".');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-orange-500/10 border border-orange-500/30 text-orange-200 p-3.5 rounded-xl text-xs flex gap-3 items-start shadow-sm">
        <Info size={16} className="mt-0.5 shrink-0 text-orange-400" />
        <p className="leading-relaxed">Paste your words and clues separated by a hyphen, colon, or tab. One pair per line.</p>
      </div>
      <textarea
        value={bulkText}
        onChange={(e) => setBulkText(e.target.value)}
        className="w-full h-64 p-3.5 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono text-xs bg-zinc-950 text-white placeholder-zinc-500 shadow-inner transition-all resize-none leading-relaxed"
        placeholder="PHOTOSYNTHESIS - Process by which plants make food&#10;CHLOROPHYLL - Green pigment in plants"
        aria-label="Bulk import text area"
      />
      <button
        onClick={handleImport}
        className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl transition-all duration-200 font-extrabold text-xs shadow-md shadow-orange-600/20"
      >
        Import Words
      </button>
    </div>
  );
}
