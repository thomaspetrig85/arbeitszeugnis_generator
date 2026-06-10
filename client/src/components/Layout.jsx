import React from 'react'

export default function Layout({ children, onShowArchive, onShowWizard, showArchive }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="bg-white border-b border-navy-mid shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <div>
            <div className="text-navy font-bold text-xl tracking-wide leading-none">
              therapie kreuzplatz
            </div>
            <div className="text-gray-500 text-xs mt-0.5 tracking-wider uppercase">
              Arbeitszeugnis Generator
            </div>
          </div>
          <nav className="ml-auto flex items-center gap-2">
            <button
              onClick={onShowWizard}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                !showArchive
                  ? 'bg-navy text-white'
                  : 'text-gray-500 hover:text-navy hover:bg-gray-100'
              }`}
            >
              ✏️ Neues Zeugnis
            </button>
            <button
              onClick={onShowArchive}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                showArchive
                  ? 'bg-navy text-white'
                  : 'text-gray-500 hover:text-navy hover:bg-gray-100'
              }`}
            >
              📁 Archiv
            </button>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
