import React, { useState } from 'react'
import { useZeugnis } from '../context/ZeugnisContext.jsx'

function DownloadButton({ label, sublabel, icon, onClick, loading, outline }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`w-full sm:w-64 flex items-center gap-4 px-6 py-4 rounded-xl font-semibold text-base transition-all shadow-sm
        ${
          outline
            ? 'border-2 border-navy text-navy bg-white hover:bg-navy-light disabled:opacity-50'
            : 'bg-navy text-white hover:bg-opacity-90 disabled:opacity-50'
        }`}
    >
      {loading ? (
        <span className="w-7 h-7 border-3 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" style={{ borderWidth: 3 }}></span>
      ) : (
        <span className="text-2xl flex-shrink-0">{icon}</span>
      )}
      <div className="text-left">
        <div>{loading ? 'Wird erstellt…' : label}</div>
        <div className={`text-xs font-normal mt-0.5 ${outline ? 'text-gray-500' : 'text-blue-100'}`}>{sublabel}</div>
      </div>
    </button>
  )
}

export default function Step4_Export({ archiveId }) {
  const { formData, bloecke, resetAll } = useZeugnis()
  const [loadingDocx, setLoadingDocx] = useState(false)
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [loadingArchive, setLoadingArchive] = useState(false)
  const [error, setError] = useState(null)
  const [successDocx, setSuccessDocx] = useState(false)
  const [successPdf, setSuccessPdf] = useState(false)
  const [savedArchiveId, setSavedArchiveId] = useState(archiveId || null)

  const payload = { ...formData, bloecke }

  async function downloadFile(url, filename, setLoading, setSuccess) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unbekannter Fehler' }))
        throw new Error(err.error || `HTTP ${res.status}`)
      }
      const blob = await res.blob()
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(objectUrl)
      setSuccess(true)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function handleDocx() {
    const name = `Arbeitszeugnis_${formData.nachname || 'Zeugnis'}_${formData.vorname || ''}.docx`.replace(/\s+/g, '_')
    downloadFile('/api/export/docx', name, setLoadingDocx, setSuccessDocx)
  }

  function handlePdf() {
    const name = `Arbeitszeugnis_${formData.nachname || 'Zeugnis'}_${formData.vorname || ''}.pdf`.replace(/\s+/g, '_')
    downloadFile('/api/export/pdf', name, setLoadingPdf, setSuccessPdf)
  }

  async function handleSaveArchive() {
    setLoadingArchive(true)
    setError(null)
    try {
      const body = { formData, bloecke }
      if (savedArchiveId) body.id = savedArchiveId
      const res = await fetch('/api/archive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const entry = await res.json()
      setSavedArchiveId(entry.id)
    } catch (e) {
      setError('Archivierung fehlgeschlagen: ' + e.message)
    } finally {
      setLoadingArchive(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto text-center py-8">
      {/* Success header */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-navy mb-2">Zeugnis ist bereit!</h2>
      <p className="text-gray-500 text-sm mb-8">
        Das Arbeitszeugnis für{' '}
        <strong>
          {formData.vorname} {formData.nachname}
        </strong>{' '}
        wurde erfolgreich erstellt. Wähle das gewünschte Format:
      </p>

      {/* Download buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
        <DownloadButton
          label="Download DOCX"
          sublabel="Bearbeitbares Word-Dokument"
          icon={successDocx ? '✅' : '📄'}
          onClick={handleDocx}
          loading={loadingDocx}
          outline={false}
        />
        <DownloadButton
          label="Download PDF"
          sublabel="Druckfertiges PDF"
          icon={successPdf ? '✅' : '📑'}
          onClick={handlePdf}
          loading={loadingPdf}
          outline={true}
        />
      </div>

      {/* Archive save */}
      <div className="flex justify-center mb-4">
        <button
          type="button"
          onClick={handleSaveArchive}
          disabled={loadingArchive}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-300 text-gray-600 text-sm font-medium hover:border-navy hover:text-navy transition-all disabled:opacity-50"
        >
          {loadingArchive ? (
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : savedArchiveId ? '✅' : '📁'}
          {loadingArchive ? 'Wird gespeichert…' : savedArchiveId ? 'Im Archiv aktualisiert' : 'Im Archiv speichern'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4 text-left">
          <p className="text-red-700 font-semibold text-sm">Fehler beim Erstellen</p>
          <p className="text-red-600 text-xs mt-1">{error}</p>
        </div>
      )}

      {/* Summary info */}
      <div className="bg-navy-light rounded-xl p-4 text-left mb-8">
        <div className="text-xs font-semibold text-navy uppercase tracking-wide mb-2">Zusammenfassung</div>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-700">
          <dt className="text-gray-400">Name</dt>
          <dd className="font-medium">{formData.vorname} {formData.nachname}</dd>
          <dt className="text-gray-400">Funktion</dt>
          <dd className="font-medium">{formData.funktion || '—'}</dd>
          <dt className="text-gray-400">Fachbereich</dt>
          <dd className="font-medium">{formData.fachbereich}</dd>
          <dt className="text-gray-400">Zeitraum</dt>
          <dd className="font-medium">
            {formData.eintrittsdatum || '?'} – {formData.austrittsdatum || (formData.zeugnistyp === 'zwischenzeugnis' ? 'heute' : '?')}
          </dd>
          <dt className="text-gray-400">Bewertung</dt>
          <dd className="font-medium">{formData.globalBewertung}</dd>
          <dt className="text-gray-400">Blöcke</dt>
          <dd className="font-medium">{bloecke.length} Kategorien</dd>
        </dl>
      </div>

      {/* Reset */}
      <button
        type="button"
        onClick={resetAll}
        className="text-sm text-gray-400 hover:text-navy underline transition-colors"
      >
        + Neues Zeugnis erstellen
      </button>
    </div>
  )
}
