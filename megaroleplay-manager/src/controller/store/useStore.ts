// src/controller/store/useStore.ts
import { create } from 'zustand'
import { Character, RawStats, AppearanceSelection } from '../../model/character' // Ensure path matches your folder structure

interface CreatorState {
  step: number;
  name: string;
  race: string;
  class: string;
  rawStats: RawStats | null;
  appearance: AppearanceSelection;
  lore: string;
  
  // Actions
  setStep: (step: number) => void;
  setName: (name: string) => void;
  setRaceClass: (race: string, charClass: string) => void;
  setStats: (stats: RawStats) => void;
  setAppearance: (appearance: Partial<AppearanceSelection>) => void; // Allow partial updates
  setLore: (lore: string) => void;
  reset: () => void;
}

export const useCreatorStore = create<CreatorState>((set) => ({
  // Initial State
  step: 1,
  name: '',
  race: '',
  class: '',
  rawStats: null,
  appearance: {
    base: '01',
    ears: '01',
    eyes: '01',
    hair: '01',
    mouth: '01',
    bangs: '01',
  },
  lore: '',

  // Actions
  setStep: (step) => set({ step }),
  setName: (name) => set({ name }),
  setRaceClass: (race, charClass) => set({ race, class: charClass }),
  setStats: (rawStats) => set({ rawStats }),
  setAppearance: (newAppearance) => set((state) => ({ 
    appearance: { ...state.appearance, ...newAppearance } 
  })),
  setLore: (lore) => set({ lore }),
  reset: () => set({
    step: 1,
    name: '',
    race: '',
    class: '',
    rawStats: null,
    appearance: {
      base: '01',
      ears: '01',
      eyes: '01',
      hair: '01',
      mouth: '01',
      bangs: '01',
    },
    lore: '',
  }),
}))