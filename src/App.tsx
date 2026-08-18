import React, { useState } from 'react';
import { useCrosswordBuilder } from './hooks/useCrosswordBuilder';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { PuzzlePreview } from './components/PuzzlePreview';
import { InteractivePlayer } from './components/InteractivePlayer';
import { PresetModal } from './components/PresetModal';

export default function App() {
  const {
    words,
    layout,
    showAnswers,
    showWordBank,
    showLetterCounts,
    soundEnabled,
    themeMode,
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
    toggleSound,
    toggleThemeMode,
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
  } = useCrosswordBuilder();

  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const isDark = themeMode === 'dark';

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-200 ${
      isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-100 text-zinc-900'
    }`}>
      <Header
        mode={mode}
        showAnswers={showAnswers}
        soundEnabled={soundEnabled}
        themeMode={themeMode}
        onToggleSound={toggleSound}
        onToggleThemeMode={toggleThemeMode}
        onToggleMode={toggleMode}
        onToggleAnswers={toggleShowAnswers}
        onPrint={handlePrint}
        onOpenPresets={() => setIsPresetModalOpen(true)}
        onExportJSON={exportJSON}
        onImportJSON={importJSON}
      />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden print:overflow-visible print:block relative">
        {mode === 'builder' && (
          <Sidebar
            title={title}
            setTitle={setTitle}
            words={words}
            layout={layout}
            showWordBank={showWordBank}
            setShowWordBank={setShowWordBank}
            showLetterCounts={showLetterCounts}
            setShowLetterCounts={setShowLetterCounts}
            themeMode={themeMode}
            onAddWord={handleAddWord}
            onRemoveWord={handleRemoveWord}
            onClearWords={handleClearWords}
            onChangeWord={handleChange}
            onGenerate={handleGenerate}
            onReshuffle={handleReshuffle}
            onBulkImport={handleBulkImport}
            onOpenPresets={() => setIsPresetModalOpen(true)}
          />
        )}

        <div className={`flex-1 overflow-y-auto p-4 lg:p-8 print:p-0 print:bg-white print:overflow-visible relative ${
          isDark ? 'bg-zinc-900/40' : 'bg-zinc-100/50'
        }`}>
          <div className="relative z-10">
            {mode === 'builder' ? (
              <PuzzlePreview
                layout={layout}
                title={title}
                showAnswers={showAnswers}
                showWordBank={showWordBank}
                showLetterCounts={showLetterCounts}
              />
            ) : (
              layout && (
                <InteractivePlayer
                  layout={layout}
                  title={title}
                  showWordBank={showWordBank}
                  showLetterCounts={showLetterCounts}
                  userAnswers={userAnswers}
                  focusedCell={focusedCell}
                  direction={direction}
                  checkedCells={checkedCells}
                  elapsedTime={elapsedTime}
                  isTimerRunning={isTimerRunning}
                  isCompleted={isCompleted}
                  setIsTimerRunning={setIsTimerRunning}
                  onCellClick={handleCellClick}
                  onCellInputChange={handleCellInputChange}
                  onKeyDown={handleKeyDown}
                  onCheckLetter={checkLetter}
                  onCheckWord={checkWord}
                  onCheckPuzzle={checkPuzzle}
                  onRevealLetter={revealLetter}
                  onRevealWord={revealWord}
                  onRevealPuzzle={revealPuzzle}
                  onReset={resetPlayState}
                  onSwitchToBuilder={toggleMode}
                />
              )
            )}
          </div>
        </div>
      </main>

      <PresetModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        onSelectPreset={applyPresetTheme}
      />
    </div>
  );
}
