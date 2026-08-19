import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import { Input, Button, InputCheck } from "../../../components/ui/Input";
import { useSellerOnboardingStore } from "../../../store/useSellerOnboardingStore";
import type { ContactType } from "../../../types/onboarding.types";
import { formatPhone, isEmail, isPhone } from "../../../lib/text.func";
import { authService } from "../../../services/authService";
import type { ApiError } from "../../../types/api.types";

// const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// const PHONE_REGEX = /^6|2\d{8}$/; // format Cameroun : 9 chiffres commençant par 6 ou 2

export default function StepContact() {
  const { contact, setContact, nextStep } = useSellerOnboardingStore();
  const [mode, setMode] = useState<ContactType>(contact.type);
  const [identifier, setIdentifier] = useState(contact.identifier);
  const [acceptedTerms, setAcceptedTerms] = useState(contact.acceptedTerms);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const switchMode = (m: ContactType) => {
    setError("");
    setMode(m);
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "email" && !isEmail(identifier)) {
      setError("Adresse email invalide.");
      return;
    }
    if (mode === "phone" && !isPhone(identifier)) {
      setError("Numéro invalide (ex: 677123456).");
      return;
    }
    if (!acceptedTerms) {
      setError("Vous devez accepter les conditions d\u2019utilisation.");
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.sendOtp(identifier.replaceAll(" ",""), 'register_prestataire');
      setContact({ identifier:identifier?.replaceAll(" ", ""), type: mode, acceptedTerms });
      nextStep();
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.status === 429 && apiError.meta?.secondsRemaining) {
        setError(`Veuillez attendre ${apiError.meta.secondsRemaining}s avant de réessayer.`);
      } else {
        setError(apiError.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-4">
      <h4 className="font-heading text-lg font-bold text-primary">Contact</h4>
      {/* Switch email / téléphone */}
      <div className="grid grid-cols-2 gap-2 rounded-lg bg-surface-alt p-1">
        <Button
          onClick={() => switchMode("email")}
          className={`justify-center text-inherit ${mode === "email" ? "bg-(--surface-glass)/50!" : "bg-(--surface-glass)/15!"}`}
        >
          <Mail size={15} /> Email
        </Button>
        <Button
          onClick={() => switchMode("phone")}
          className={`justify-center text-inherit ${mode === "phone" ? "bg-(--surface-glass)/50!" : "bg-(--surface-glass)/15!"}`}
        >
          <Phone size={15} /> Téléphone
        </Button>
      </div>

      {mode === "email" ? (
        <Input
          Icon={Mail}
          label="Adresse email"
          id="contact-email"
          type="email"
          value={identifier}
          onChange={(e) => {
            setIdentifier(e.target.value);
            setError("");
          }}
          placeholder="vous@exemple.com"
          error={error}
        />
      ) : (
        <Input
          Ico="+237"
          label="Numéro de téléphone"
          id="contact-phone"
          type="tel"
          inputMode="numeric"
          value={formatPhone(identifier)}
          onChange={(e) => {
            setIdentifier(formatPhone(e.target.value));
            setError("");
          }}
          placeholder="6XX XX XX XX"
          error={error}
        />
      )}

      <InputCheck
        id="acceptedTerms"
        css="text-sm"
        checked={acceptedTerms}
        onChange={(e) => setAcceptedTerms(e.target.checked)}
        label={
          <>
            J'accepte les{" "}
            <Link
              to="/conditions"
              target="_blank"
              className="font-medium text-primary-500/75! hover:underline!"
            >
              conditions d'utilisation
            </Link>{" "}
            et la{" "}
            <Link
              to="/confidentialite"
              target="_blank"
              className="font-medium text-primary-500/75! hover:underline!"
            >
              politique de confidentialité
            </Link>
          </>
        }
      />
      <Button
        type="submit"
        onClick={handleSubmit}
        backgroundColor="var(--color-primary-500)"
        className="justify-center text-white"
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        Continuer
      </Button>

      <p className="mt-4 text-center text-sm text-secondary">
        Déjà inscrit ?{" "}
        <Link
          to="/connexion"
          className="font-semibold text-primary-500! hover:underline!"
        >
          Se connecter
        </Link>
      </p>
    </form>
  );
}
