import React, { useEffect, useRef } from 'react'
import { useZeugnis } from '../context/ZeugnisContext.jsx'
import { replacePlaceholders, getKategorienForZeugnistyp, getBausteinText, getZeugnistypLabel } from '../utils/helpers.js'

const BEWERTUNGEN = ['Sehr gut', 'Gut', 'Solide', 'Ausreichend']

function LivePreview({ formData, bloecke }) {
  const titleLabel = getZeugnistypLabel(formData.zeugnistyp)
  return (
    <div className="bg-white shadow rounded-lg p-5 text-xs leading-relaxed font-serif" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Header */}
      <div className="flex justify-between items-end border-b-2 border-navy pb-2 mb-3" style={{ borderColor: '#1E2D4E' }}>
        <span className="font-bold text-sm" style={{ color: '#1E2D4E' }}>therapie kreuzplatz</span>
        <span className="text-gray-500 text-xs">Kreuzplatz 16 | 8008 Zürich</span>
      </div>
      {/* Title */}
      <div className="text-center font-bold my-3 tracking-widest text-sm" style={{ color: '#1E2D4E' }}>{titleLabel}</div>
      {/* Date */}
      {formData.ausstellungsdatum && (
        <div className="text-right text-xs text-gray-600 mb-3">Zürich, {formData.ausstellungsdatum}</div>
      )}
      {/* Paragraphs */}
      <div className="space-y-2">
        {bloecke.filter(b => b.text?.trim()).map((b, i) => (
          <p key={i} className="text-gray-800 text-xs leading-relaxed text-justify">
            {replacePlaceholders(b.text, formData)}
          </p>
        ))}
      </div>
      {/* Signature */}
      {bloecke.length > 0 && (
        <div className="flex justify-between mt-6 text-xs text-gray-700">
          <div>
            <div className="font-semibold">Therapie Kreuzplatz AG</div>
          </div>
          <div className="text-right">
            {formData.unterzeichnerName && <div className="font-semibold">{formData.unterzeichnerName}</div>}
            {formData.unterzeichnerFunktion && <div className="italic text-gray-500">{formData.unterzeichnerFunktion}</div>}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Step2_Bewertung() {
  const { formData, bloecke, setBloecke, updateBlock, textbausteine, setTextbausteine } = useZeugnis()
  const initialized = useRef(false)

  // Fetch textbausteine if not already loaded
  useEffect(() => {
    if (textbausteine.length === 0) {
      fetch('/api/textbausteine')
        .then((r) => r.json())
        .then((data) => setTextbausteine(data))
        .catch((e) => console.error('Failed to load textbausteine', e))
    }
  }, [])

  // Initialize bloecke when textbausteine are loaded or formData changes
  useEffect(() => {
    if (textbausteine.length === 0) return
    const kategorien = getKategorienForZeugnistyp(formData.zeugnistyp, formData.fachbereich)
    const newBloecke = kategorien.map((kat) => {
      const bewertung = formData.zeugnistyp === 'bestaetigung' ? 'Sehr gut' : formData.globalBewertung
      const text = getBausteinText(textbausteine, formData.fachbereich, kat, bewertung)
      return { kategorie: kat, bewertung, text, editiert: false, originalText: text }
    })
    setBloecke(newBloecke)
    initialized.current = true
  }, [textbausteine, formData.zeugnistyp, formData.fachbereich, formData.globalBewertung])

  function handleBewertungChange(kategorie, bewertung) {
    const text = getBausteinText(textbausteine, formData.fachbereich, kategorie, bewertung)
    updateBlock(kategorie, { bewertung, text, editiert: false, originalText: text })
  }

  function handleTextChange(kategorie, newText) {
    const block = bloecke.find((b) => b.kategorie === kategorie)
    const isEdited = newText !== (block?.originalText || '')
    updateBlock(kategorie, { text: newText, editiert: isEdited })
  }

  const isSpecialKat = (kat) =>
    ['Einleitung (Zwischenzeugnis)', 'Einleitung (Arbeitsbestätigung)', 'Einleitung (Praktikum)'].includes(kat)

  if (textbausteine.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-navy border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Textbausteine werden geladen…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-6">
      {/* Left panel: Kategorien */}
      <div className="flex-1 min-w-0 space-y-6">
        {bloecke.map((block) => {
          const showBewertung = !isSpecialKat(block.kategorie) && formData.zeugnistyp !== 'bestaetigung'
          return (
            <div key={block.kategorie} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              {/* Category header */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-navy text-sm">{block.kategorie}</h3>
                {block.editiert && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                    ✏️ Bearbeitet
                  </span>
                )}
              </div>

              {/* Bewertung pills */}
              {showBewertung && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {BEWERTUNGEN.map((bw) => (
                    <button
                      key={bw}
                      type="button"
                      onClick={() => handleBewertungChange(block.kategorie, bw)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all
                        ${
                          block.bewertung === bw
                            ? 'bg-navy border-navy text-white'
                            : 'bg-white border-gray-300 text-gray-600 hover:border-navy hover:text-navy'
                        }`}
                    >
                      {bw}
                    </button>
                  ))}
                </div>
              )}

              {/* Textarea */}
              <textarea
                value={block.text || ''}
                onChange={(e) => handleTextChange(block.kategorie, e.target.value)}
                rows={4}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent resize-y"
                placeholder="Textbaustein…"
              />
            </div>
          )
        })}
      </div>

      {/* Right panel: Live preview (sticky) */}
      <div className="w-80 flex-shrink-0 hidden lg:block">
        <div className="sticky top-6">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Live-Vorschau</div>
          <LivePreview formData={formData} bloecke={bloecke} />
        </div>
      </div>
    </div>
  )
}
