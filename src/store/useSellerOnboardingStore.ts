import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SellerOnboardingState } from '../types/onboarding.types';

interface SellerOnboardingActions {
  setContact: (data: Partial<SellerOnboardingState['contact']>) => void;
  setOtp: (otp: string) => void;
  setPersonal: (data: Partial<SellerOnboardingState['personal']>) => void;
  setLocation: (data: Partial<SellerOnboardingState['location']>) => void;
  setProfessional: (data: Partial<SellerOnboardingState['professional']>) => void;
  setAvatarFile: (file: File | null) => void;
  setPortfolioImages: (files: File[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
}

const TOTAL_STEPS = 5;

const initialState: SellerOnboardingState = {
  currentStep: 0,
  contact: { identifier: '', type: 'email', acceptedTerms: false },
  otp: '',
  personal: {
    firstName: '',
    lastName: '',
    description: '',
    preferredLanguage: 'fr',
    password: '',
    confirmPassword: '',
    is_verify_2fa: false,
  },
  location: { country: 'Cameroun', region: '', city: '', address: '', street: '', postalCode: '' },
  professional: { category: '', skills: [], portfolioUrl: '', yearsExperience: '' },
  avatarFile: null,
  portfolioImages: [],
};

export const useSellerOnboardingStore = create<SellerOnboardingState & SellerOnboardingActions>()(
  persist(
    (set) => ({
      ...initialState,
      setContact: (data) => set((s) => ({ contact: { ...s.contact, ...data } })),
      setOtp: (otp) => set({ otp }),
      setPersonal: (data) => set((s) => ({ personal: { ...s.personal, ...data } })),
      setLocation: (data) => set((s) => ({ location: { ...s.location, ...data } })),
      setProfessional: (data) => set((s) => ({ professional: { ...s.professional, ...data } })),
      setAvatarFile: (file) => set({ avatarFile: file }),
      setPortfolioImages: (files) => set({ portfolioImages: files }),
      nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, TOTAL_STEPS) })),
      prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),
      goToStep: (step) => set({ currentStep: Math.min(Math.max(step, 1), TOTAL_STEPS) }),
      reset: () => set(initialState),
    }),
    {
      name: 'mboapro-seller-onboarding',
      // Les File ne sont pas sérialisables : on les exclut de la persistance sessionStorage
      partialize: (s) => ({
        currentStep: s.currentStep,
        contact: s.contact,
        otp: s.otp,
        personal: s.personal,
        location: s.location,
        professional: s.professional,
      }),
      storage: {
        getItem: (name) => {
          const value = sessionStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => sessionStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => sessionStorage.removeItem(name),
      },
    }
  )
);

export const SELLER_ONBOARDING_TOTAL_STEPS = TOTAL_STEPS;