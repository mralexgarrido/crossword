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
      <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-sm flex gap-2 items-start">
        <Info size={16} className="mt-0.5 shrink-0" />
        <p>Paste your words and clues separated by a hyphen, colon, or tab. One pair per line.</p>
      </div>
      <textarea
        value={bulkText}
        onChange={(e) => setBulkText(e.target.value)}
        className="w-full h-64 p-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-900 font-mono text-sm bg-white"
        placeholder="PHOTOSYNTHESIS - Process by which plants make food&#10;CHLOROPHYLL - Green pigment in plants"
        aria-label="Bulk import text area"
      />
      <button
        onClick={handleImport}
        className="w-full py-2 bg-stone-800 text-white rounded-md hover:bg-stone-900 transition-colors font-medium focus:ring-2 focus:ring-offset-2 focus:ring-stone-800"
      >
        Import Words
      </button>
    </div>
  );
}
