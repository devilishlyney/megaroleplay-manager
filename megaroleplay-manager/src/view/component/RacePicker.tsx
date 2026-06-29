import { useState, useEffect } from 'react';
import { getRaces, RaceData } from '../../controller/service/raceService';

interface RacePickerProps {
  onSelect: (race: RaceData) => void;
  selectedRaceId?: string;
  onBack?: () => void;
  onNext?: () => void;
}

export default function RacePicker({ onSelect, selectedRaceId, onBack, onNext }: RacePickerProps) {
  const [races, setRaces] = useState<RaceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const data = await getRaces();
        setRaces(data);
      } catch (err: any) {
        console.error("Failed to load races:", err);
        setError(err.message || "Could not load races.");
      } finally {
        setLoading(false);
      }
    };

    fetchRaces();
  }, []);

  if (loading) {
    return <div className="race-picker-loading">Loading available races...</div>;
  }

  if (error) {
    return <div className="race-picker-error">Error: {error}</div>;
  }

  if (races.length === 0) {
    return <div className="race-picker-empty">No races found.</div>;
  }

  return (
    <div className="card">
      <h3>Select a race/species</h3>
      <div className="race-grid">
        {races.map((race) => {
          const isSelected = selectedRaceId === race.name;
          
          return (
            <button
              key={race.id}
              onClick={() => onSelect(race)}
              className={`race-button ${isSelected ? 'selected' : ''}`}>
              <span className="race-name">{race.name}</span>
              
              <div className="details">
                {race.description}
              </div>

            </button>
          );
        })}
      </div>

      <div className="race-picker-actions">
        <button type="button" className="secondary-button" onClick={onBack}>
          Back
        </button>
        <button
          type="button"
          className="primary-button"
          onClick={onNext}
          disabled={!selectedRaceId}
        >
          Next
        </button>
      </div>
    </div>
  );
}