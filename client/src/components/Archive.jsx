import React, { useState, useEffect } from 'react'
import { useZeugnis } from '../context/ZeugnisContext.jsx'
import { getZeugnistypLabel } from '../utils/helpers.js'

const FACHBEREICH_COLORS = {
  'Physiotherapeut:in': 'bg-blue-100 text-blue-800',
  'Osteopath:in': 'bg-purple-100 text-purple-800',
  'Masseur:in / Med. Masseur:in': 'bg-green-100 text-green-800',
  'Praxissekretariat / MPA': 'bg-orange-100 text-orange-800',
}

function formatDate(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch { return iso }
}

function typLabel(typ) {
  const map = {
    qualifiziert: 'Arbeitszeugnis',
    zwischenzeugnis: 'Zwischenzeugnis',
    bestaetigung: 'Arbeitsbestätigung',
    praktikum: 'Praktikumszeugnis',
  }
  return map[typ] || typ
}

export default function Archive({ onLoadEntry }) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/archive')
      .then(r => r.json())
      .then(data => { setEntries(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function handleDelete(id, name) {
    if (!confirm(`Zeugnis von ${name} wirklich löschen?`)) return
    setDeleting(id)
    await fetch(`/api/archive/${id}`, { method: 'DELETE' })
    setEntries(prev => prev.filter(e => e.id !== id))
    setDeleting(null)
  }

  const filtered = entries.filter(e => {
    const q = search.toLowerCase()
    const fd = e.formData || {}
    return !q ||
      (fd.vorname || '').toLowerCase().includes(q) ||
      (fd.nachname || '').toLowerCase().includes(q) ||
      (fd.funktion || '').toLowerCase().includes(q) ||
      (fd.fachbereich || '').toLowerCase().includes(q)
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-navy">Archiv</h2>
          <p className="text-sm text-gray-500 mt-0.5">{entries.length} gespeicherte Zeugnisse</p>
        </div>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Suchen (Name, Funktion…)"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-60 focus:outline-none focus:ring-2 focus:ring-navy"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="text-4xl mb-3">📁</div>
          <p className="text-gray-500 font-medium">
            {search ? 'Keine Ergebnisse für diese Suche.' : 'Noch keine Zeugnisse archiviert.'}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {!search && 'Erstelle ein Zeugnis und klicke auf «Im Archiv speichern».'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(entry => {
            const fd = entry.formData || {}
            const name = [fd.vorname, fd.nachname].filter(Boolean).join(' ') || '(Unbekannt)'
            const fbColor = FACHBEREICH_COLORS[fd.fachbereich] || 'bg-gray-100 text-gray-600'
            return (
              <div
                key={entry.id}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-navy text-base">{name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${fbColor}`}>
                        {fd.fachbereich || '—'}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                        {typLabel(fd.zeugnistyp)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-500 mt-1">
                      {fd.funktion && <span>Funktion: <strong className="text-gray-700">{fd.funktion}</strong></span>}
                      {fd.pensum && <span>Pensum: <strong className="text-gray-700">{fd.pensum} %</strong></span>}
                      {fd.eintrittsdatum && <span>Einritt: <strong className="text-gray-700">{fd.eintrittsdatum}</strong></span>}
                      {fd.austrittsdatum && <span>Austritt: <strong className="text-gray-700">{fd.austrittsdatum}</strong></span>}
                    </div>
                    <div className="text-xs text-gray-400 mt-1.5">
                      Gespeichert: {formatDate(entry.savedAt)}
                      {entry.updatedAt !== entry.savedAt && ` · Bearbeitet: ${formatDate(entry.updatedAt)}`}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => onLoadEntry(entry)}
                      className="px-4 py-1.5 bg-navy text-white text-xs font-medium rounded-lg hover:bg-opacity-90 transition-all whitespace-nowrap"
                    >
                      ✏️ Bearbeiten
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id, name)}
                      disabled={deleting === entry.id}
                      className="px-4 py-1.5 border border-red-200 text-red-500 text-xs font-medium rounded-lg hover:bg-red-50 transition-all whitespace-nowrap disabled:opacity-40"
                    >
                      {deleting === entry.id ? '…' : '🗑 Löschen'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
