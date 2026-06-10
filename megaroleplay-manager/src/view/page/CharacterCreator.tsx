// src/pages/CharacterCreator.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatsForm from '../component/StatsForm'
import AppearanceBuilder from '../component/AppearanceBuilder'
import Summary from './Summary'
import { AppearanceSelection } from '../../model/character'

const defaultAppearanceSelection: AppearanceSelection = {
  base: '01',
  eyes: '01',
  mouth: '01',
  hair: '01',
  ears: '01',
  bangs: '01',
}

export default function CharacterCreator() {
  const [currentStep, setCurrentStep] = useState(1)
  const navigate = useNavigate()
  const [appearanceSelection, setAppearanceSelection] = useState<AppearanceSelection>(defaultAppearanceSelection)

  const handleNext = () => {
    // Save data to Zustand store here
    setCurrentStep(prev => prev + 1)
  }

  const handleBack = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleFinish = () => {
    // Save to DB
    navigate('/') // Redirect to Dashboard
  }

  return (
    <div>
      {/* Step Content */}
      {currentStep === 1 && (
        <StatsForm onNext={handleNext} onBack={() => navigate('/')} />
      )}
      
      {currentStep === 2 && (
        <AppearanceBuilder 
          onNext={handleNext}
          onBack={handleBack}
          selection={appearanceSelection}
          onChange={setAppearanceSelection}
        />
      )}
      
      {currentStep === 3 && (
        <Summary 
          onConfirm={handleFinish} 
          onBack={handleBack} 
        />
      )}
    </div>
  )
}