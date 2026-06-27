import { useCreatorStore } from '../../controller/store/useStore';
import { StatName } from '../../controller/util/dndRules';

const STAT_LABELS: Record<StatName, string> = {
  strength: 'Strength',
  dexterity: 'Dexterity',
  constitution: 'Constitution',
  intelligence: 'Intelligence',
  wisdom: 'Wisdom',
  charisma: 'Charisma',
};

export default function Summary({ onConfirm, onBack, isSaving, saveError }: { onConfirm: () => void; onBack: () => void; isSaving?: boolean; saveError?: string | null }) {
  const { name, appearance, rawStats, race, class: charClass, lore } = useCreatorStore();
  const stats = rawStats ?? {
    strength: 8,
    dexterity: 8,
    constitution: 8,
    intelligence: 8,
    wisdom: 8,
    charisma: 8,
  }; // Default stats (not supposed to happen tho)

  return ( // Page layout
    <div className="card-large">
      <h2>Summary</h2>
      <div className="summary-section">
        <p><span className="keyword">{name || 'Unnamed character'}</span>,<br/>the {race || 'Unselected'} {charClass || 'Unselected'}</p>
        

        <div className="appearance-preview">
          <img src={`/appearance/base/${appearance.base}.png`} alt="Body" />
          <img src={`/appearance/eyes/${appearance.eyes}.png`} alt="Eyes" />
          <img src={`/appearance/mouth/${appearance.mouth}.png`} alt="Mouth" />
          <img src={`/appearance/hair/${appearance.hair}.png`} alt="Hair" />
          <img src={`/appearance/ears/${appearance.ears}.png`} alt="Ears" />
          <img src={`/appearance/bangs/${appearance.bangs}.png`} alt="Bangs" />
          <div className="appearance-preview-overlay"></div>
        </div>
      </div>

      <p>{lore ? `Lore: ${lore}` : 'Lore: None'}</p>

      <div className="summary-section">
        <h3>Stats</h3>
        <div className="stats-summary">
          {(Object.keys(stats) as StatName[]).map((stat) => (
            <div key={stat} className="summary-stat-row">
                <p><span>{STAT_LABELS[stat]}</span> <span>{stats[stat]}</span></p>
            </div>
          ))}
        </div>
      </div>

      {saveError && (
        <div className="summary-error">{saveError}</div>
      )}
      <div className="summary-actions">
        <button onClick={onBack} disabled={isSaving}>Back</button>
        <button onClick={onConfirm} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Confirm'}
        </button>
      </div>
    </div>
  );
}