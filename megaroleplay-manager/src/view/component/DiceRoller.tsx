import { useState } from 'react';
import { DICE_TYPES, rollTotal } from '../../controller/util/diceRoller';

export default function DiceRoller() {
  const [selectedDie, setSelectedDie] = useState<number>(20);
  const [count, setCount] = useState<number>(1);
  const [result, setResult] = useState<{ rolls: number[]; total: number } | null>(null);

  const handleRoll = () => {
    setResult(rollTotal(selectedDie, count));
  };

  return (
    <div className="card-large">
      <h2>Dice Roller</h2>

      <div>
        {DICE_TYPES.map((sides) => (
          <button
            key={sides}
            onClick={() => setSelectedDie(sides)}
            className={selectedDie === sides ? 'selected' : ''}
          >
            d{sides}
          </button>
        ))}
      </div>

      <div>
        <label>
          Count:
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Math.max(1, Number(e.target.value)))}
          />
        </label>
      </div>

      <button onClick={handleRoll}>Roll d{selectedDie} x {count}</button>

      {result && (
        <div>
          <p>Rolls: {result.rolls.join(', ')}</p>
          <p>Total: {result.total}</p>
        </div>
      )}
    </div>
  );
}