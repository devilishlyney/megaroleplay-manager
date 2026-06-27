import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { RawStats, AppearanceSelection } from '../../model/character'

interface CreatorState {
  step: number;
  name: string;
  pronouns: string;
  race: string;
  class: string;
  rawStats: RawStats | null;
  appearance: AppearanceSelection;
  lore: string;
  
  // Actions
  setStep: (step: number) => void;
  setName: (name: string) => void;
  setPronouns: (pronouns: string) => void;
  setRaceClass: (race: string, charClass: string) => void;
  setStats: (stats: RawStats) => void;
  setAppearance: (appearance: Partial<AppearanceSelection>) => void; // Allow partial updates
  setLore: (lore: string) => void;
  reset: () => void;
}

export const useCreatorStore = create<CreatorState>()(
  persist(
    (set) => ({
      // Initial State
      step: 1,
      name: '',
      pronouns: '',
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
      setPronouns: (pronouns) => set({ pronouns }),
      setRaceClass: (race, charClass) => set({ race, class: charClass }),
      setStats: (rawStats) => set({ rawStats }),
      setAppearance: (newAppearance) => set((state) => ({ 
        appearance: { ...state.appearance, ...newAppearance } 
      })),
      setLore: (lore) => set({ lore }),
      reset: () => set({
        step: 1,
        name: '',
        pronouns: '',
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
    }),
    {
      name: 'creator-storage',
      partialize: (state) => ({
        step: state.step,
        name: state.name,
        pronouns: state.pronouns,
        race: state.race,
        class: state.class,
        rawStats: state.rawStats,
        appearance: state.appearance,
        lore: state.lore,
      }),
    }
  )
)
