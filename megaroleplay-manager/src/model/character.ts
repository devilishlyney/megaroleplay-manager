// --- Stats Types ---
export type StatName = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';

export interface RawStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface FinalStats extends RawStats {
  // You might add modifiers or calculated values here later
}

// --- Appearance Types ---
export interface AppearanceSelection {
  base: string;   // Body/Skin
  ears: string;
  eyes: string;
  hair: string;
  mouth: string;
  bangs: string;
}

// --- Main Character Type ---
export interface Character {
  
  // Identity
  name: string;
  race: string;              // e.g., "Human", "Elf"
  class: string;             // e.g., "Warrior", "Mage"
  
  // Attributes
  level: number;
  rawStats: RawStats;        // The Point Buy stats (before racial bonuses)
  finalStats: FinalStats;    // The total stats (after racial bonuses & gear)
  
  // Visuals
  appearance: AppearanceSelection;
  
  // Inventory/Progression
  inventory: string[];       // Array of Item IDs
  equipment: {
    head?: string;
    chest?: string;
    hands?: string;
    legs?: string;
    weapon?: string;
    accessory?: string;
  };
  skills: string[];          // Array of Skill IDs
  lore: string;              // Backstory text
}