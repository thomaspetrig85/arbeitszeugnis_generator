import React from 'react'
import { useZeugnis } from '../context/ZeugnisContext.jsx'

const ZEUGNISTYPEN = [
  {
    value: 'qualifiziert',
    label: 'Qualifiziertes Zeugnis',
    desc: 'Vollständige Beurteilung von Leistung & Verhalten',
    icon: '📋',
  },
  {
    value: 'zwischenzeugnis',
    label: 'Zwischenzeugnis',
    desc: 'Während des laufenden Arbeitsverhältnisses',
    icon: '📝',
  },
  {
    value: 'bestaetigung',
    label: 'Arbeitsbestätigung',
    desc: 'Ohne Leistungs- und Verhaltensbeurteilung',
    icon: '✉️',
  },
  {
    value: 'praktikum',
    label: 'Praktikumszeugnis',
    desc: 'Für Praktikant:innen und Studierende',
    icon: '🎓',
  },
]

const FACHBEREICHE = [
  'Physiotherapeut:in',
  'Osteopath:in',
  'Masseur:in / Med. Masseur:in',
  'Praxissekretariat / MPA',
]

const BEWERTUNGEN = ['Sehr gut', 'Gut', 'Solide', 'Ausreichend']

const inputCls =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition'
const labelCls = 'block text-xs font-medium text-gray-600 mb-1'
const sectionCls =
  'text-navy font-semibold text-xs uppercase tracking-wide mb-3 mt-6 border-b border-navy-mid pb-1'

export default function Step1_Stammdaten() {
  const { formData, setFormData } = useZeugnis()

  function handleChange(e) {
    const { name, value } = e.target
    setFormData({ [name]: value })
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Zeugnistyp */}
      <div className={sectionCls}>Zeugnisart</div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
        {ZEUGNISTYPEN.map((zt) => (
          <button
            key={zt.value}
            type="button"
            onClick={() => setFormData({ zeugnistyp: zt.value })}
            className={`rounded-xl border-2 p-3 text-left transition-all cursor-pointer
              ${
                formData.zeugnistyp === zt.value
                  ? 'border-navy bg-navy-light'
                  : 'border-gray-200 bg-white hover:border-navy-mid'
              }`}
          >
            <div className="text-2xl mb-1">{zt.icon}</div>
            <div className={`text-xs font-bold leading-tight ${formData.zeugnistyp === zt.value ? 'text-navy' : 'text-gray-700'}`}>
              {zt.label}
            </div>
            <div className="text-xs text-gray-500 mt-1 leading-tight">{zt.desc}</div>
          </button>
        ))}
      </div>

      {/* Personalien */}
      <div className={sectionCls}>Personalien</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>Anrede *</label>
          <select name="anrede" value={formData.anrede} onChange={handleChange} className={inputCls}>
            <option>Herr</option>
            <option>Frau</option>
            <option>Mx.</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Vorname *</label>
          <input
            type="text"
            name="vorname"
            value={formData.vorname}
            onChange={handleChange}
            placeholder="z. B. Maria"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Nachname *</label>
          <input
            type="text"
            name="nachname"
            value={formData.nachname}
            onChange={handleChange}
            placeholder="z. B. Muster"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Geburtsdatum</label>
          <input
            type="text"
            name="geburtsdatum"
            value={formData.geburtsdatum}
            onChange={handleChange}
            placeholder="TT.MM.JJJJ"
            className={inputCls}
          />
        </div>
      </div>

      {/* Stelle */}
      <div className={sectionCls}>Stelle & Fachbereich</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Fachbereich *</label>
          <select name="fachbereich" value={formData.fachbereich} onChange={handleChange} className={inputCls}>
            {FACHBEREICHE.map((fb) => (
              <option key={fb}>{fb}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Funktion / Stellenbezeichnung *</label>
          <input
            type="text"
            name="funktion"
            value={formData.funktion}
            onChange={handleChange}
            placeholder="z. B. Physiotherapeut:in"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Pensum (%)</label>
          <input
            type="number"
            name="pensum"
            value={formData.pensum}
            onChange={handleChange}
            min="10"
            max="100"
            step="10"
            className={inputCls}
          />
        </div>
      </div>

      {/* Zeitraum */}
      <div className={sectionCls}>Zeitraum</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>Eintrittsdatum *</label>
          <input
            type="text"
            name="eintrittsdatum"
            value={formData.eintrittsdatum}
            onChange={handleChange}
            placeholder="TT.MM.JJJJ"
            className={inputCls}
          />
        </div>
        {formData.zeugnistyp !== 'zwischenzeugnis' && (
          <div>
            <label className={labelCls}>Austrittsdatum *</label>
            <input
              type="text"
              name="austrittsdatum"
              value={formData.austrittsdatum}
              onChange={handleChange}
              placeholder="TT.MM.JJJJ"
              className={inputCls}
            />
          </div>
        )}
        <div>
          <label className={labelCls}>Ausstellungsdatum</label>
          <input
            type="text"
            name="ausstellungsdatum"
            value={formData.ausstellungsdatum}
            onChange={handleChange}
            placeholder="TT.MM.JJJJ"
            className={inputCls}
          />
        </div>
      </div>

      {/* Bewertung & Unterzeichner */}
      {formData.zeugnistyp !== 'bestaetigung' && (
        <>
          <div className={sectionCls}>Globale Bewertung</div>
          <div className="flex flex-wrap gap-2 mb-2">
            {BEWERTUNGEN.map((bw) => (
              <button
                key={bw}
                type="button"
                onClick={() => setFormData({ globalBewertung: bw })}
                className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all
                  ${
                    formData.globalBewertung === bw
                      ? 'bg-navy border-navy text-white'
                      : 'bg-white border-gray-300 text-gray-600 hover:border-navy'
                  }`}
              >
                {bw}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Diese Bewertung wird als Vorauswahl für alle Textbausteine im nächsten Schritt verwendet.
          </p>
        </>
      )}

      <div className={sectionCls}>Unterzeichner:in</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Name Unterzeichner:in</label>
          <input
            type="text"
            name="unterzeichnerName"
            value={formData.unterzeichnerName}
            onChange={handleChange}
            placeholder="z. B. Dr. Anna Müller"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Funktion Unterzeichner:in</label>
          <input
            type="text"
            name="unterzeichnerFunktion"
            value={formData.unterzeichnerFunktion}
            onChange={handleChange}
            placeholder="z. B. Praxisleitung"
            className={inputCls}
          />
        </div>
      </div>
    </div>
  )
}
