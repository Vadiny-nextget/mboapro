import { useState } from "react";
import { ShieldCheck, CreditCard, Smartphone } from "lucide-react";
import { paymentService } from "../../services/paymentService";
import { ApiError } from "../../types/api.types";

const ACTIVATION_FEE = 5000;

export default function ActivationPaymentPage() {
  const [isRedirecting, setIsRedirecting] = useState<
    "cinetpay" | "intouch" | "paypal" | null
  >(null);
  const [error, setError] = useState("");

  const handlePay = async (gateway: "cinetpay" | "intouch" | "paypal") => {
    setIsRedirecting(gateway);
    setError("");
    try {
      const { paymentUrl } = await paymentService.initiateActivation(gateway);
      window.location.href = paymentUrl;
    } catch (err) {
      setError((err as ApiError).message);
      setIsRedirecting(null);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-10 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-500">
        <ShieldCheck size={26} />
      </div>
      <h1 className="font-heading text-xl font-bold text-primary">
        Activez votre compte prestataire
      </h1>
      <p className="mt-2 text-sm text-secondary">
        Des frais uniques de{" "}
        <strong>{ACTIVATION_FEE.toLocaleString("fr-FR")} FCFA</strong> sont
        requis pour publier vos services sur MboaPro. Ce paiement finance la
        vérification et la visibilité de votre profil.
      </p>

      <div className="mt-8 flex flex-col gap-3">
        <button
          onClick={() => handlePay("cinetpay")}
          disabled={isRedirecting !== null}
          className="flex items-center justify-center gap-2 rounded-lg border border-subtle bg-surface py-3 text-sm font-semibold text-primary hover:bg-surface-alt disabled:opacity-50"
        >
          <Smartphone size={18} />{" "}
          {isRedirecting === "cinetpay"
            ? "Redirection..."
            : "Payer (MOMO, OM, carte)"}
        </button>
        <button
          onClick={() => handlePay("intouch")}
          disabled
          className="flex items-center justify-center gap-2 rounded-lg border border-subtle bg-surface-alt py-3 text-sm font-semibold text-muted opacity-60"
          title="Bientôt disponible"
        >
          <CreditCard size={18} /> Payer avec Intouch Group (bientôt)
        </button>
        <button
          onClick={() => handlePay("paypal")}
          disabled={isRedirecting !== null}
          className="flex items-center justify-center gap-2 rounded-lg border border-subtle bg-surface py-3 text-sm font-semibold text-primary hover:bg-surface-alt disabled:opacity-50"
        >
          {isRedirecting === "paypal"
            ? "Redirection..."
            : "Payer avec PayPal ou carte bancaire"}
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-danger">{error}</p>}

      <p className="mt-6 text-xs text-muted">
        Vous serez redirigé vers une page de paiement sécurisée, puis renvoyé
        automatiquement ici.
      </p>
    </div>
  );
}
