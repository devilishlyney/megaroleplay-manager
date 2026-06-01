// src/pages/CharacterCreator.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatsForm from '../component/StatsForm'
import AppearanceBuilder from '../component/AppearanceBuilder'
import Summary from './Summary'

export default function CharacterCreator() {
  const [currentStep, setCurrentStep] = useState(1)
  const navigate = useNavigate()

  const handleNext = (_data: any) => {
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