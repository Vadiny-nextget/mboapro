import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepperIndicator from '../../components/auth/StepperIndicator';
import { useSellerOnboardingStore, SELLER_ONBOARDING_TOTAL_STEPS } from '../../store/useSellerOnboardingStore';
import StepContact from './seller-steps/StepContact';
import StepOtp from './seller-steps/StepOtp';
import StepPersonalInfo from './seller-steps/StepPersonalInfo';
import StepLocation from './seller-steps/StepLocation';
import StepProfessional from './seller-steps/StepProfessional';
import { Stepper } from '../../components/ui/Stepper';

// const STEP_LABELS = ['Contact', 'Vérification', 'Profil', 'Localisation', 'Activité'];

// const STEP_COMPONENTS = [StepContact, StepOtp, StepPersonalInfo, StepLocation, StepProfessional];

export default function SellerRegisterPage() {
  const currentStep = useSellerOnboardingStore((s) => s.currentStep);
  const navigate = useNavigate();

  const handleComplete = () => {
    // TODO: appel API final de création de compte prestataire
    navigate('/prestataire');
  };
const STEP_COMPONENTS = [<StepContact/>, <StepOtp/>, <StepPersonalInfo/>, <StepLocation/>, <StepProfessional onComplete={handleComplete}/>];

  // const CurrentStepComponent = STEP_COMPONENTS[currentStep - 1];
  

  useEffect(() => {
    document.title = `Inscription prestataire — Étape ${currentStep}/${STEP_COMPONENTS.length}`;
  }, [currentStep]);

  return (
    <div className='animate-fade-in-up w-full rounded-2xl border border-(--surface-glass)/5 bg-(--surface-glass)/25 p-6 shadow-lg backdrop-blur-xl lg:p-8 max-w-lg m-auto'>
      <div className="mb-6">
        <h1 className="font-heading text-lg font-bold text-primary">Devenir prestataire</h1>
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