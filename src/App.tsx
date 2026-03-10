import React from 'react';
import { useCrosswordBuilder } from './hooks/useCrosswordBuilder';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { PuzzlePreview } from './components/PuzzlePreview';

export default function App() {
  const {
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
  } = useCrosswordBuilder();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      <Header
        showAnswers={showAnswers}
        onToggleAnswers={toggleShowAnswers}
        onPrint={handlePrint}
      />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden print:overflow-visible print:block relative">
        <Sidebar
          title={title}
          setTitle={setTitle}
          words={words}
          onAddWord={handleAddWord}
          onRemoveWord={handleRemoveWord}
          onClearWords={handleClearWords}
          onChangeWord={handleChange}
          onGenerate={handleGenerate}
          onBulkImport={handleBulkImport}
        />

        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 lg:p-8 print:p-0 print:bg-white print:overflow-visible relative">
          <div className="relative z-10">
            <PuzzlePreview
              layout={layout}
              title={title}
              showAnswers={showAnswers}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
