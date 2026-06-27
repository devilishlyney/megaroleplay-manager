import { useEffect } from 'react';
import { useCreatorStore } from '../../controller/store/useStore';
import { 
  RawStats, 
  StatName, 
  calculatePointsUsed, 
  MIN_STAT, 
  MAX_STAT, 
  TOTAL_POINTS,
  getStatCost
} from '../../controller/util/dndRules';

// default stats if nothing in store yet
const EMPTY_STATS: RawStats = {
  strength: 8,
  dexterity: 8,
  constitution: 8,
  intelligence: 8,
  wisdom: 8,
  charisma: 8,
};

const STAT_LABELS: Record<StatName, string> = {
  strength: 'Strength',
  dexterity: 'Dexterity',
  constitution: 'Constitution',
  intelligence: 'Intelligence',
  wisdom: 'Wisdom',
  charisma: 'Charisma',
};

export default function StatsForm({ onNext, onBack }: { onNext?: (stats: RawStats) => void; onBack?: () => void }) {
  // Get data from zustand store
  const { rawStats, setStats, setStep } = useCreatorStore();
  
  // Use saved stats or empty default
  const stats = rawStats ?? EMPTY_STATS;
  
  // Calculate points on each render
  const pointsUsed = calculatePointsUsed(stats);
  const pointsRemaining = TOTAL_POINTS - pointsUsed;
  
  // Initialize store if first time opening
  useEffect(() => {
    if (!rawStats) {
      setStats(EMPTY_STATS);
    }
  }, []);

  const handleStatChange = (stat: StatName, delta: number) => {
    const newValue = stats[stat] + delta;
    
    // Validation: Min 8, Max 15
    if (newValue < MIN_STAT || newValue > MAX_STAT) return;

    // Validation: Points Limit
    const newStats = { ...stats, [stat]: newValue };
    if (calculatePointsUsed(newStats) > TOTAL_POINTS) return;

    // Update Store directly
    setStats(newStats);
  };

  const handleNextClick = () => { // prevent going to next step if points are not fully spent, but should not be possible since the button would be disabled
    if (pointsRemaining !== 0) {
      alert(`You must spend exactly ${TOTAL_POINTS} points. You have ${pointsRemaining} remaining.`);
      return;
    }
    
    // Move to next step
    setStep(2);
    
    // callback
    if (onNext) onNext(stats);
  };

  return (
    <main className="container">
      <div className="card">
        <h2>Adjust your character's raw stats!</h2>
        
        <div className="stats-container">
          {(Object.keys(stats) as StatName[]).map((stat) => (
            <div key={stat} className="block">
              <label>{STAT_LABELS[stat]}</label>
              
              <div className="stats-controls">
                <button
                  onClick={() => handleStatChange(stat, -1)}
                  disabled={stats[stat] <= MIN_STAT || calculatePointsUsed({...stats, [stat]: stats[stat]-1}) > TOTAL_POINTS}
                  className="change-button"
                >
                  -
                </button>
                
                <span className="stats-value">{stats[stat]}</span>
                
                <button
                  onClick={() => handleStatChange(stat, 1)}
                  disabled={stats[stat] >= MAX_STAT || calculatePointsUsed({...stats, [stat]: stats[stat]+1}) > TOTAL_POINTS}
                  className="change-button"
                >
                  +
                </button>
              </div>

              <div>
                Cost: <span>{getStatCost(stats[stat])} pts</span>
              </div>
            </div>
          ))}
        </div>

        {/* Status Bar */}
        <div>
          <div>
            <span>Points Used : </span>
            <span>{pointsUsed} / {TOTAL_POINTS}</span>
          </div>
          {pointsRemaining !== 0 && (
            <p>
              All {pointsRemaining} remaining points must be used.
            </p>
          )}
        </div>

        <div>
          <button onClick={onBack} className="back-button">
            Back
          </button>
          <button 
            onClick={handleNextClick} 
            disabled={pointsRemaining !== 0}
            className="next-button"
          >
            Next
          </button>
        </div>
        
      </div>
    </main>
  );
}