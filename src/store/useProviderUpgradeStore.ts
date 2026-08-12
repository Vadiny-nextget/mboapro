import { create } from 'zustand';

interface ProviderUpgradeState {
  currentStep: number;
  description: string;
  category: string;
  skills: string[];
  portfolioUrl: string;
  yearsExperience: string;
  region: string;
  city: string;
  address: string;
  street: string;
  postalCode: string;
  portfolioImages: File[];
  setField: <K extends keyof ProviderUpgradeState>(key: K, value: ProviderUpgradeState[K]) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

const initialState = {
  currentStep: 1,
  description: '',
  category: '',
  skills: [] as string[],
  portfolioUrl: '',
  yearsExperience: '',
  region: '',
  city: '',
  address: '',
  street: '',
  postalCode: '',
  portfolioImages: [] as File[],
};

export const useProviderUpgradeStore = create<ProviderUpgradeState>((set) => ({
  ...initialState,
  setField: (key, value) => set({ [key]: value } as Partial<ProviderUpgradeState>),
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 2) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),
  reset: () => set(initialState),
}));

export const PROVIDER_UPGRADE_TOTAL_STEPS = 2;