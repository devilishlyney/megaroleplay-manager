import { AppearanceSelection } from "../../model/character";

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
  onNext: () => void;
  onBack: () => void;
}

export default function AppearanceBuilder({ selection, onChange, onNext, onBack }: Props) {
  
  // Helper to cycle through options
  const cycleOptionPlus = (category: keyof AppearanceSelection) => {
    const current = selection[category];
    const options = ASSETS[category as keyof typeof ASSETS];
    const currentIndex = options.indexOf(current);
    const nextIndex = (currentIndex + 1) % options.length;
    
    onChange({
      ...selection,
      [category]: options[nextIndex],
    });
  };

  const cycleOptionMinus = (category: keyof AppearanceSelection) => {
    const current = selection[category];
    const options = ASSETS[category as keyof typeof ASSETS];
    const currentIndex = options.indexOf(current);
    const prevIndex = (currentIndex - 1 + options.length) % options.length;
    
    onChange({
      ...selection,
      [category]: options[prevIndex],
    });
  };

  return (
    <div className="card-large">
      <h2>Customize Appearance</h2>
        <div className="appearance-builder">
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
        <button onClick={onNext}>
          Next: Summary
        </button>
      </div>
    </div>
  );
}