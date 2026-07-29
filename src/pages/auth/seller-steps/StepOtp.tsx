import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { useSellerOnboardingStore } from "../../../store/useSellerOnboardingStore";
import { Button, InputOtp } from "../../../components/ui/Input";

const RESEND_DELAY = 60;

export default function StepOtp() {
  const { contact, otp, setOtp, nextStep, prevStep } =
    useSellerOnboardingStore();
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_DELAY);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleVerify = () => {
    if (otp.length !== 6) {
      setError("Veuillez saisir les 6 chiffres reçus.");
      return;
    }
    setIsVerifying(true);
    setError("");
    // TODO: appel API réel de vérification OTP
    setTimeout(() => {
      setIsVerifying(false);
      nextStep();
    }, 700);
  };

  const handleResend = () => {
    if (secondsLeft > 0) return;
    // TODO: appel API réel de renvoi du code
    setSecondsLeft(RESEND_DELAY);
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      <h4 className="font-heading text-lg font-bold text-primary">
        Vérification
      </h4>
      <p className="text-sm text-secondary">
        Un code à 6 chiffres a été envoyé à{" "}
        <span className="font-semibold text-primary">
          {contact.identifier || "votre contact"}
        </span>
      </p>

      <InputOtp
        value={otp}
        onChange={(v) => {
          setOtp(v);
          setError("");
        }}
        error={error}
        disabled={isVerifying}
      />

      <button
        type="button"
        onClick={handleResend}
        disabled={secondsLeft > 0}
        className="flex items-center gap-1.5 text-sm font-medium text-primary-500 disabled:text-muted"
      >
        <RotateCcw size={14} />
        Renvoyer le code {secondsLeft > 0 ? `dans ${secondsLeft}s` : ""}
      </button>

      <div className="flex gap-3">
        <Button
          type="button"
          handleClick={prevStep}
          className="flex-1 justify-center border border-subtle bg-transparent text-primary"
        >
          Retour
        </Button>
        <Button
          type="submit"
          loading={isVerifying}
          handleClick={handleVerify}
          backgroundColor="var(--color-primary-500)"
          className="flex-1 justify-center text-white"
        >
          Vérifier
        </Button>
      </div>
    </div>
  );
}
