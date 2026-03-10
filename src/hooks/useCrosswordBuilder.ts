import { useState, useCallback, useEffect } from 'react';
import { generateCrossword, WordInput, CrosswordLayout } from '../lib/crossword';

const generateId = () => Math.random().toString(36).substr(2, 9);

export function useCrosswordBuilder() {
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

  const generate = useCallback((wordList: WordInput[]) => {
    const validWords = wordList.filter(w => w.word.trim() !== '' && w.clue.trim() !== '');
    if (validWords.length === 0) {
      setLayout(null);
      return;
    }
    const newLayout = generateCrossword(validWords);
    setLayout(newLayout);
  }, []);

  const handleGenerate = useCallback(() => {
    generate(words);
  }, [words, generate]);

  // Initial generation on mount
  useEffect(() => {
    generate(words);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddWord = useCallback(() => {
    setWords(prev => {
      if (prev.length >= 50) {
        alert('Maximum 50 words allowed.');
        return prev;
      }
      return [...prev, { id: generateId(), word: '', clue: '' }];
    });
  }, []);

  const handleRemoveWord = useCallback((id: string) => {
    setWords(prev => prev.filter(w => w.id !== id));
  }, []);

  const handleClearWords = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all words?')) {
      setWords([]);
      setLayout(null);
    }
  }, []);

  const handleChange = useCallback((id: string, field: 'word' | 'clue', value: string) => {
    setWords(prev => prev.map(w => w.id === id ? { ...w, [field]: value } : w));
  }, []);

  const handleBulkImport = useCallback((bulkText: string) => {
    const lines = bulkText.split('\n');
    const newWords: WordInput[] = [];

    for (const line of lines) {
      if (line.trim() === '') continue;
      const separatorMatch = line.match(/[-:\t]/);
      if (separatorMatch) {
        const separator = separatorMatch[0];
        const [word, ...clueParts] = line.split(separator);
        const clue = clueParts.join(separator).trim();
        // Basic validation: word contains letters
        const cleanWord = word.trim().toUpperCase().replace(/[^A-Z]/g, '');
        if (cleanWord && clue) {
          newWords.push({
            id: generateId(),
            word: cleanWord,
            clue: clue
          });
        }
      }
    }

    if (newWords.length > 0) {
      setWords(prev => {
        const combined = [...prev.filter(w => w.word.trim() !== ''), ...newWords].slice(0, 50);
        generate(combined);
        return combined;
      });
      return true;
    }
    return false;
  }, []);

  const toggleShowAnswers = useCallback(() => {
    setShowAnswers(prev => !prev);
  }, []);

  return {
    words,
    layout,
    showAnswers,
    title,
    setTitle,
    handleAddWord,
    handleRemoveWord,
    handleClearWords,
    handleChange,
    handleGenerate,
    handleBulkImport,
    toggleShowAnswers
  };
}
