import { useState, useEffect } from 'react'
import { getClasses, ClassData } from '../../controller/service/classService'

interface ClassPickerProps {
  onSelect: (charClass: ClassData) => void;
  selectedClassName?: string;
  onBack?: () => void;
  onNext?: () => void;
}

export default function ClassPicker({
  onSelect,
  selectedClassName,
  onBack,
  onNext,
}: ClassPickerProps) {
  const [classes, setClasses] = useState<ClassData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await getClasses()
        setClasses(data)
      } catch (err: any) {
        console.error('Failed to load classes:', err)
        setError(err.message || 'Could not load classes.')
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [])

  if (loading) {
    return <div className="race-picker-loading">Loading available classes...</div>
  }

  if (error) {
    return <div className="race-picker-error">Error: {error}</div>
  }

  if (classes.length === 0) {
    return <div className="race-picker-empty">No classes found.</div>
  }

  return ( // Page layout
    <div className="card">
      <h3>Select Your Class</h3>
      <div className="race-grid">
        {classes.map((charClass) => {
          const isSelected = selectedClassName === charClass.name

          return (
            <button
              key={charClass.id}
              onClick={() => onSelect(charClass)}
              className={`race-button ${isSelected ? 'selected' : ''}`}
            >
              <span className="race-name">{charClass.name}</span><br />
              {charClass.primary_stat && <span className="details">Known for their {charClass.primary_stat}. </span>}
              {charClass.hit_die && <span className="details">Uses a d{charClass.hit_die}.</span>}
            </button>
          )
        })}
      </div>

      {selectedClassName && (
        <div className="race-details">
          {classes.find((c) => c.name === selectedClassName)?.description}
        </div>
      )}

      <div className="race-picker-actions">
        <button type="button" className="secondary-button" onClick={onBack}>
          Back
        </button>
        <button
          type="button"
          className="primary-button"
          onClick={onNext}
          disabled={!selectedClassName}
        >
          Next
        </button>
      </div>
    </div>
  )
}
