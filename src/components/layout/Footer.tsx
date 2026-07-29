import { Link } from 'react-router-dom';

const columns = [
  {
    title: 'MboaPro',
    links: [
      { label: 'À propos', to: '/a-propos' },
      { label: 'Comment ça marche', to: '/comment-ca-marche' },
      { label: 'Devenir prestataire', to: '/inscription/prestataire' },
    ],
  },
  {
    title: 'Catégories',
    links: [
      { label: 'Plomberie', to: '/services?categorie=plomberie' },
      { label: 'Électricité', to: '/services?categorie=electricite' },
      { label: 'Coiffure à domicile', to: '/services?categorie=coiffure' },
      { label: 'Coaching', to: '/services?categorie=coaching' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Centre d\u2019aide', to: '/aide' },
      { label: 'Conditions d\u2019utilisation', to: '/conditions' },
      { label: 'Confidentialité', to: '/confidentialite' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-subtle bg-(--bg-surface)!">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          <div>
            <span className="font-heading text-xl font-bold text-primary-500">
              Mboa<span className="text-accent-500">Pro</span>
            </span>
            <p className="mt-3 text-sm text-secondary">
              La marketplace des services professionnels au Cameroun — réputation vérifiée.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#" aria-label="Facebook" className="text-muted hover:text-primary-500">
                <Facebook/>
              </a>
              <a href="#" aria-label="Instagram" className="text-muted hover:text-primary-500">
                <Instagram/>
              </a>
              <a href="#" aria-label="LinkedIn" className="text-muted hover:text-primary-500">
                <Linkedin/>
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-sm font-semibold text-primary">{col.title}</h4>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-secondary hover:text-primary-500">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="my-8 border-subtle" />
        <p className="text-center text-xs text-muted">
          &copy; {new Date().getFullYear()} MboaPro — Nextget Consulting. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}


export function Facebook() {
  return (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <title>Facebook</title>
      <path d="M22 12.073C22 6.48 17.523 2 12 2S2 6.48 2 12.073c0 4.994 3.657 9.123 8.438 9.926v-7.03H7.898v-2.896h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.772-1.63 1.562v1.875h2.773l-.443 2.896h-2.33v7.03C18.343 21.196 22 17.067 22 12.073z" />
    </svg>
  );
}

export function Instagram() {
  return (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <title>Instagram</title>
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm8.5 1.5h-8.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm-4.25 3.5a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5.5-.75a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
    </svg>
  );
}

export function Linkedin() {
  return (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <title>LinkedIn</title>
      <path d="M20.45 20.45h-3.555v-5.57c0-1.328-.024-3.038-1.852-3.038-1.853 0-2.136 1.445-2.136 2.94v5.668h-3.554V9h3.413v1.561h.049c.476-.902 1.636-1.854 3.37-1.854 3.602 0 4.266 2.371 4.266 5.456v6.287zm-15.08-11.64a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126zm1.777 11.64H3.59V9h3.554v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.205 24 24 23.226 24 22.271V1.729C24 .774 23.205 0 22.225 0z" />
    </svg>
  );
}