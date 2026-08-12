import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ClientOnboardingState } from '../types/onboarding.types';

interface ClientOnboardingActions {
  setContact: (data: Partial<ClientOnboardingState['contact']>) => void;
  setOtp: (otp: string) => void;
  setVerificationToken: (token: string) => void;
  setPersonal: (data: Partial<ClientOnboardingState['personal']>) => void;
  setAvatarFile: (file: File | null) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

const TOTAL_STEPS = 3;

const initialState: ClientOnboardingState = {
  currentStep: 0,
  contact: { identifier: '', type: 'email', acceptedTerms: false },
  otp: '',
  verificationToken: '',
  personal: {
    firstName: '',
    lastName: '',
    preferredLanguage: 'fr',
    password: '',
    confirmPassword: '',
    is_verify_2fa:false,
  },
  avatarFile: null,
};

export const useClientOnboardingStore = create<ClientOnboardingState & ClientOnboardingActions>()(
  persist(
    (set) => ({
      ...initialState,
      setContact: (data) => set((s) => ({ contact: { ...s.contact, ...data } })),
      setOtp: (otp) => set({ otp }),
      setVerificationToken: (verificationToken) => set({ verificationToken }),
      setPersonal: (data) => set((s) => ({ personal: { ...s.personal, ...data } })),
      setAvatarFile: (file) => set({ avatarFile: file }),
      nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, TOTAL_STEPS) })),
      prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),
      reset: () => set(initialState),
    }),
    {
      name: 'mboapro-client-onboarding',
      partialize: (s) => ({
        currentStep: s.currentStep,
        contact: s.contact,
        otp: s.otp,
        verificationToken: s.verificationToken,
        personal: s.personal,
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

export const CLIENT_ONBOARDING_TOTAL_STEPS = TOTAL_STEPS;