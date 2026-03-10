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
    <div className="min-h-screen bg-stone-100 font-sans text-stone-900 flex flex-col">
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

        <div className="flex-1 overflow-y-auto bg-[#F4F1EA] p-4 lg:p-8 print:p-0 print:bg-white print:overflow-visible relative">
          <div className="absolute inset-0 opacity-5 pointer-events-none print:hidden" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
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
