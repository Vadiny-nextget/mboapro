import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import AuthSlideshow from "../components/auth/AuthSlideshow";

/**
 * Layout d'auth en split-screen :
 * - >= md : deux colonnes égales (slideshow | formulaire)
 * - < md  : slideshow réduit en bandeau (10rem) au-dessus, formulaire en dessous
 */
export default function AuthLayout() {
  return (
    <div className="flex h-dvh flex-col md:grid md:grid-cols-2">
      {/* Partie slideshow */}
      <div className="h-40 shrink-0 md:h-full">
        <AuthSlideshow />
      </div>

      {/* Partie formulaire — glassmorphism */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden h-screen w-full bg-linear-to-br from-accent-600 via-page to-primary-800">
        {/* Formes décoratives en fond, purement esthétiques */}
        {/* <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-accent-200/30 blur-3xl" /> */}

        <div className="overflow-y-auto px-4 h-full w-full">
          <div className="flex flex-col gap-4 justify-center items-center w-full min-h-full py-4">
            <Link to="/" className="mb-6 flex justify-center">
              <span className="font-heading text-2xl font-bold text-primary-500">
                Mboa<span className="text-accent-500">Pro</span>
              </span>
            </Link>

            <div className="">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
