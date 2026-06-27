import { AppearanceSelection } from "../../model/character";
import { useCreatorStore } from '../../controller/store/useStore';

const ASSETS = {
  base: ['01'],
  eyes: ['01', '02', '03', '04', '05'],
  mouth: ['01', '02', '03', '04', '05', '06', '07'],
  hair: ['01', '02', '03', '04', '05'],
  ears: ['01', '02', '03', '04'],
  bangs: ['01', '02', '03', '04', '05', '06', '07'],
};

interface Props {
  selection: AppearanceSelection;
  onChange: (selection: AppearanceSelection) => void;
  name: string;
  onNameChange: (name: string) => void;
  pronouns?: string;
  onPronounsChange?: (pronouns: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function AppearanceBuilder({ selection, onChange, name, onNameChange, pronouns, onPronounsChange, onNext, onBack }: Props) {
  
  const { setAppearance, setName, setPronouns } = useCreatorStore();

  // cycle through options
  const cycleOption = (category: keyof AppearanceSelection, direction: 1 | -1) => {
    const current = selection[category];
    const options = ASSETS[category as keyof typeof ASSETS];
    const index = options.indexOf(current);
    const nextIndex = (index + direction + options.length) % options.length;
    const updated = {
      ...selection,
      [category]: options[nextIndex],
    };

    onChange(updated);
    setAppearance({ [category]: options[nextIndex] });
  };

  const cycleOptionPlus = (category: keyof AppearanceSelection) => cycleOption(category, 1);
  const cycleOptionMinus = (category: keyof AppearanceSelection) => cycleOption(category, -1);

  // Regex for letters (including diacritics), spaces, apostrophes and hyphens, 1-30 characters
  const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{1,30}$/;
  const isNameValid = namePattern.test(name);

  return (
    <div className="card-large">
      <h2>Customize Appearance</h2>
        <div className="appearance-builder">
          <div className="appearance-preview-container">
            
            {/* --- PREVIEW AREA --- */}
            <div className="appearance-preview">
                {/* Layer 1: Body (Base) */}
                <img 
                src={`/appearance/base/${selection.base}.png`} 
                alt="Body"
                />
                
                {/* Layer 2: Eyes */}
                <img 
                src={`/appearance/eyes/${selection.eyes}.png`} 
                alt="Eyes"
                />

                {/* Layer 3: Mouth */}
                <img 
                src={`/appearance/mouth/${selection.mouth}.png`} 
                alt="Mouth"
                />
                {/* Layer 3: Hair */}
                <img 
                src={`/appearance/hair/${selection.hair}.png`} 
                alt="Hair"
                />
                {/* Layer 4: Ears */}
                <img 
                src={`/appearance/ears/${selection.ears}.png`} 
                alt="Ears"
                />
                {/* Layer 5: Bangs */}
                <img 
                src={`/appearance/bangs/${selection.bangs}.png`} 
                alt="Bangs"
                />
                <div className="appearance-preview-overlay"></div> {/* Protects the image from being grabbed */}
            </div>
            <input 
              type="text" 
              placeholder="Name (required, 1-30 letters)" 
              maxLength={30}
              value={name}
              onChange={(e) => {
                onNameChange(e.target.value);
                setName(e.target.value);
              }}
              required 
            />
            <input
              type="text"
              placeholder="Pronouns (optional)"
              maxLength={30}
              value={pronouns ?? ''}
              onChange={(e) => {
                onPronounsChange?.(e.target.value);
                setPronouns(e.target.value);
              }}
            />
            {!isNameValid && name.length > 0 && (
              <div>
                Name may only contain letters, apostrophes, and hyphens.
              </div>
            )}
          </div>
            {/* --- CONTROLS AREA --- */}
            <div className="appearance-controls">
                {(['base', 'eyes', 'mouth', 'hair', 'ears', 'bangs'] as const).map((category) => (
                <div key={category} className="block">
                    <span>{category}</span>
                    
                    <div className="controls">
                      <button onClick={() => cycleOptionMinus(category)} className="change-button">
                          ←
                      </button>
                      
                      <span>
                          {selection[category]}
                      </span>
                      
                      <button onClick={() => cycleOptionPlus(category)} className="change-button">
                          →
                      </button>
                    </div>
                </div>
                ))}
            </div>
        </div>

      {/* --- NAVIGATION --- */}
      <div>
        <button onClick={onBack}>
          Back
        </button>
        <button
          onClick={() => { if (isNameValid) onNext(); }}
          disabled={!isNameValid}
        >
          Next
        </button>
      </div>
    </div>
  );
}