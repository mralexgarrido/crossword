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

export function generateCrossword(words: WordInput[]): CrosswordLayout {
  const cleanWords = words
    .map((w) => ({
      ...w,
      originalWord: w.word,
      word: w.word.toUpperCase().replace(/[^A-Z]/g, ''),
    }))
    .filter((w) => w.word.length > 0);

  // Sort by length descending to place longest words first
  cleanWords.sort((a, b) => b.word.length - a.word.length);

  const GRID_SIZE = 200;
  const CENTER = Math.floor(GRID_SIZE / 2);
  const grid: (string | null)[][] = Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(null));
  const placedWords: PlacedWord[] = [];
  const unplacedWords: WordInput[] = [];

  function getCell(x: number, y: number) {
    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return null;
    return grid[y][x];
  }

  function canPlace(
    word: string,
    startX: number,
    startY: number,
    dir: Direction
  ): boolean {
    const L = word.length;
    if (dir === 'across') {
      if (
        startX < 0 ||
        startX + L >= GRID_SIZE ||
        startY < 0 ||
        startY >= GRID_SIZE
      )
        return false;
      if (getCell(startX - 1, startY) !== null) return false;
      if (getCell(startX + L, startY) !== null) return false;

      for (let i = 0; i < L; i++) {
        const x = startX + i;
        const y = startY;
        const cell = getCell(x, y);
        if (cell !== null && cell !== word[i]) return false;
        if (cell === null) {
          if (getCell(x, y - 1) !== null) return false;
          if (getCell(x, y + 1) !== null) return false;
        }
      }
    } else {
      if (
        startX < 0 ||
        startX >= GRID_SIZE ||
        startY < 0 ||
        startY + L >= GRID_SIZE
      )
        return false;
      if (getCell(startX, startY - 1) !== null) return false;
      if (getCell(startX, startY + L) !== null) return false;

      for (let i = 0; i < L; i++) {
        const x = startX;
        const y = startY + i;
        const cell = getCell(x, y);
        if (cell !== null && cell !== word[i]) return false;
        if (cell === null) {
          if (getCell(x - 1, y) !== null) return false;
          if (getCell(x + 1, y) !== null) return false;
        }
      }
    }
    return true;
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
    let bestScore = Infinity;

    for (let i = 0; i < w.word.length; i++) {
      const letter = w.word[i];
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          if (grid[y][x] === letter) {
            // Try across
            if (canPlace(w.word, x - i, y, 'across')) {
              let minX = x - i,
                maxX = x - i + w.word.length;
              let minY = y,
                maxY = y;
              for (const pw of placedWords) {
                minX = Math.min(minX, pw.x);
                maxX = Math.max(
                  maxX,
                  pw.direction === 'across' ? pw.x + pw.word.length : pw.x
                );
                minY = Math.min(minY, pw.y);
                maxY = Math.max(
                  maxY,
                  pw.direction === 'down' ? pw.y + pw.word.length : pw.y
                );
              }
              const score = (maxX - minX) * (maxY - minY);

              if (score < bestScore) {
                bestScore = score;
                bestPlacement = { x: x - i, y, dir: 'across' as Direction };
              }
            }
            // Try down
            if (canPlace(w.word, x, y - i, 'down')) {
              let minX = x,
                maxX = x;
              let minY = y - i,
                maxY = y - i + w.word.length;
              for (const pw of placedWords) {
                minX = Math.min(minX, pw.x);
                maxX = Math.max(
                  maxX,
                  pw.direction === 'across' ? pw.x + pw.word.length : pw.x
                );
                minY = Math.min(minY, pw.y);
                maxY = Math.max(
                  maxY,
                  pw.direction === 'down' ? pw.y + pw.word.length : pw.y
                );
              }
              const score = (maxX - minX) * (maxY - minY);

              if (score < bestScore) {
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

  // Calculate bounds
  let minX = GRID_SIZE,
    maxX = 0,
    minY = GRID_SIZE,
    maxY = 0;
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

  // Create final grid
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

  // Adjust placedWords coordinates to match finalGrid
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
