import React from 'react'

const STEPS = [
  { label: 'Stammdaten', desc: 'Personalien & Zeitraum' },
  { label: 'Bewertung', desc: 'Kategorien & Bausteine' },
  { label: 'Vorschau', desc: 'Dokument prüfen' },
  { label: 'Export', desc: 'DOCX & PDF' },
]

export default function Stepper({ currentStep }) {
  return (
    <div className="flex items-start justify-between mb-8 relative">
      {/* Connecting line */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-navy-mid z-0" style={{ left: '3rem', right: '3rem' }} />

      {STEPS.map((step, idx) => {
        const stepNum = idx + 1
        const isCompleted = stepNum < currentStep
        const isActive = stepNum === currentStep

        return (
          <div key={idx} className="flex flex-col items-center z-10 flex-1">
            {/* Circle */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all
                ${isCompleted
                  ? 'bg-navy border-navy text-white'
                  : isActive
                  ? 'bg-navy border-navy text-white shadow-lg'
                  : 'bg-white border-gray-300 text-gray-400'
                }`}
            >
              {isCompleted ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                stepNum
              )}
            </div>
            {/* Label */}
            <div className={`mt-2 text-xs font-semibold text-center ${isActive ? 'text-navy' : isCompleted ? 'text-navy' : 'text-gray-400'}`}>
              {step.label}
            </div>
            <div className="text-xs text-gray-400 text-center hidden sm:block">{step.desc}</div>
          </div>
        )
      })}
    </div>
  )
}
