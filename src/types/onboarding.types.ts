export type ContactType = 'email' | 'phone';

export interface OnboardingContact {
  identifier: string;
  type: ContactType;
  acceptedTerms: boolean;
}

export interface OnboardingPersonal {
  firstName: string;
  lastName: string;
  description: string;
  preferredLanguage: 'fr' | 'en';
  password: string;
  confirmPassword: string;
  is_verify_2fa: boolean;

}

export interface OnboardingLocation {
  country: string;
  region: string;
  city: string;
  address: string;
  street: string;
  postalCode: string;
}

export interface OnboardingProfessional {
  portfolioUrl: string;
  yearsExperience: string;
  whatsapp: string;
}

export interface SellerOnboardingState {
  currentStep: number;
  contact: OnboardingContact;
  otp: string;
  verificationToken: string;
  personal: OnboardingPersonal;
  location: OnboardingLocation;
  professional: OnboardingProfessional;
  // Fichiers gardés hors persistance (voir partialize dans le store)
  avatarFile: File | null;
}
export interface ClientOnboardingState {
  currentStep: number;
  contact: OnboardingContact;
  otp: string;
  verificationToken: string;
  personal: Omit<OnboardingPersonal, 'description'>;
  avatarFile: File | null;
}