import React, { useState } from 'react'
import { useZeugnis } from '../context/ZeugnisContext.jsx'
import { replacePlaceholders, getZeugnistypLabel } from '../utils/helpers.js'

export default function Step3_Vorschau() {
  const { formData, bloecke, updateBlock } = useZeugnis()
  const [editingIdx, setEditingIdx] = useState(null)
  const [editValue, setEditValue] = useState('')
  const titleLabel = getZeugnistypLabel(formData.zeugnistyp)

  const emptyBlocks = bloecke.filter((b) => !b.text?.trim())
  const filledBlocks = bloecke.filter((b) => b.text?.trim())

  function startEdit(idx, rawText) {
    setEditingIdx(idx)
    setEditValue(rawText)
  }

  function commitEdit(block) {
    updateBlock(block.kategorie, { text: editValue, editiert: true })
    setEditingIdx(null)
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Warnings */}
      {emptyBlocks.length > 0 && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <div className="flex items-start gap-2">
            <span className="text-amber-500 text-lg">⚠️</span>
            <div>
              <p className="text-amber-800 font-semibold text-sm">Fehlende Textbausteine</p>
              <p className="text-amber-700 text-xs mt-0.5">
                Folgende Kategorien sind leer:{' '}
                {emptyBlocks.map((b) => b.kategorie).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* A4 Preview Card */}
      <div
        className="bg-white shadow-xl rounded-lg mx-auto"
        style={{
          padding: '30mm 18mm 20mm 22mm',
          fontFamily: 'Calibri, "Segoe UI", Arial, sans-serif',
          fontSize: '11pt',
          lineHeight: '1.6',
          minHeight: '297mm',
          maxWidth: '210mm',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            paddingBottom: '10px',
            borderBottom: '2px solid #1E2D4E',
            marginBottom: '28px',
          }}
        >
          <img
            src="/logo.png"
            alt="therapie kreuzplatz"
            style={{ height: '32px', objectFit: 'contain' }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div style={{ fontWeight: 'bold', fontSize: '14pt', color: '#1E2D4E', display: 'none' }}>
            therapie kreuzplatz
          </div>
          <div style={{ fontSize: '9pt', color: '#666', textAlign: 'right', lineHeight: '1.4' }}>
            Kreuzplatz 16 | 8008 Zürich
            <br />
            044 260 95 95
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '16pt',
            color: '#1E2D4E',
            letterSpacing: '2px',
            marginBottom: '14px',
            marginTop: '20px',
          }}
        >
          {titleLabel}
        </div>

        {/* Subtitle */}
        {formData.ausstellungsdatum && (
          <div style={{ textAlign: 'right', fontSize: '10pt', color: '#444', marginBottom: '28px' }}>
            Zürich, {formData.ausstellungsdatum}
          </div>
        )}

        {/* Inline edit hint */}
        <div style={{ fontSize: '8pt', color: '#aaa', marginBottom: '8px', fontStyle: 'italic' }}>
          💡 Klicke auf einen Absatz um ihn direkt zu bearbeiten
        </div>

        {/* Body — inline editable */}
        <div>
          {filledBlocks.map((b, i) => (
            editingIdx === i ? (
              <div key={i} style={{ marginBottom: '14px' }}>
                <textarea
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  rows={4}
                  style={{
                    width: '100%',
                    fontSize: '11pt',
                    lineHeight: '1.6',
                    border: '2px solid #1E2D4E',
                    borderRadius: '4px',
                    padding: '6px 8px',
                    fontFamily: 'Calibri, "Segoe UI", Arial, sans-serif',
                    resize: 'vertical',
                    outline: 'none',
                  }}
                />
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <button
                    onClick={() => commitEdit(b)}
                    style={{ fontSize: '10pt', background: '#1E2D4E', color: '#fff', border: 'none', borderRadius: '4px', padding: '3px 12px', cursor: 'pointer' }}
                  >
                    ✓ Speichern
                  </button>
                  <button
                    onClick={() => setEditingIdx(null)}
                    style={{ fontSize: '10pt', background: '#eee', color: '#555', border: 'none', borderRadius: '4px', padding: '3px 10px', cursor: 'pointer' }}
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            ) : (
              <p
                key={i}
                onClick={() => startEdit(i, b.text)}
                title="Klicken zum Bearbeiten"
                style={{
                  marginBottom: '14px',
                  textAlign: 'justify',
                  fontSize: '11pt',
                  lineHeight: '1.6',
                  cursor: 'text',
                  borderRadius: '3px',
                  padding: '2px 4px',
                  margin: '0 -4px 14px -4px',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f0f4ff'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {replacePlaceholders(b.text, formData)}
              </p>
            )
          ))}
        </div>

        {/* Signature */}
        <div
          style={{
            marginTop: '60px',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '10.5pt',
          }}
        >
          <div>
            <strong>Therapie Kreuzplatz AG</strong>
          </div>
          <div style={{ textAlign: 'right' }}>
            {formData.unterzeichnerName && (
              <div>
                <strong>{formData.unterzeichnerName}</strong>
              </div>
            )}
            {formData.unterzeichnerFunktion && (
              <div style={{ fontStyle: 'italic', color: '#555', fontSize: '10pt' }}>
                {formData.unterzeichnerFunktion}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: '15mm',
            left: '22mm',
            right: '18mm',
            textAlign: 'center',
            fontSize: '9pt',
            color: '#666',
            borderTop: '1px solid #1E2D4E',
            paddingTop: '6px',
          }}
        >
          Therapie Kreuzplatz AG
        </div>
      </div>

      {/* Info note */}
      <p className="text-center text-xs text-gray-400 mt-4">
        Dies ist eine Bildschirmvorschau. Das exportierte Dokument kann leicht abweichen.
      </p>
    </div>
  )
}
