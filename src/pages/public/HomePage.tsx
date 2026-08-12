import { Link } from "react-router-dom";
import { Search, ShieldCheck, Wallet, Zap } from "lucide-react";
import ServiceCard from "../../components/ui/ServiceCard";
import { Button } from "../../components/ui/Input";
import { useEffect, useState } from "react";
import type { Category, Service } from "../../types/catalog.types";
import { catalogService } from "../../services/catalogService";
import ServiceCardSkeleton from "../../components/ui/ServiceCardSkeleton";

// const valueProps = [
//   {
//     title: 'Réputation vérifiée',
//     desc: 'Chaque avis est authentifié après mission réalisée. Zéro faux profil.',
//   },
//   {
//     title: 'Réponse rapide',
//     desc: 'Les meilleurs prestataires répondent en moins d\u2019une heure.',
//   },
//   {
//     title: 'Paiement sécurisé',
//     desc: 'Les fonds sont débloqués uniquement après validation de la mission.',
//   },
// ];

const valueProps = [
  {
    icon: ShieldCheck,
    title: "Réputation vérifiée",
    desc: "Chaque avis est authentifié après mission réalisée. Zéro faux profil.",
  },
  {
    icon: Zap,
    title: "Réponse rapide",
    desc: "Les meilleurs prestataires répondent en moins d\u2019une heure.",
  },
  {
    icon: Wallet,
    title: "Paiement sécurisé",
    desc: "Les fonds sont débloqués uniquement après validation de la mission.",
  },
];

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    Promise.all([
      catalogService.getCategories(),
      catalogService.searchServices({ sort: "rating", perPage: 8 }),
    ])
      .then(([cats, result]) => {
        setCategories(cats);
        setFeaturedServices(result.items);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-linear-to-b from-primary-50 to-page px-4 py-16 lg:py-24">
        <div className="mx-auto max-w-3xl animate-fade-in-up text-center">
          <h1 className="font-heading text-3xl font-bold text-primary lg:text-4xl">
            Trouvez le bon professionnel,{" "}
            <span className="text-primary-500">en toute confiance</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-secondary">
            Plombiers, électriciens, coiffeurs à domicile, coachs, traducteurs,
            comptables freelances — tous vérifiés par MboaPro.
          </p>

          <form className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-lg border border-subtle bg-surface p-2 shadow-md">
            <Search size={18} className="ml-2 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ex: plombier à Douala..."
              className="flex-1 bg-transparent px-2 py-2 text-sm text-primary outline-none placeholder:text-muted"
            />
            <Button
              type="submit"
              handleClick={(e) => {
                e.preventDefault();
                window.location.href = `/services?q=${encodeURIComponent(searchQuery)}`;
              }}
            >
              Rechercher
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <Link key={cat.id} to={`/services?category=${cat.slug}`}>
                <span className="inline-flex items-center rounded-full border border-subtle bg-surface px-3 py-1.5 text-sm font-medium text-secondary transition-colors hover:border-primary-300 hover:text-primary-500">
                  {cat.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {valueProps.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="animate-fade-in-up rounded-lg border border-subtle bg-surface p-6"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="mb-3 inline-flex rounded-md bg-primary-50 p-2.5 text-primary-500">
                <Icon size={20} />
              </div>
              <h3 className="font-semibold text-primary">{title}</h3>
              <p className="mt-1 text-sm text-secondary">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services en vedette */}
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-primary lg:text-2xl">
            Services en vedette
          </h2>
          <Link
            to="/services"
            className="text-sm font-semibold text-primary-500 hover:underline"
          >
            Voir tout →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))
            : featuredServices.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
        </div>
        {!isLoading && featuredServices.length === 0 && (
          <p className="py-8 text-center text-sm text-secondary">
            Aucun service publié pour l'instant. Soyez le premier prestataire !
          </p>
        )}
      </section>

      {/* CTA devenir prestataire */}
      <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
        <div className="animate-scale-in rounded-xl bg-primary-500 px-8 py-12 text-center">
          <h2 className="font-heading text-2xl font-bold text-on-primary">
            Vous êtes un professionnel ?
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-primary-50">
            Rejoignez MboaPro et proposez vos services à des milliers de clients
            au Cameroun.
          </p>
          <Link
            to="/inscription"
            className={`mt-6 bg-accent-500! text-primary-50! mx-auto w-fit h-10 flex items-center justify-center px-4 text-sm gap-2 rounded-md hover:opacity-80 active:bg-primary-700 shadow-sm focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary-500 font-semibold transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer`}
          >
            Devenir prestataire
          </Link>
        </div>
      </section>
    </div>
  );
}
