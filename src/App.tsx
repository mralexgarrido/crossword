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

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 flex flex-col">
      <Header
        mode={mode}
        showAnswers={showAnswers}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
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

        <div className="flex-1 overflow-y-auto bg-zinc-900/50 p-4 lg:p-8 print:p-0 print:bg-white print:overflow-visible relative">
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
