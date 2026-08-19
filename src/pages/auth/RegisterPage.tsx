import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { UserRole } from "../../types/auth.types";
import { Button } from "../../components/ui/Input";
import { User, Briefcase } from "lucide-react";
import clsx from "clsx";

export default function RegisterPage() {
  // const schema = Yup.object().shape({
  //   lastName: Yup.string(),
  //   firstName: Yup.string(),
  //   email: Yup.string(),
  //   password: Yup.string(),
  //   confirmPassword: Yup.string(),
  //   role: Yup.string(),
  // });

  // const [registerViewModel, setRegisterViewModel] = useState<RegisterCommand>({
  //   lastName: "",
  //   email: "",
  //   firstName: "",
  //   password: "",
  //   confirmPassword: "",
  //   userlanguage: "",
  //   theme: "",
  //   is_verify_2fa: false,
  // });

  // const [errors, setErrors] = useState<Partial<RegisterCommand>>({
  //   lastName: "",
  //   firstName: "",
  //   email: "",
  //   password: "",
  //   confirmPassword: "",
  // });

  // const handleSubmit = async () => {
  //   setErrors({
  //     email: "",
  //     password: "",
  //     confirmPassword: "",
  //     firstName: "",
  //     lastName: "",
  //   });

  //   const values = await schema.validate(registerViewModel);

  //   if (
  //     values.password === "" ||
  //     values.confirmPassword !== values.password ||
  //     values.email === "" ||
  //     !isEmail(values.email || "") ||
  //     values.firstName === "" ||
  //     values.lastName === ""
  //   ) {
  //     let password = "",
  //       firstName = "",
  //       lastName = "",
  //       confirmPassword = "",
  //       email = "";
  //     if (values.firstName === "")
  //       firstName = "Vous devez renseigner un prénom";
  //     if (values.lastName === "") lastName = "Vous devez renseigner un nom";
  //     if (values.password === "") password = "Mot de passe requis";
  //     if (values.confirmPassword !== values.password)
  //       confirmPassword = "Les mots de passe sont différents";
  //     if (values.email === "") email = "Adresse e-mail requise";
  //     if (!isEmail(values.email || ""))
  //       email = "Vous devez renseigner une adresse email valide";

  //     setErrors({
  //       ...errors,
  //       firstName: firstName,
  //       lastName: lastName,
  //       email: email,
  //       password: password,
  //       confirmPassword: confirmPassword,
  //     });
  //   } else {
  //     console.log("registerViewModel :: ", registerViewModel);
  //     // dispatch(
  //     //   register({
  //     //     ...registerViewModel,
  //     //     userlanguage: getStorage<string>(
  //     //       AuthenticationConstants.HINDRA_CONNECT_USER_LANGUAGE
  //     //     ),
  //     //     theme: getStorage<string>(coreConstants.USER_THEME_MODE),
  //     //   })
  //     // );
  //   }
  // };

  const [selectedRole, setSelectedRole] =
    useState<Extract<UserRole, "client" | "prestataire">>("client");
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate(
      selectedRole === "client"
        ? "/inscription/client"
        : "/inscription/prestataire",
    );
  };
  return (
    <div className="animate-fade-in-up w-full rounded-2xl border border-(--surface-glass)/5 bg-(--surface-glass)/25 p-6 shadow-lg backdrop-blur-xl lg:p-8 max-w-lg m-auto">
      <h1 className="font-heading text-xl font-bold text-primary">
        Créer un compte
      </h1>
      <p className="mt-1 text-sm text-secondary">
        Rejoignez la communauté MboaPro.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setSelectedRole("client")}
          className={clsx(
            "flex flex-col items-center gap-2 rounded-lg border p-4 text-sm font-medium transition-colors",
            selectedRole === "client"
              ? "border-primary-500 bg-primary-50 text-primary-600"
              : "border-subtle text-secondary hover:border-primary-300",
          )}
        >
          Je cherche un service
        </button>
        <button
          type="button"
          onClick={() => setSelectedRole("prestataire")}
          className={clsx(
            "flex flex-col items-center gap-2 rounded-lg border p-4 text-sm font-medium transition-colors",
            selectedRole === "prestataire"
              ? "border-primary-500 bg-primary-50 text-primary-600"
              : "border-subtle text-secondary hover:border-primary-300",
          )}
        >
          Je propose mes services
        </button>
      </div>

      <Button
        onClick={handleContinue}
        backgroundColor="var(--color-primary-500)"
        className="mt-6 w-full justify-center text-white"
      >
        Continuer
      </Button>

      <p className="mt-4 text-center text-sm text-secondary">
        Déjà inscrit ?{" "}
        <Link
          to="/connexion"
          className="font-semibold text-primary-500 hover:underline"
        >
          Se connecter
        </Link>
      </p>

      {/* <h1 className="font-heading text-xl font-bold text-primary">
        Créer un compte
      </h1>
      <p className="mt-1 text-sm text-secondary">
        Rejoignez la communauté MboaPro.
      </p>

      <form className="mt-6 flex flex-col gap-4">
        <Input
          Icon={Mail}
          label={`Email`}
          id="email"
          type="email"
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
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row justify-between gap-3">
          <Input
            Icon={User}
            label={`Votre nom`}
            id="lastName"
            value={registerViewModel.lastName}
            required
            onChange={(e) => {
              setRegisterViewModel((prev) => ({
                ...prev,
                lastName: e.target.value,
              }));
              setErrors({ ...errors, lastName: "" });
            }}
            error={errors.lastName}
            placeholder="Talla"
          />
          <Input
            Icon={User}
            label={`Votre prénom`}
            id="firstName"
            value={registerViewModel.firstName}
            required
            onChange={(e) => {
              setRegisterViewModel((prev) => ({
                ...prev,
                firstName: e.target.value,
              }));
              setErrors({ ...errors, firstName: "" });
            }}
            error={errors.firstName}
            placeholder="Samira"
          />
        </div>
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row justify-between gap-3">
          <Input
            Icon={Lock}
            label={`Mot de passe`}
            id="password"
            type="password"
            value={registerViewModel.password}
            required
            onChange={(e) => {
              setRegisterViewModel((prev) => ({
                ...prev,
                password: e.target.value,
              }));
              setErrors({ ...errors, password: "" });
            }}
            error={errors.password}
            placeholder="••••••••"
          />
          <Input
            Icon={Lock}
            label={`Confirmer le mot de passe`}
            id="confirmPassword"
            type="password"
            value={registerViewModel.confirmPassword}
            required
            onChange={(e) => {
              setRegisterViewModel((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }));
              setErrors({ ...errors, confirmPassword: "" });
            }}
            error={errors.confirmPassword}
            placeholder="••••••••"
          />
        </div>
        <Button type="submit" onClick={handleSubmit}>
          Créer mon compte
        </Button>
      </form>
      <div className="text-center text-sm my-4">
        <Link
          to={`/inscription/prestataire`}
          className="font-semibold text-primary-500! hover:underline!"
        >
          Je propose mes services
        </Link>
      </div>

      <p className="mt-4 text-center text-sm text-secondary">
        Déjà inscrit ?{" "}
        <Link
          to="/connexion"
          className="font-semibold text-primary-500! hover:underline!"
        >
          Se connecter
        </Link>
      </p> */}
    </div>
  );
}
