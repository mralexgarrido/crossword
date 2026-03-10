import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Printer, RefreshCw, Upload, Settings, Info, AlertCircle } from 'lucide-react';
import { generateCrossword, WordInput, CrosswordLayout } from './lib/crossword';

const generateId = () => Math.random().toString(36).substr(2, 9);

export default function App() {
  const [words, setWords] = useState<WordInput[]>([
    { id: generateId(), word: 'PHOTOSYNTHESIS', clue: 'Process by which plants make their own food.' },
    { id: generateId(), word: 'CHLOROPHYLL', clue: 'Green pigment found in plants.' },
    { id: generateId(), word: 'OXYGEN', clue: 'Gas released by plants during photosynthesis.' },
    { id: generateId(), word: 'CARBON', clue: 'Element found in all organic compounds.' },
    { id: generateId(), word: 'WATER', clue: 'H2O, essential for plant growth.' },
  ]);
  const [layout, setLayout] = useState<CrosswordLayout | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [title, setTitle] = useState('Science Vocabulary: Plants');
  
  // Bulk import state
  const [isBulkImport, setIsBulkImport] = useState(false);
  const [bulkText, setBulkText] = useState('');

  useEffect(() => {
    handleGenerate();
  }, []);

  const handleAddWord = () => {
    if (words.length >= 50) {
      alert('Maximum 50 words allowed.');
      return;
    }
    setWords([...words, { id: generateId(), word: '', clue: '' }]);
  };

  const handleRemoveWord = (id: string) => {
    setWords(words.filter(w => w.id !== id));
  };

  const handleChange = (id: string, field: 'word' | 'clue', value: string) => {
    setWords(words.map(w => w.id === id ? { ...w, [field]: value } : w));
  };

  const handleGenerate = () => {
    const validWords = words.filter(w => w.word.trim() !== '' && w.clue.trim() !== '');
    if (validWords.length === 0) {
      setLayout(null);
      return;
    }
    const newLayout = generateCrossword(validWords);
    setLayout(newLayout);
  };

  const handleBulkImport = () => {
    const lines = bulkText.split('\n');
    const newWords: WordInput[] = [];
    
    for (const line of lines) {
      if (line.trim() === '') continue;
      // Try to split by common separators: "-", ":", "\t"
      const separatorMatch = line.match(/[-:\t]/);
      if (separatorMatch) {
        const separator = separatorMatch[0];
        const [word, ...clueParts] = line.split(separator);
        const clue = clueParts.join(separator).trim();
        if (word.trim() && clue) {
          newWords.push({
            id: generateId(),
            word: word.trim(),
            clue: clue
          });
        }
      }
    }

    if (newWords.length > 0) {
      // Merge or replace? Let's replace for simplicity, or append up to 50.
      const combined = [...words.filter(w => w.word.trim() !== ''), ...newWords].slice(0, 50);
      setWords(combined);
      setIsBulkImport(false);
      setBulkText('');
      // Need to wait for state update to generate, but we can just call generate with combined
      setLayout(generateCrossword(combined));
    } else {
      alert('Could not parse any words. Please ensure format is "Word - Clue"');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculate dynamic cell size for print to fit page
  const getCellSize = () => {
    if (!layout) return '2rem';
    const maxDim = Math.max(layout.cols, layout.rows);
    // Max width ~700px. 700 / maxDim
    const sizePx = Math.floor(700 / maxDim);
    return `${Math.min(32, Math.max(16, sizePx))}px`;
  };

  const cellSize = getCellSize();

  return (
    <div className="min-h-screen bg-stone-100 font-sans text-stone-900 flex flex-col">
      {/* Header - Hidden on Print */}
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 print:hidden shadow-sm">
        <div>
          <h1 className="text-xl font-bold font-serif text-stone-800">Crossword Creator</h1>
          <p className="text-sm text-stone-500">Teacher Tools</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAnswers(!showAnswers)}
            className="px-4 py-2 text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
          >
            {showAnswers ? 'Hide Answers' : 'Show Answers'}
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
          >
            <Printer size={16} />
            Print Puzzle
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden print:overflow-visible print:block">
        
        {/* Left Sidebar - Input Area - Hidden on Print */}
        <aside className="w-full lg:w-96 bg-white border-r border-stone-200 flex flex-col h-[calc(100vh-73px)] print:hidden">
          <div className="p-4 border-b border-stone-200 bg-stone-50">
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Puzzle Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-serif text-lg"
              placeholder="e.g., Chapter 4 Vocabulary"
            />
          </div>

          <div className="flex border-b border-stone-200">
            <button 
              className={`flex-1 py-3 text-sm font-medium text-center ${!isBulkImport ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-stone-500 hover:text-stone-700'}`}
              onClick={() => setIsBulkImport(false)}
            >
              Manual Entry
            </button>
            <button 
              className={`flex-1 py-3 text-sm font-medium text-center ${isBulkImport ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-stone-500 hover:text-stone-700'}`}
              onClick={() => setIsBulkImport(true)}
            >
              Bulk Import
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {isBulkImport ? (
              <div className="space-y-4">
                <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-sm flex gap-2 items-start">
                  <Info size={16} className="mt-0.5 shrink-0" />
                  <p>Paste your words and clues separated by a hyphen, colon, or tab. One pair per line.</p>
                </div>
                <textarea
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  className="w-full h-64 p-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                  placeholder="PHOTOSYNTHESIS - Process by which plants make food&#10;CHLOROPHYLL - Green pigment in plants"
                />
                <button 
                  onClick={handleBulkImport}
                  className="w-full py-2 bg-stone-800 text-white rounded-md hover:bg-stone-900 transition-colors font-medium"
                >
                  Import Words
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    Words ({words.filter(w => w.word.trim() !== '').length}/50)
                  </span>
                  <button 
                    onClick={handleAddWord}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Word
                  </button>
                </div>
                
                {words.map((word, index) => (
                  <div key={word.id} className="bg-stone-50 p-3 rounded-lg border border-stone-200 relative group">
                    <button 
                      onClick={() => handleRemoveWord(word.id)}
                      className="absolute -top-2 -right-2 bg-white text-red-500 border border-stone-200 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                      title="Remove word"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="space-y-2">
                      <input 
                        type="text" 
                        value={word.word}
                        onChange={(e) => handleChange(word.id, 'word', e.target.value)}
                        placeholder="WORD"
                        className="w-full px-2 py-1.5 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase font-mono text-sm"
                      />
                      <textarea 
                        value={word.clue}
                        onChange={(e) => handleChange(word.id, 'clue', e.target.value)}
                        placeholder="Clue description..."
                        rows={2}
                        className="w-full px-2 py-1.5 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                      />
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={handleAddWord}
                  className="w-full py-3 border-2 border-dashed border-stone-300 text-stone-500 rounded-lg hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Plus size={18} /> Add Another Word
                </button>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-stone-200 bg-white">
            <button 
              onClick={handleGenerate}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2 shadow-sm"
            >
              <RefreshCw size={18} /> Generate Puzzle
            </button>
          </div>
        </aside>

        {/* Right Area - Preview & Print */}
        <div className="flex-1 overflow-y-auto bg-stone-200/50 p-4 lg:p-8 print:p-0 print:bg-white print:overflow-visible">
          
          {layout ? (
            <div className="max-w-4xl mx-auto space-y-8 print:space-y-0 print:max-w-none">
              
              {/* Unplaced Words Warning */}
              {layout.unplacedWords.length > 0 && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-md print:hidden shadow-sm">
                  <div className="flex items-start">
                    <AlertCircle className="text-amber-500 mt-0.5 mr-3 shrink-0" size={20} />
                    <div>
                      <h3 className="text-sm font-medium text-amber-800">Could not place {layout.unplacedWords.length} word(s)</h3>
                      <p className="text-sm text-amber-700 mt-1">
                        The generator couldn't find a valid intersection for: {layout.unplacedWords.map(w => w.word).join(', ')}. 
                        Try adding more words to create more intersection opportunities.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 1: The Puzzle */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-200 print:shadow-none print:border-none print:p-0 print:m-0">
                
                {/* Web Preview Header */}
                <div className="text-center mb-8 print:hidden">
                  <h2 className="text-3xl font-serif font-bold text-stone-900">{title}</h2>
                  <p className="text-stone-500 mt-2 uppercase tracking-widest text-xs font-semibold">Crossword Puzzle</p>
                </div>

                {/* Premium Print Header */}
                <div className="hidden print:block mb-12">
                  <div className="flex justify-between items-end border-b-2 border-stone-800 pb-4 mb-8">
                    <div>
                      <h2 className="text-4xl font-serif font-bold text-stone-900 tracking-tight">{title}</h2>
                      <p className="text-stone-500 font-sans mt-2 uppercase tracking-widest text-xs font-semibold">Crossword Puzzle</p>
                    </div>
                    <div className="flex gap-8 text-sm font-sans text-stone-600">
                      <div className="flex flex-col">
                        <span className="uppercase text-[10px] font-bold tracking-wider text-stone-400 mb-1">Name</span>
                        <div className="w-48 border-b border-stone-400 h-4"></div>
                      </div>
                      <div className="flex flex-col">
                        <span className="uppercase text-[10px] font-bold tracking-wider text-stone-400 mb-1">Date</span>
                        <div className="w-32 border-b border-stone-400 h-4"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center overflow-x-auto pb-4 print:pb-0 print:overflow-visible">
                  <div 
                    className="grid"
                    style={{
                      gridTemplateColumns: `repeat(${layout.cols}, ${cellSize})`,
                    }}
                  >
                    {layout.grid.map((row, y) =>
                      row.map((cell, x) => (
                        <div
                          key={`${x}-${y}`}
                          className={`relative flex items-center justify-center ${cell ? 'bg-white border border-stone-800' : 'bg-transparent'}`}
                          style={{ 
                            height: cellSize,
                            marginLeft: cell && x > 0 && row[x-1] ? '-1px' : '0',
                            marginTop: cell && y > 0 && layout.grid[y-1][x] ? '-1px' : '0',
                            zIndex: cell ? 10 : 0
                          }}
                        >
                          {cell && cell.number && (
                            <span className="absolute top-0.5 left-0.5 text-[10px] sm:text-xs leading-none font-bold text-stone-800 select-none">
                              {cell.number}
                            </span>
                          )}
                          {cell && showAnswers && (
                            <span className="text-lg font-bold uppercase text-indigo-700 select-none font-sans">
                              {cell.letter}
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* PAGE 2: The Clues */}
              <div className="page-break bg-white p-8 rounded-xl shadow-sm border border-stone-200 print:shadow-none print:border-none print:p-0 print:m-0 print:pt-12">
                <div className="hidden print:block mb-10 text-center">
                  <h2 className="text-3xl font-serif font-bold text-stone-900">{title}</h2>
                  <p className="text-stone-500 font-sans mt-2 uppercase tracking-widest text-xs font-semibold">Clues</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2 print:gap-16">
                  {/* Across Clues */}
                  <div>
                    <h3 className="text-xl font-serif font-bold text-stone-900 border-b border-stone-300 pb-3 mb-6">Across</h3>
                    <ul className="space-y-4">
                      {layout.placedWords
                        .filter(w => w.direction === 'across')
                        .sort((a, b) => a.number - b.number)
                        .map(w => (
                          <li key={w.id} className="flex gap-4 text-stone-800 leading-relaxed">
                            <span className="font-bold font-sans text-stone-900 shrink-0 w-6 text-right">{w.number}.</span>
                            <span className="font-serif text-lg">
                              {w.clue}
                              {showAnswers && <span className="ml-2 text-indigo-600 font-sans text-sm uppercase font-semibold">[{w.word}]</span>}
                            </span>
                          </li>
                        ))}
                      {layout.placedWords.filter(w => w.direction === 'across').length === 0 && (
                        <li className="text-stone-400 italic font-serif">No across words.</li>
                      )}
                    </ul>
                  </div>

                  {/* Down Clues */}
                  <div>
                    <h3 className="text-xl font-serif font-bold text-stone-900 border-b border-stone-300 pb-3 mb-6">Down</h3>
                    <ul className="space-y-4">
                      {layout.placedWords
                        .filter(w => w.direction === 'down')
                        .sort((a, b) => a.number - b.number)
                        .map(w => (
                          <li key={w.id} className="flex gap-4 text-stone-800 leading-relaxed">
                            <span className="font-bold font-sans text-stone-900 shrink-0 w-6 text-right">{w.number}.</span>
                            <span className="font-serif text-lg">
                              {w.clue}
                              {showAnswers && <span className="ml-2 text-indigo-600 font-sans text-sm uppercase font-semibold">[{w.word}]</span>}
                            </span>
                          </li>
                        ))}
                      {layout.placedWords.filter(w => w.direction === 'down').length === 0 && (
                        <li className="text-stone-400 italic font-serif">No down words.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-stone-400 print:hidden">
              <div className="w-24 h-24 border-4 border-dashed border-stone-300 rounded-xl flex items-center justify-center mb-4">
                <span className="font-serif text-4xl text-stone-300">?</span>
              </div>
              <p className="text-lg font-medium text-stone-500">No puzzle generated yet</p>
              <p className="text-sm max-w-sm text-center mt-2">Add some words and clues on the left, then click "Generate Puzzle" to see it here.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
