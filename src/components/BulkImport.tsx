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
      <div className="bg-blue-50/50 border border-blue-100 text-blue-800 p-4 rounded-xl text-sm flex gap-3 items-start shadow-sm">
        <Info size={18} className="mt-0.5 shrink-0 text-blue-600" />
        <p className="leading-relaxed">Paste your words and clues separated by a hyphen, colon, or tab. One pair per line.</p>
      </div>
      <textarea
        value={bulkText}
        onChange={(e) => setBulkText(e.target.value)}
        className="w-full h-64 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-sm bg-white shadow-sm transition-all resize-none"
        placeholder="PHOTOSYNTHESIS - Process by which plants make food&#10;CHLOROPHYLL - Green pigment in plants"
        aria-label="Bulk import text area"
      />
      <button
        onClick={handleImport}
        className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold shadow-sm shadow-blue-600/20 focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
      >
        Import Words
      </button>
    </div>
  );
}
