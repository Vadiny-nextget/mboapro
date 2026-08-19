import { useState } from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import type { ForgotPasswordCommand } from "../../types/auth.types";
import { isEmail } from "../../lib/text.func";
import { Button, Input } from "../../components/ui/Input";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const schema = Yup.object().shape({
    email: Yup.string(),
  });

  const [registerViewModel, setRegisterViewModel] =
    useState<ForgotPasswordCommand>({
      email: "",
    });

  const [errors, setErrors] = useState<Partial<ForgotPasswordCommand>>({
    email: "",
  });

  const handleSubmit = async () => {
    setErrors({
      email: "",
    });

    const values = await schema.validate(registerViewModel);

    if (values.email === "" || !isEmail(values.email || "")) {
      let email = "";
      if (values.email === "") email = "Adresse e-mail requise";
      if (!isEmail(values.email || ""))
        email = "Vous devez renseigner une adresse email valide";

      setErrors({
        ...errors,
        email: email,
      });
    } else {
      console.log("registerViewModel :: ", registerViewModel);
      // dispatch(
      //   register({
      //     ...registerViewModel,
      //     userlanguage: getStorage<string>(
      //       AuthenticationConstants.HINDRA_CONNECT_USER_LANGUAGE
      //     ),
      //     theme: getStorage<string>(coreConstants.USER_THEME_MODE),
      //   })
      // );
    }
  };

  return (
    <div className="animate-fade-in-up w-full rounded-2xl border border-(--surface-glass)/5 bg-(--surface-glass)/25 p-6 shadow-lg backdrop-blur-xl lg:p-8 max-w-lg m-auto">
      <h1 className="font-heading text-xl font-bold text-primary">
        Récupérer son compte
      </h1>
      <p className="mt-1 text-sm text-secondary">
        Si votre compte existe, vous allez recevoir un lien de réinitialisation
        de mot de passe
      </p>

      <form className="mt-6 flex flex-col gap-4">
        <Input
          Icon={Mail}
          label={`Email`}
          id="email"
          type="email"
          css="max-w-full!"
          value={registerViewModel.email}
          required
          onChange={(e) => {
            setRegisterViewModel((prev) => ({
              ...prev,
              email: e.target.value,
            }));
            setErrors({ ...errors, email: "" });
          }}
          error={errors.email}
          placeholder="vous@exemple.com"
        />
        <Button type="submit" onClick={handleSubmit}>
          Recevoir le code
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-secondary">
        <Link
          to="/connexion"
          className="font-semibold text-primary-500! hover:underline!"
        >
          Connectez-vous
        </Link>
      </p>
    </div>
  );
}
