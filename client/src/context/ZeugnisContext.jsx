import React, { createContext, useContext, useState } from 'react'

const ZeugnisContext = createContext(null)

const defaultFormData = {
  zeugnistyp: 'qualifiziert',
  anrede: 'Herr',
  vorname: '',
  nachname: '',
  geburtsdatum: '',
  funktion: '',
  fachbereich: 'Physiotherapeut:in',
  pensum: '100',
  eintrittsdatum: '',
  austrittsdatum: '',
  ausstellungsdatum: new Date().toLocaleDateString('de-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }),
  unterzeichnerName: '',
  unterzeichnerFunktion: 'Praxisleitung',
  globalBewertung: 'Sehr gut',
}

export function ZeugnisProvider({ children }) {
  const [formData, setFormDataState] = useState(defaultFormData)
  const [bloecke, setBloeckeState] = useState([])
  const [textbausteine, setTextbausteine] = useState([])

  function setFormData(updates) {
    setFormDataState((prev) => ({ ...prev, ...updates }))
  }

  function setBloecke(newBloecke) {
    setBloeckeState(newBloecke)
  }

  function replaceFormData(newFormData) {
    setFormDataState(newFormData)
  }

  function updateBlock(kategorie, updates) {
    setBloeckeState((prev) =>
      prev.map((b) => (b.kategorie === kategorie ? { ...b, ...updates } : b))
    )
  }

  function resetAll() {
    setFormDataState({
      ...defaultFormData,
      ausstellungsdatum: new Date().toLocaleDateString('de-CH', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    })
    setBloeckeState([])
  }

  return (
    <ZeugnisContext.Provider
      value={{
        formData,
        setFormData,
        replaceFormData,
        bloecke,
        setBloecke,
        updateBlock,
        textbausteine,
        setTextbausteine,
        resetAll,
      }}
    >
      {children}
    </ZeugnisContext.Provider>
  )
}

export function useZeugnis() {
  const ctx = useContext(ZeugnisContext)
  if (!ctx) throw new Error('useZeugnis must be used within ZeugnisProvider')
  return ctx
}
