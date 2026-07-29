export interface AuthSlide {
  imageUrl: string;
  badges: string[];
  title: string;
  description: string;
}

export const authSlides: AuthSlide[] = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=80',
    badges: ['Réputation vérifiée', 'Paiement sécurisé'],
    title: 'Des professionnels de confiance, à portée de main',
    description:
      'Plombiers, électriciens, coachs et bien plus — chaque avis est authentifié après mission réalisée.',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80',
    badges: ['+800 prestataires', 'Toutes les régions du Cameroun'],
    title: 'Développez votre activité sur MboaPro',
    description: 'Proposez vos compétences à des milliers de clients partout au Cameroun.',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80',
    badges: ['Réponse rapide', 'Support 7j/7'],
    title: 'Une mise en relation simple et rapide',
    description: 'Trouvez le bon professionnel en quelques minutes, où que vous soyez.',
  },
];