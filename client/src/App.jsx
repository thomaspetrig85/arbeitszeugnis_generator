import React, { useState, useEffect, useRef } from 'react'
import { ZeugnisProvider, useZeugnis } from './context/ZeugnisContext.jsx'
import Layout from './components/Layout.jsx'
import Stepper from './components/Stepper.jsx'
import Step1_Stammdaten from './components/Step1_Stammdaten.jsx'
import Step2_Bewertung from './components/Step2_Bewertung.jsx'
import Step3_Vorschau from './components/Step3_Vorschau.jsx'
import Step4_Export from './components/Step4_Export.jsx'
import Archive from './components/Archive.jsx'

function WizardContent() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showArchive, setShowArchive] = useState(false)
  const archiveIdRef = useRef(null)
  const { formData, bloecke, replaceFormData, setBloecke, resetAll } = useZeugnis()

  // Reset to step 1 when resetAll is triggered
  useEffect(() => {
    if (!formData.vorname && !formData.nachname && currentStep === 4) {
      setCurrentStep(1)
    }
  }, [formData])

  function handleReset() {
    resetAll()
    archiveIdRef.current = null
    setCurrentStep(1)
  }

  function handleLoadEntry(entry) {
    replaceFormData(entry.formData)
    setBloecke(entry.bloecke)
    archiveIdRef.current = entry.id
    setShowArchive(false)
    setCurrentStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function validateStep1() {
    if (!formData.vorname.trim()) return 'Bitte Vorname eingeben.'
    if (!formData.nachname.trim()) return 'Bitte Nachname eingeben.'
    if (!formData.funktion.trim()) return 'Bitte Funktion eingeben.'
    if (!formData.eintrittsdatum.trim()) return 'Bitte Eintrittsdatum eingeben.'
    if (formData.zeugnistyp !== 'zwischenzeugnis' && !formData.austrittsdatum.trim())
      return 'Bitte Austrittsdatum eingeben.'
    return null
  }

  function handleNext() {
    if (currentStep === 1) {
      const err = validateStep1()
      if (err) {
        alert(err)
        return
      }
    }
    setCurrentStep((s) => Math.min(s + 1, 4))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleBack() {
    setCurrentStep((s) => Math.max(s - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const stepComponents = {
    1: <Step1_Stammdaten />,
    2: <Step2_Bewertung />,
    3: <Step3_Vorschau />,
    4: <Step4_Export onReset={handleReset} archiveId={archiveIdRef.current} />,
  }

  return (
    <Layout onShowArchive={() => setShowArchive(true)} onShowWizard={() => setShowArchive(false)} showArchive={showArchive}>
      {showArchive ? (
        <Archive onLoadEntry={handleLoadEntry} />
      ) : (
        <>
          <Stepper currentStep={currentStep} />

          <div className="mb-8">
            {stepComponents[currentStep]}
          </div>

          {/* Navigation */}
          {currentStep < 4 && (
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 sticky bottom-0 bg-gray-50 py-4 -mx-4 px-4">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="px-6 py-2.5 rounded-lg border-2 border-gray-300 text-gray-600 font-medium text-sm hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                ← Zurück
              </button>

              <div className="text-xs text-gray-400">
                Schritt {currentStep} von 4
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-lg bg-navy text-white font-medium text-sm hover:bg-opacity-90 transition-all shadow-sm"
              >
                {currentStep === 3 ? 'Exportieren →' : 'Weiter →'}
              </button>
            </div>
          )}
        </>
      )}
    </Layout>
  )
}

export default function App() {
  return (
    <ZeugnisProvider>
      <WizardContent />
    </ZeugnisProvider>
  )
}
