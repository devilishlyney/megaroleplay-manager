import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { 
  RawStats, 
  StatName, 
  calculatePointsUsed, 
  
  MIN_STAT, 
  MAX_STAT, 
  TOTAL_POINTS,
  getStatCost
} from '../../controller/util/dndRules';

const INITIAL_STATS: RawStats = {
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

export default function StatsForm({ onNext, onBack }: { onNext: (stats: RawStats) => void; onBack?: () => void }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState<RawStats>(INITIAL_STATS);
  const [pointsUsed, setPointsUsed] = useState(0);
  const [pointsRemaining, setPointsRemaining] = useState(TOTAL_POINTS);
  const [error, setError] = useState<string | null>(null);

  // Recalculate points whenever stats change
  useEffect(() => {
    const used = calculatePointsUsed(stats);
    setPointsUsed(used);
    setPointsRemaining(TOTAL_POINTS - used);
    
    if (used > TOTAL_POINTS) {
      setError(`You have exceeded the limit by ${used - TOTAL_POINTS} points.`);
    } else {
      setError(null);
    }
  }, [stats]);

  const handleStatChange = (stat: StatName, delta: number) => {
    setStats((prev) => {
      const newValue = prev[stat] + delta;
      
      // Validation: Min 8, Max 15
      if (newValue < MIN_STAT || newValue > MAX_STAT) return prev;

      // Validation: Points Limit
      const newStats = { ...prev, [stat]: newValue };
      if (calculatePointsUsed(newStats) > TOTAL_POINTS) return prev;

      return newStats;
    });
  };

  const handleNext = () => {
    if (pointsRemaining !== 0) {
      setError(`You must spend exactly ${TOTAL_POINTS} points. You have ${pointsRemaining} remaining.`);
      return;
    }
    onNext(stats);
  };

  return (
    <main className="container">
      <div className="card">
        <button onClick={() => (onBack ? onBack() : navigate("/"))}>Back</button>
        <h2>Adjust your character's raw stats!</h2>
        
        <div className="stats-container">
          {(Object.keys(stats) as StatName[]).map((stat) => (
            <div key={stat} className="stat-block">
              <label>
                {STAT_LABELS[stat]}
              </label>
              
              <div className="stats-controls">
                <button
                  onClick={() => handleStatChange(stat, -1)}
                  disabled={stats[stat] <= MIN_STAT || calculatePointsUsed({...stats, [stat]: stats[stat]-1}) > TOTAL_POINTS} className="stat-change-button">
                  -
                </button>
                
                <span className="stats-value">
                  {stats[stat]}
                </span>
                
                <button
                  onClick={() => handleStatChange(stat, 1)}
                  disabled={stats[stat] >= MAX_STAT || calculatePointsUsed({...stats, [stat]: stats[stat]+1}) > TOTAL_POINTS} className="stat-change-button">
                  +
                </button>
              </div>

              <div>
                Cost
                {/* Simplified display: just show the cost of the current value */}
                <span>
                  : {getStatCost(stats[stat])} pts
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Status Bar */}
        <div>
          <div>
            <span>Points Used : </span>
            <span>
              {pointsUsed} / {TOTAL_POINTS}
            </span>
          </div>
          <div>
            <span>Remaining : </span>
            <span>
              {pointsRemaining}
            </span>
          </div>
        </div>

        {error && (
          <div>
            {error}
          </div>
        )}

        <button onClick={handleNext} disabled={pointsRemaining !== 0 || !!error}>
          Next: Appearance
        </button>
      </div>
    </main>
  );
}