import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import StatsForm from '../component/StatsForm'
import AppearanceBuilder from '../component/AppearanceBuilder'
import Summary from './Summary'
import { useCreatorStore } from '../../controller/store/useStore'
import RacePicker from '../component/RacePicker'
import ClassPicker from '../component/ClassPicker'
import { useAuth } from '../../controller/context/AuthContext'
import { getCharacterById, updateCharacter } from '../../controller/service/characterService'

const DEFAULT_STATS = {
  strength: 8,
  dexterity: 8,
  constitution: 8,
  intelligence: 8,
  wisdom: 8,
  charisma: 8,
}

export default function CharacterEditor() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()
  const {
    name: characterName,
    appearance: appearanceSelection,
    rawStats,
    race,
    class: charClass,
    lore,
    pronouns,
    setAppearance,
    setName,
    setPronouns,
    setRaceClass,
    setStats,
    setLore,
    reset,
  } = useCreatorStore()

  useEffect(() => {
    if (!id) {
      setLoadError('Missing character id.')
      setIsLoading(false)
      return
    }

    let active = true

    const loadCharacter = async () => {
      try {
        setIsLoading(true)
        setLoadError(null)
        reset()

        const character = await getCharacterById(id)

        if (!active) return

        setName(character.name ?? '')
        setPronouns(character.pronouns ?? '')
        setRaceClass(character.race ?? '', character.class ?? '')
        setStats(character.final_stats ?? character.base_stats ?? DEFAULT_STATS)
        setAppearance(character.appearance ?? {})
        setLore(character.lore ?? '')
      } catch (error: any) {
        if (active) {
          setLoadError(error?.message || 'Failed to load character.')
        }
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    loadCharacter()

    return () => {
      active = false
      reset()
    }
  }, [id, reset, setAppearance, setLore, setName, setPronouns, setRaceClass, setStats])

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleFinish = async () => {
    if (!user || !id) {
      setSaveError('You must be signed in to update a character.')
      return
    }

    const stats = rawStats ?? DEFAULT_STATS

    setIsSaving(true)
    setSaveError(null)

    try {
      await updateCharacter(id, {
        name: characterName,
        pronouns,
        race,
        class: charClass,
        base_stats: stats,
        final_stats: stats,
        appearance: appearanceSelection,
        lore,
        level: 1,
      })

      reset()
      navigate('/characters')
    } catch (error: any) {
      console.error('Failed to update character:', error)
      setSaveError(error.message || 'Unable to update character.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div>Loading character...</div>
  }

  if (loadError) {
    return <div className="error">{loadError}</div>
  }

  return (
    <div>
      {currentStep === 1 && (
        <AppearanceBuilder
          onNext={handleNext}
          onBack={() => navigate('/characters')}
          selection={appearanceSelection}
          onChange={(value) => setAppearance(value)}
          name={characterName}
          onNameChange={setName}
          pronouns={pronouns}
          onPronounsChange={setPronouns}
        />
      )}

      {currentStep === 2 && (
        <RacePicker
          selectedRaceId={race}
          onSelect={(selectedRace) => {
            setRaceClass(selectedRace.name, charClass || '')
          }}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}

      {currentStep === 3 && (
        <ClassPicker
          selectedClassName={charClass}
          onSelect={(selectedClass) => {
            setRaceClass(race || '', selectedClass.name)
          }}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}

      {currentStep === 4 && <StatsForm onNext={handleNext} onBack={handleBack} />}

      {currentStep === 5 && (
        <div className="card-large">
          <h2>Character Notes</h2>
          <p>Write your character's lore here.</p>
          <textarea
            value={lore}
            onChange={(e) => setLore(e.target.value)}
            placeholder="Write your character's lore here..."
            rows={8}
            style={{ width: '100%', maxWidth: '600px', padding: '0.75rem' }}
          />
          <div className="summary-actions">
            <button onClick={handleBack}>Back</button>
            <button onClick={handleNext}>Next</button>
          </div>
        </div>
      )}

      {currentStep === 6 && (
        <Summary
          onConfirm={handleFinish}
          onBack={handleBack}
          isSaving={isSaving}
          saveError={saveError}
        />
      )}
    </div>
  )
}
