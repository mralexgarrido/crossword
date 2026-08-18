import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateCrossword, WordInput, CrosswordLayout, Direction } from '../lib/crossword';
import { PRESET_THEMES } from '../lib/presets';

const generateId = () => Math.random().toString(36).substring(2, 9);

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
  const [showWordBank, setShowWordBank] = useState(false);
  const [showLetterCounts, setShowLetterCounts] = useState(true);
  const [title, setTitle] = useState('Science Vocabulary: Plants');
  const [mode, setMode] = useState<'builder' | 'play'>('builder');

  // Interactive Play Mode State
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [focusedCell, setFocusedCell] = useState<{ x: number; y: number } | null>(null);
  const [direction, setDirection] = useState<Direction>('across');
  const [checkedCells, setCheckedCells] = useState<{ [key: string]: 'correct' | 'incorrect' }>({});
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generate = useCallback((wordList: WordInput[]) => {
    const validWords = wordList.filter(w => w.word.trim() !== '' && w.clue.trim() !== '');
    if (validWords.length === 0) {
      setLayout(null);
      setUserAnswers({});
      setIsCompleted(false);
      return;
    }
    const newLayout = generateCrossword(validWords);
    setLayout(newLayout);
    setUserAnswers({});
    setCheckedCells({});
    setIsCompleted(false);
    setElapsedTime(0);

    // Set initial focused cell on first placed word if available
    if (newLayout.placedWords.length > 0) {
      const first = newLayout.placedWords[0];
      setFocusedCell({ x: first.x, y: first.y });
      setDirection(first.direction);
    } else {
      setFocusedCell(null);
    }
  }, []);

  const handleGenerate = useCallback(() => {
    generate(words);
  }, [words, generate]);

  const handleReshuffle = useCallback(() => {
    // Generate new layout variation
    if (words.length > 0) {
      generate(words);
    }
  }, [words, generate]);

  // Initial generation on mount
  useEffect(() => {
    generate(words);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer logic for Play mode
  useEffect(() => {
    if (mode === 'play' && !isCompleted && isTimerRunning) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode, isCompleted, isTimerRunning]);

  // Check completion whenever userAnswers change in play mode
  useEffect(() => {
    if (!layout || mode !== 'play' || isCompleted) return;

    let totalCells = 0;
    let correctCells = 0;

    for (let y = 0; y < layout.grid.length; y++) {
      for (let x = 0; x < layout.grid[y].length; x++) {
        const cell = layout.grid[y][x];
        if (cell) {
          totalCells++;
          const key = `${x},${y}`;
          if (userAnswers[key] === cell.letter.toUpperCase()) {
            correctCells++;
          }
        }
      }
    }

    if (totalCells > 0 && correctCells === totalCells) {
      setIsCompleted(true);
      setIsTimerRunning(false);
    }
  }, [userAnswers, layout, mode, isCompleted]);

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
      setUserAnswers({});
      setIsCompleted(false);
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
  }, [generate]);

  const applyPresetTheme = useCallback((presetId: string) => {
    const theme = PRESET_THEMES.find(t => t.id === presetId);
    if (!theme) return;
    const formattedWords: WordInput[] = theme.words.map(w => ({
      id: generateId(),
      word: w.word,
      clue: w.clue
    }));
    setTitle(theme.title);
    setWords(formattedWords);
    generate(formattedWords);
  }, [generate]);

  const toggleShowAnswers = useCallback(() => {
    setShowAnswers(prev => !prev);
  }, []);

  const toggleMode = useCallback(() => {
    setMode(prev => {
      const nextMode = prev === 'builder' ? 'play' : 'builder';
      if (nextMode === 'play') {
        setIsTimerRunning(true);
      } else {
        setIsTimerRunning(false);
      }
      return nextMode;
    });
  }, []);

  // Helper functions for cell navigation
  const getNextCell = useCallback((x: number, y: number, dir: Direction, step = 1) => {
    if (!layout) return null;
    const nx = dir === 'across' ? x + step : x;
    const ny = dir === 'down' ? y + step : y;
    if (ny >= 0 && ny < layout.grid.length && nx >= 0 && nx < layout.grid[ny].length) {
      if (layout.grid[ny][nx]) {
        return { x: nx, y: ny };
      }
    }
    return null;
  }, [layout]);

  const handleCellClick = useCallback((x: number, y: number) => {
    if (!layout || !layout.grid[y][x]) return;

    if (focusedCell && focusedCell.x === x && focusedCell.y === y) {
      // Toggle direction if clicking same cell
      setDirection(prev => (prev === 'across' ? 'down' : 'across'));
    } else {
      setFocusedCell({ x, y });
    }
  }, [focusedCell, layout]);

  const handleCellInputChange = useCallback((letter: string) => {
    if (!focusedCell || !layout) return;

    const char = letter.toUpperCase().slice(-1);
    if (char >= 'A' && char <= 'Z') {
      const key = `${focusedCell.x},${focusedCell.y}`;
      setUserAnswers(prev => ({ ...prev, [key]: char }));
      // Clear checked status for this cell
      setCheckedCells(prev => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });

      // Advance to next cell in current direction
      const next = getNextCell(focusedCell.x, focusedCell.y, direction, 1);
      if (next) {
        setFocusedCell(next);
      }
    }
  }, [focusedCell, layout, direction, getNextCell]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!focusedCell || !layout || mode !== 'play') return;

    const { x, y } = focusedCell;

    if (e.key === 'Backspace') {
      e.preventDefault();
      const key = `${x},${y}`;
      if (userAnswers[key]) {
        setUserAnswers(prev => {
          const copy = { ...prev };
          delete copy[key];
          return copy;
        });
      } else {
        // Move back
        const prev = getNextCell(x, y, direction, -1);
        if (prev) {
          setFocusedCell(prev);
          const prevKey = `${prev.x},${prev.y}`;
          setUserAnswers(a => {
            const copy = { ...a };
            delete copy[prevKey];
            return copy;
          });
        }
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setDirection('across');
      const next = getNextCell(x, y, 'across', 1);
      if (next) setFocusedCell(next);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setDirection('across');
      const prev = getNextCell(x, y, 'across', -1);
      if (prev) setFocusedCell(prev);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setDirection('down');
      const next = getNextCell(x, y, 'down', 1);
      if (next) setFocusedCell(next);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setDirection('down');
      const prev = getNextCell(x, y, 'down', -1);
      if (prev) setFocusedCell(prev);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Jump to next word start
      if (layout.placedWords.length > 0) {
        const currentIdx = layout.placedWords.findIndex(w => w.x === x && w.y === y);
        const nextIdx = (currentIdx + 1) % layout.placedWords.length;
        const nextWord = layout.placedWords[nextIdx];
        setFocusedCell({ x: nextWord.x, y: nextWord.y });
        setDirection(nextWord.direction);
      }
    }
  }, [focusedCell, layout, mode, userAnswers, direction, getNextCell]);

  // Hint actions
  const checkLetter = useCallback(() => {
    if (!focusedCell || !layout) return;
    const { x, y } = focusedCell;
    const cell = layout.grid[y][x];
    if (!cell) return;

    const key = `${x},${y}`;
    const userVal = userAnswers[key];
    if (!userVal) return;

    setCheckedCells(prev => ({
      ...prev,
      [key]: userVal === cell.letter.toUpperCase() ? 'correct' : 'incorrect'
    }));
  }, [focusedCell, layout, userAnswers]);

  const revealLetter = useCallback(() => {
    if (!focusedCell || !layout) return;
    const { x, y } = focusedCell;
    const cell = layout.grid[y][x];
    if (!cell) return;

    const key = `${x},${y}`;
    setUserAnswers(prev => ({ ...prev, [key]: cell.letter.toUpperCase() }));
    setCheckedCells(prev => ({ ...prev, [key]: 'correct' }));
  }, [focusedCell, layout]);

  const checkWord = useCallback(() => {
    if (!focusedCell || !layout) return;
    const activeWord = layout.placedWords.find(w => {
      if (w.direction !== direction) return false;
      if (direction === 'across') {
        return focusedCell.y === w.y && focusedCell.x >= w.x && focusedCell.x < w.x + w.word.length;
      } else {
        return focusedCell.x === w.x && focusedCell.y >= w.y && focusedCell.y < w.y + w.word.length;
      }
    });

    if (!activeWord) return;

    const updates: { [key: string]: 'correct' | 'incorrect' } = {};
    for (let i = 0; i < activeWord.word.length; i++) {
      const cx = direction === 'across' ? activeWord.x + i : activeWord.x;
      const cy = direction === 'across' ? activeWord.y : activeWord.y + i;
      const cell = layout.grid[cy][cx];
      if (cell) {
        const key = `${cx},${cy}`;
        const userVal = userAnswers[key];
        if (userVal) {
          updates[key] = userVal === cell.letter.toUpperCase() ? 'correct' : 'incorrect';
        }
      }
    }
    setCheckedCells(prev => ({ ...prev, ...updates }));
  }, [focusedCell, layout, direction, userAnswers]);

  const revealWord = useCallback(() => {
    if (!focusedCell || !layout) return;
    const activeWord = layout.placedWords.find(w => {
      if (w.direction !== direction) return false;
      if (direction === 'across') {
        return focusedCell.y === w.y && focusedCell.x >= w.x && focusedCell.x < w.x + w.word.length;
      } else {
        return focusedCell.x === w.x && focusedCell.y >= w.y && focusedCell.y < w.y + w.word.length;
      }
    });

    if (!activeWord) return;

    const answerUpdates: { [key: string]: string } = {};
    const checkUpdates: { [key: string]: 'correct' | 'incorrect' } = {};

    for (let i = 0; i < activeWord.word.length; i++) {
      const cx = direction === 'across' ? activeWord.x + i : activeWord.x;
      const cy = direction === 'across' ? activeWord.y : activeWord.y + i;
      const cell = layout.grid[cy][cx];
      if (cell) {
        const key = `${cx},${cy}`;
        answerUpdates[key] = cell.letter.toUpperCase();
        checkUpdates[key] = 'correct';
      }
    }
    setUserAnswers(prev => ({ ...prev, ...answerUpdates }));
    setCheckedCells(prev => ({ ...prev, ...checkUpdates }));
  }, [focusedCell, layout, direction]);

  const checkPuzzle = useCallback(() => {
    if (!layout) return;
    const updates: { [key: string]: 'correct' | 'incorrect' } = {};
    for (let y = 0; y < layout.grid.length; y++) {
      for (let x = 0; x < layout.grid[y].length; x++) {
        const cell = layout.grid[y][x];
        if (cell) {
          const key = `${x},${y}`;
          const userVal = userAnswers[key];
          if (userVal) {
            updates[key] = userVal === cell.letter.toUpperCase() ? 'correct' : 'incorrect';
          }
        }
      }
    }
    setCheckedCells(updates);
  }, [layout, userAnswers]);

  const revealPuzzle = useCallback(() => {
    if (!layout) return;
    const answerUpdates: { [key: string]: string } = {};
    const checkUpdates: { [key: string]: 'correct' | 'incorrect' } = {};

    for (let y = 0; y < layout.grid.length; y++) {
      for (let x = 0; x < layout.grid[y].length; x++) {
        const cell = layout.grid[y][x];
        if (cell) {
          const key = `${x},${y}`;
          answerUpdates[key] = cell.letter.toUpperCase();
          checkUpdates[key] = 'correct';
        }
      }
    }
    setUserAnswers(answerUpdates);
    setCheckedCells(checkUpdates);
  }, [layout]);

  const resetPlayState = useCallback(() => {
    setUserAnswers({});
    setCheckedCells({});
    setElapsedTime(0);
    setIsCompleted(false);
    setIsTimerRunning(true);
  }, []);

  // JSON Save / Load
  const exportJSON = useCallback(() => {
    const data = {
      title,
      words,
      showWordBank,
      showLetterCounts,
      exportedAt: new Date().toISOString()
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_crossword.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [title, words, showWordBank, showLetterCounts]);

  const importJSON = useCallback((jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (Array.isArray(parsed.words)) {
        setTitle(parsed.title || 'Imported Crossword');
        if (typeof parsed.showWordBank === 'boolean') setShowWordBank(parsed.showWordBank);
        if (typeof parsed.showLetterCounts === 'boolean') setShowLetterCounts(parsed.showLetterCounts);
        setWords(parsed.words);
        generate(parsed.words);
        return true;
      }
    } catch {
      alert('Invalid JSON file format.');
    }
    return false;
  }, [generate]);

  return {
    words,
    layout,
    showAnswers,
    showWordBank,
    showLetterCounts,
    title,
    mode,
    userAnswers,
    focusedCell,
    direction,
    checkedCells,
    elapsedTime,
    isTimerRunning,
    isCompleted,
    setTitle,
    setShowWordBank,
    setShowLetterCounts,
    setMode,
    setIsTimerRunning,
    handleAddWord,
    handleRemoveWord,
    handleClearWords,
    handleChange,
    handleGenerate,
    handleReshuffle,
    handleBulkImport,
    toggleShowAnswers,
    toggleMode,
    applyPresetTheme,
    handleCellClick,
    handleCellInputChange,
    handleKeyDown,
    checkLetter,
    revealLetter,
    checkWord,
    revealWord,
    checkPuzzle,
    revealPuzzle,
    resetPlayState,
    exportJSON,
    importJSON
  };
}
