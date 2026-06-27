// Trait Interfaces

export interface DarkvisionTrait {
  enabled: boolean;
  range_feet: number;
}

export interface SpellAbility {
  name: string;
  description?: string;
  value?: number;
}

// Main Race Interface

export interface Race {
  id: string;
  name: string;
  description?: string;
  
  // attributes
  size: 'Small' | 'Medium' | 'Large';
  speed: number; // walking speed
  
  // flexible traits
  traits: {
    darkvision?: DarkvisionTrait;
    languages?: string[];
    skill_proficiencies?: string[];
    spell_list?: string[];
    damage_resistances?: string[];
    special_abilities?: SpellAbility[];
    [key: string]: any; // custom traits
  };
  
  // stat bonuses
  ability_bonuses: {
    strength?: number;
    dexterity?: number;
    constitution?: number;
    intelligence?: number;
    wisdom?: number;
    charisma?: number;
    any_two?: number;
    [key: string]: number | undefined;
  };
}

export type RaceData = Race & {
  // extra fields for display purposes
  display_name?: string;
  image_url?: string;
};