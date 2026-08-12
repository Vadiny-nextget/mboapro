import { useEffect } from 'react';
import { useClientOnboardingStore, CLIENT_ONBOARDING_TOTAL_STEPS } from '../../store/useClientOnboardingStore';
import StepClientContact from './client-steps/StepClientContact';
import StepClientOtp from './client-steps/StepClientOtp';
import StepClientPersonalInfo from './client-steps/StepClientPersonalInfo';
import { Stepper } from '../../components/ui/Stepper';

// const STEP_LABELS = ['Contact', 'Vérification', 'Profil'];
const STEP_COMPONENTS = [<StepClientContact/>, <StepClientOtp/>, <StepClientPersonalInfo/>];
// const STEP_COMPONENTS = [StepClientContact, StepClientOtp, StepClientPersonalInfo];

export default function ClientRegisterPage() {
  const currentStep = useClientOnboardingStore((s) => s.currentStep);
  // const CurrentStepComponent = STEP_COMPONENTS[currentStep - 1];

  useEffect(() => {
    document.title = `Inscription client — Étape ${currentStep}/${CLIENT_ONBOARDING_TOTAL_STEPS}`;
  }, [currentStep]);

  return (



          <div className='animate-fade-in-up w-full rounded-2xl border border-(--surface-glass)/5 bg-(--surface-glass)/25 p-6 shadow-lg backdrop-blur-xl lg:p-8 max-w-lg m-auto'>
            <div className="mb-6">
              <h1 className="font-heading text-lg font-bold text-primary">Créer un compte client</h1>
              {/* <p className="mt-1 text-sm text-secondary">
                Étape {currentStep} sur {SELLER_ONBOARDING_TOTAL_STEPS}
              </p> */}
            </div>
      
            {/* <div className="mb-8">
              <StepperIndicator steps={STEP_LABELS} currentStep={currentStep} />
            </div> */}
      
            {/* key={currentStep} force le remount => rejoue l'animation d'entrée à chaque étape */}
            {/* <div key={currentStep} className="animate-fade-in-up">
              <CurrentStepComponent onComplete={currentStep === STEP_COMPONENTS.length ? handleComplete : undefined} />
            </div> */}
      
              <Stepper key={currentStep}
                className="flex animate-scale-in"
                index={currentStep}
                cmp={STEP_COMPONENTS}
              />
          </div>
  );
}