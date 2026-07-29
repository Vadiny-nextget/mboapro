import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { AuthenticateUserCommand, AuthUser, UserRole } from "../../types/auth.types";
import SocialAuthButtons from "../../components/auth/SocialAuthButtons";
import { Button, Input } from "../../components/ui/Input";
import { Lock, Mail } from "lucide-react";
import * as Yup from "yup";
import { isEmail } from "../../lib/text.func";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "../../store/useAuthStore";

const demoUsers: Record<UserRole, AuthUser> = {
  client: {
    id: 'demo-client',
    fullName: 'Client Démo',
    email: 'client@mboapro.cm',
    role: 'client',
    isVerified: false,
  },
  prestataire: {
    id: 'demo-prestataire',
    fullName: 'Prestataire Démo',
    email: 'prestataire@mboapro.cm',
    role: 'prestataire',
    isVerified: true,
  },
  admin: {
    id: 'demo-admin',
    fullName: 'Admin Démo',
    email: 'admin@mboapro.cm',
    role: 'admin',
    isVerified: true,
  },
};

const fakeUsers: Record<UserRole, AuthenticateUserCommand> = {
  client: {
    email: 'client@mboapro.cm',
    password: 'client',
    saveSession: false,
  },
  prestataire: {
    email: 'prestataire@mboapro.cm',
    password: 'prestataire',
    saveSession: true,
  },
  admin: {
    email: 'admin@mboapro.cm',
    password: 'admin',
    saveSession: true,
  },
};

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  // const isLoading = false;

  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();

  const schema = Yup.object().shape({
    email: Yup.string(),
    password: Yup.string(),
    saveSession: Yup.boolean(),
  });

  const [authenticationViewModel, setAuthenticationViewModel] =
    useState<AuthenticateUserCommand>({
      email: "",
      password: "",
      saveSession: false,
    });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      console.log(codeResponse);
      // dispatch(
      //   authenticateUserByGoogle({
      //     code: codeResponse.code,
      //   })
      // );
    },
    onError: (errorResponse) => {
      console.log(errorResponse);
    },
    onNonOAuthError: (errorResponse) => {
      console.log(errorResponse);
    },
    flow: "auth-code",
  });

  const loginWithLinkedin = () => {
    const clientId = "78cksln55ythia";
    const redirectUri = encodeURIComponent(
      "http://localhost:5173/oauth/linkedin-callback",
    );
    const scope = encodeURIComponent("r_liteprofile");
    const state = Math.random().toString(36).substring(2, 15); // Pour la sécurité

    window.location.href =
      `https://www.linkedin.com/oauth/v2/authorization?response_type=code` +
      `&client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      `&scope=${scope}` +
      `&state=${state}`;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrors({ email: "", password: "" });

    const values = await schema.validate(authenticationViewModel);

    if (
      values.password === "" ||
      values.email === "" ||
      !isEmail(values.email || "")
    ) {
      let password = "",
        email = "";
      if (values.password === "") password = "Mot de passe requis";
      if (values.email === "") email = "Adresse mail requise";
      if (!isEmail(values.email || ""))
        email = "Vous devez renseigner une adresse email valide";

      setErrors({
        email: email,
        password: password,
      });
    } else {
      // dispatch(authenticateUser(authenticationViewModel));
      console.log("authenticationViewModel :: ", authenticationViewModel);
      // TODO: remplacer par un vrai appel API (Spring Boot)

      const authCon = authenticationViewModel.email.toLowerCase().includes("admin")? demoUsers.admin:authenticationViewModel.email.toLowerCase().includes("prestataire")? demoUsers.prestataire:demoUsers.client

          setTimeout(() => {
      setSession(authCon, 'fake-jwt-token');
      setIsLoading(false);
      navigate(`/${authCon.role}`);
    }, 800);


    }
  };

  return (
    <div className="animate-fade-in-up w-full rounded-2xl border border-(--surface-glass)/5 bg-(--surface-glass)/25 p-6 shadow-lg backdrop-blur-xl lg:p-8 max-w-lg m-auto">
      <h1 className="font-heading text-xl font-bold text-primary!">
        Connexion
      </h1>
      <p className="mt-1 text-sm text-secondary">
        Accédez à votre espace MboaPro.
      </p>

      <form className="mt-6 flex flex-col gap-4">
        <Input
          Icon={Mail}
          label={`Email`}
          id="email"
          type="email"
          value={authenticationViewModel.email}
          required
          onChange={(e) => {
            setAuthenticationViewModel((prev) => ({
              ...prev,
              email: e.target.value,
            }));
            setErrors({ ...errors, email: "" });
          }}
          error={errors.email}
          placeholder="vous@exemple.com"
        />

        <Input
          Icon={Lock}
          label={`Mot de passe`}
          id="password"
          type="password"
          value={authenticationViewModel.password}
          required
          onChange={(e) => {
            setAuthenticationViewModel((prev) => ({
              ...prev,
              password: e.target.value,
            }));
            setErrors({ ...errors, password: "" });
          }}
          error={errors.password}
          placeholder="••••••••"
        />
        <div className="forgot text-end text-sm">
          <Link
            to={"/forgot-password"}
            className="font-semibold hover:underline!"
          >
            J'ai oublié mon mot de passe
          </Link>
        </div>

        <Button type="submit" handleClick={handleSubmit} loading={isLoading}>
          Se connecter
        </Button>
      </form>

      <SocialAuthButtons
        onGoogleClick={loginWithGoogle}
        onLinkedinClick={loginWithLinkedin}
      />

      <p className="mt-4 text-center text-sm text-secondary">
        Pas encore de compte ?{" "}
        <Link
          to="/inscription"
          className="font-semibold text-primary-500! hover:underline!"
        >
          S'inscrire
        </Link>
      </p>

      {/* Bloc de test — à retirer une fois l'API branchée */}
      <div className="mt-8 rounded-md border border-dashed border-subtle p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
          Connexion rapide
        </p>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setAuthenticationViewModel(fakeUsers.client)}>
            Connexion Client
          </Button>
          <Button onClick={() => setAuthenticationViewModel(fakeUsers.prestataire)}>
            Connexion Prestataire
          </Button>
          <Button onClick={() => setAuthenticationViewModel(fakeUsers.admin)}>
            Connexion Admin
          </Button>
        </div>
      </div>
    </div>
  );
}
