export type Direction = 'across' | 'down';

export interface WordInput {
  id: string;
  word: string;
  clue: string;
}

export interface PlacedWord extends WordInput {
  x: number;
  y: number;
  direction: Direction;
  number: number;
}

export interface GridCell {
  letter: string;
  number?: number;
}

export interface CrosswordLayout {
  grid: (GridCell | null)[][];
  placedWords: PlacedWord[];
  unplacedWords: WordInput[];
  cols: number;
  rows: number;
}

function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

function generateLayoutAttempt(cleanWords: WordInput[]): CrosswordLayout | null {
  const GRID_SIZE = 200;
  const CENTER = Math.floor(GRID_SIZE / 2);
  const grid: (string | null)[][] = Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(null));
  const placedWords: PlacedWord[] = [];
  const unplacedWords: WordInput[] = [];

  let minGridX = GRID_SIZE, maxGridX = 0;
  let minGridY = GRID_SIZE, maxGridY = 0;

  function updateBounds(x: number, y: number, length: number, dir: Direction) {
    minGridX = Math.min(minGridX, x);
    minGridY = Math.min(minGridY, y);
    if (dir === 'across') {
      maxGridX = Math.max(maxGridX, x + length - 1);
      maxGridY = Math.max(maxGridY, y);
    } else {
      maxGridX = Math.max(maxGridX, x);
      maxGridY = Math.max(maxGridY, y + length - 1);
    }
  }

  function getCell(x: number, y: number) {
    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return null;
    return grid[y][x];
  }

  function canPlace(
    word: string,
    startX: number,
    startY: number,
    dir: Direction
  ): { valid: boolean; intersections: number } {
    const L = word.length;
    let intersections = 0;

    if (dir === 'across') {
      if (
        startX < 0 ||
        startX + L >= GRID_SIZE ||
        startY < 0 ||
        startY >= GRID_SIZE
      )
        return { valid: false, intersections: 0 };
      if (getCell(startX - 1, startY) !== null) return { valid: false, intersections: 0 };
      if (getCell(startX + L, startY) !== null) return { valid: false, intersections: 0 };

      for (let i = 0; i < L; i++) {
        const x = startX + i;
        const y = startY;
        const cell = getCell(x, y);
        if (cell !== null) {
            if (cell !== word[i]) return { valid: false, intersections: 0 };
            intersections++;
        }
        if (cell === null) {
          if (getCell(x, y - 1) !== null) return { valid: false, intersections: 0 };
          if (getCell(x, y + 1) !== null) return { valid: false, intersections: 0 };
        }
      }
    } else {
      if (
        startX < 0 ||
        startX >= GRID_SIZE ||
        startY < 0 ||
        startY + L >= GRID_SIZE
      )
        return { valid: false, intersections: 0 };
      if (getCell(startX, startY - 1) !== null) return { valid: false, intersections: 0 };
      if (getCell(startX, startY + L) !== null) return { valid: false, intersections: 0 };

      for (let i = 0; i < L; i++) {
        const x = startX;
        const y = startY + i;
        const cell = getCell(x, y);
        if (cell !== null) {
            if (cell !== word[i]) return { valid: false, intersections: 0 };
            intersections++;
        }
        if (cell === null) {
          if (getCell(x - 1, y) !== null) return { valid: false, intersections: 0 };
          if (getCell(x + 1, y) !== null) return { valid: false, intersections: 0 };
        }
      }
    }
    // Cannot completely overlap another word (intersections == length)
    if (intersections === L) return { valid: false, intersections: 0 };
    return { valid: true, intersections };
  }

  function evaluatePlacement(
    word: string,
    startX: number,
    startY: number,
    dir: Direction,
    intersections: number
  ): number {
    let minX = startX;
    let maxX = dir === 'across' ? startX + word.length : startX;
    let minY = startY;
    let maxY = dir === 'down' ? startY + word.length : startY;

    // Expand bounds by current grid bounds to see new area
    minX = Math.min(minX, minGridX === GRID_SIZE ? startX : minGridX);
    maxX = Math.max(maxX, maxGridX === 0 ? startX : maxGridX);
    minY = Math.min(minY, minGridY === GRID_SIZE ? startY : minGridY);
    maxY = Math.max(maxY, maxGridY === 0 ? startY : maxGridY);

    const area = (maxX - minX + 1) * (maxY - minY + 1);

    // We want to maximize intersections and minimize area
    // A single intersection is worth a lot.
    return (intersections * 500) - area;
  }

  function placeWord(
    word: string,
    startX: number,
    startY: number,
    dir: Direction
  ) {
    for (let i = 0; i < word.length; i++) {
      if (dir === 'across') {
        grid[startY][startX + i] = word[i];
      } else {
        grid[startY + i][startX] = word[i];
      }
    }
  }

  for (const w of cleanWords) {
    if (placedWords.length === 0) {
      const startX = CENTER - Math.floor(w.word.length / 2);
      const startY = CENTER;
      placeWord(w.word, startX, startY, 'across');
      placedWords.push({
        ...w,
        x: startX,
        y: startY,
        direction: 'across',
        number: 0,
      });
      continue;
    }

    let bestPlacement = null;
    let bestScore = -Infinity;

    for (let i = 0; i < w.word.length; i++) {
      const letter = w.word[i];
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          if (grid[y][x] === letter) {
            // Try across
            const acrossCheck = canPlace(w.word, x - i, y, 'across');
            if (acrossCheck.valid) {
              const score = evaluatePlacement(w.word, x - i, y, 'across', acrossCheck.intersections);
              if (score > bestScore) {
                bestScore = score;
                bestPlacement = { x: x - i, y, dir: 'across' as Direction };
            }
            }
            // Try down
            const downCheck = canPlace(w.word, x, y - i, 'down');
            if (downCheck.valid) {
              const score = evaluatePlacement(w.word, x, y - i, 'down', downCheck.intersections);
              if (score > bestScore) {
                bestScore = score;
                bestPlacement = { x, y: y - i, dir: 'down' as Direction };
            }
          }
        }
      }
    }
    }

    if (bestPlacement) {
      placeWord(w.word, bestPlacement.x, bestPlacement.y, bestPlacement.dir);
      updateBounds(bestPlacement.x, bestPlacement.y, w.word.length, bestPlacement.dir);
      placedWords.push({
        ...w,
        x: bestPlacement.x,
        y: bestPlacement.y,
        direction: bestPlacement.dir,
        number: 0,
      });
    } else {
      unplacedWords.push(w);
    }
  }

  // Calculate bounds accurately
  let minX = GRID_SIZE, maxX = 0;
  let minY = GRID_SIZE, maxY = 0;
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (grid[y][x] !== null) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
    }
  }
  }

  // Number the words
  placedWords.sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y;
    return a.x - b.x;
  });

  let currentNumber = 1;
  const cellNumbers = new Map<string, number>();

  for (const pw of placedWords) {
    const key = `${pw.x},${pw.y}`;
    if (cellNumbers.has(key)) {
      pw.number = cellNumbers.get(key)!;
    } else {
      pw.number = currentNumber;
      cellNumbers.set(key, currentNumber);
      currentNumber++;
    }
  }

  const finalGrid: (GridCell | null)[][] = [];
  if (placedWords.length > 0) {
    for (let y = minY; y <= maxY; y++) {
      const row: (GridCell | null)[] = [];
      for (let x = minX; x <= maxX; x++) {
        if (grid[y][x] !== null) {
          const key = `${x},${y}`;
          row.push({
            letter: grid[y][x]!,
            number: cellNumbers.get(key),
          });
        } else {
          row.push(null);
        }
      }
      finalGrid.push(row);
    }
  }

  for (const pw of placedWords) {
    pw.x -= minX;
    pw.y -= minY;
  }

  return {
    grid: finalGrid,
    placedWords,
    unplacedWords,
    cols: maxX >= minX ? maxX - minX + 1 : 0,
    rows: maxY >= minY ? maxY - minY + 1 : 0,
  };
}

export function generateCrossword(words: WordInput[]): CrosswordLayout {
  const cleanWords = words
    .map((w) => ({
      ...w,
      originalWord: w.word,
      word: w.word.toUpperCase().replace(/[^A-Z]/g, ''),
    }))
    .filter((w) => w.word.length > 0);

  // Generate a few attempts to find the best layout
  let bestLayout: CrosswordLayout | null = null;
  let bestScore = -1;

  const NUM_ATTEMPTS = 50;

  for (let attempt = 0; attempt < NUM_ATTEMPTS; attempt++) {
    // First attempt tries the default sorted order (longest first)
    // Subsequent attempts shuffle the array slightly
    let attemptWords = [...cleanWords];

    if (attempt === 0) {
      attemptWords.sort((a, b) => b.word.length - a.word.length);
    } else if (attempt < 5) {
      // Small variation on length sort
      attemptWords.sort((a, b) => b.word.length - a.word.length + (Math.random() > 0.5 ? 1 : -1));
    } else {
      // Pure random shuffle
      attemptWords = shuffleArray(attemptWords);
      // Still heavily weight the first word to be a long one for a good spine
      attemptWords.sort((a, b) => {
        if (attemptWords.indexOf(a) === 0) return -1;
        if (attemptWords.indexOf(b) === 0) return 1;
        return 0;
      });
    }

    const layout = generateLayoutAttempt(attemptWords);
    if (!layout) continue;

    // Score layout: density is king
    // Higher placed words = good. Smaller area = good.
    const placedRatio = layout.placedWords.length / cleanWords.length;

    // Calculate bounding box area
    const area = Math.max(1, layout.cols * layout.rows);

    // Heuristic: We want to maximize words placed, and minimize grid area.
    // We heavily penalize unplaced words.
    let score = (layout.placedWords.length * 1000) - area;

    if (score > bestScore || !bestLayout) {
      bestScore = score;
      bestLayout = layout;
    }

    // If we placed everything and it's super dense, we can stop early
    if (layout.unplacedWords.length === 0 && area < (cleanWords.length * 15)) {
      break;
    }
  }

  return bestLayout!;
}
