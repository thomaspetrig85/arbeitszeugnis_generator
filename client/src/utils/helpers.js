export function replacePlaceholders(text, formData) {
  if (!text) return ''
  return text
    .replace(/\[Anrede\]/g, formData.anrede || '')
    .replace(/\[Name\]/g, [formData.vorname, formData.nachname].filter(Boolean).join(' ') || '')
    .replace(/\[Vorname\]/g, formData.vorname || '')
    .replace(/\[Funktion\]/g, formData.funktion || '')
    .replace(/\[Pensum\]/g, formData.pensum ? formData.pensum + ' %' : '')
    .replace(/\[Eintrittsdatum\]/g, formData.eintrittsdatum || '')
    .replace(/\[Austrittsdatum\]/g, formData.austrittsdatum || '')
    .replace(/\[Praxisname\]/g, 'Therapie Kreuzplatz AG')
}

export function getKategorienForZeugnistyp(zeugnistyp, fachbereich) {
  const isTherapist = fachbereich !== 'Praxissekretariat / MPA'
  const umgangKat = isTherapist ? 'Patientenumgang' : 'Kommunikation & Empfang'

  const allKategorien = [
    'Einleitung',
    'Aufgabenbeschreibung',
    'Fachkompetenz',
    'Leistungsbereitschaft',
    'Arbeitsqualität',
    'Selbstständigkeit',
    umgangKat,
    'Teamverhalten',
    'Zuverlässigkeit',
    'Schlussformel',
  ]

  if (zeugnistyp === 'bestaetigung') {
    return ['Einleitung (Arbeitsbestätigung)', 'Aufgabenbeschreibung', 'Schlussformel']
  }
  if (zeugnistyp === 'zwischenzeugnis') {
    return [
      'Einleitung (Zwischenzeugnis)',
      'Aufgabenbeschreibung',
      'Fachkompetenz',
      'Leistungsbereitschaft',
      'Arbeitsqualität',
      'Selbstständigkeit',
      umgangKat,
      'Teamverhalten',
      'Zuverlässigkeit',
      'Schlussformel (Zwischenzeugnis)',
    ]
  }
  if (zeugnistyp === 'praktikum') {
    return [
      'Einleitung (Praktikum)',
      'Aufgabenbeschreibung',
      'Fachkompetenz',
      'Leistungsbereitschaft',
      'Arbeitsqualität',
      'Selbstständigkeit',
      umgangKat,
      'Teamverhalten',
      'Zuverlässigkeit',
      'Schlussformel (Praktikum)',
    ]
  }
  return allKategorien
}

export function getZeugnistypLabel(typ) {
  const labels = {
    qualifiziert: 'ARBEITSZEUGNIS',
    zwischenzeugnis: 'ZWISCHENZEUGNIS',
    bestaetigung: 'ARBEITSBESTÄTIGUNG',
    praktikum: 'PRAKTIKUMSZEUGNIS',
  }
  return labels[typ] || 'ARBEITSZEUGNIS'
}

export function getBausteinText(textbausteine, fachbereich, kategorie, bewertung) {
  // For special categories in zwischenzeugnis/praktikum/bestaetigung, use "Alle Fachbereiche"
  const specialKategorien = [
    'Einleitung (Zwischenzeugnis)',
    'Einleitung (Arbeitsbestätigung)',
    'Einleitung (Praktikum)',
    'Schlussformel (Zwischenzeugnis)',
    'Schlussformel (Praktikum)',
  ]

  const lookupFachbereich = specialKategorien.includes(kategorie)
    ? 'Alle Fachbereiche'
    : fachbereich

  // For special categories, bewertung may be n/a
  const lookupBewertung = ['Einleitung (Zwischenzeugnis)', 'Einleitung (Arbeitsbestätigung)', 'Einleitung (Praktikum)'].includes(kategorie)
    ? 'n/a'
    : bewertung

  const match = textbausteine.find(
    (b) =>
      b.funktion === lookupFachbereich &&
      b.kategorie === kategorie &&
      b.bewertung === lookupBewertung
  )
  return match ? match.text : ''
}
