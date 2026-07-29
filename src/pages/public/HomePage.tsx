import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import Tag from '../../components/ui/Tag';
import ProviderCard from '../../components/ui/ProviderCard';
import { mockProviders, categories } from '../../data/mockProviders';
import { Button } from '../../components/ui/Input';

const valueProps = [
  {
    title: 'Réputation vérifiée',
    desc: 'Chaque avis est authentifié après mission réalisée. Zéro faux profil.',
  },
  {
    title: 'Réponse rapide',
    desc: 'Les meilleurs prestataires répondent en moins d\u2019une heure.',
  },
  {
    title: 'Paiement sécurisé',
    desc: 'Les fonds sont débloqués uniquement après validation de la mission.',
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-linear-to-b from-primary-50 to-page px-4 py-16 lg:py-24">
        <div className="mx-auto max-w-3xl animate-fade-in-up text-center">
          <h1 className="font-heading text-3xl font-bold text-primary lg:text-4xl">
            Trouvez le bon professionnel,{' '}
            <span className="text-primary-500">en toute confiance</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-secondary">
            Plombiers, électriciens, coiffeurs à domicile, coachs, traducteurs,
            comptables freelances — tous vérifiés par MboaPro.
          </p>

          {/* Barre de recherche */}
          <div className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-lg border border-subtle bg-surface p-2 shadow-md">
            <Search size={18} className="ml-2 text-muted" />
            <input
              type="text"
              placeholder="Ex: plombier à Douala..."
              className="flex-1 bg-transparent px-2 py-2 text-sm text-primary outline-none placeholder:text-muted"
            />
            <Button>Rechercher</Button>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <Tag key={cat}>{cat}</Tag>
            ))}
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {valueProps.map(({ title, desc }, i) => (
            <div
              key={title}
              className="animate-fade-in-up rounded-lg border border-subtle bg-surface p-6"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <h3 className="font-semibold text-primary">{title}</h3>
              <p className="mt-1 text-sm text-secondary">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Prestataires en vedette */}
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-primary lg:text-2xl">
            Prestataires en vedette
          </h2>
          <Link to="/services" className="text-sm font-semibold text-primary-500 hover:underline">
            Voir tout →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mockProviders.map((p) => (
            <ProviderCard key={p.id} provider={p} />
          ))}
        </div>
      </section>

      {/* CTA devenir prestataire */}
      <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
        <div className="animate-scale-in rounded-xl bg-primary-500 px-8 py-12 text-center">
          <h2 className="font-heading text-2xl font-bold text-on-primary">
            Vous êtes un professionnel ?
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-primary-50">
            Rejoignez MboaPro et proposez vos services à des milliers de clients au Cameroun.
          </p>
          <Link to="/inscription/prestataire" className={`mt-6 bg-accent-500! text-primary-50! mx-auto w-fit h-10 flex items-center justify-center px-4 text-sm gap-2 rounded-md hover:opacity-80 active:bg-primary-700 shadow-sm focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary-500 font-semibold transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer`}>
              Devenir prestataire
          </Link>
        </div>
      </section>
    </div>
  );
}