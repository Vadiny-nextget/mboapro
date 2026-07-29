export interface ServiceCategory {
  id: string;
  label: string;
  skills: string[];
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'plomberie',
    label: 'Plomberie',
    skills: ['Général','Fuites', 'Sanitaires', 'Chauffe-eau', 'Canalisations', 'Robinetterie', 'Fosses septiques', 'Autres'],
  },
  {
    id: 'electricite',
    label: 'Électricité',
    skills: ['Général','Installation', 'Dépannage', 'Tableaux électriques', 'Éclairage', 'Domotique', 'Groupes électrogènes', 'Autres'],
  },
  {
    id: 'coiffure',
    label: 'Coiffure à domicile',
    skills: ['Général','Tresses', 'Coloration', 'Soins', 'Coupe homme', 'Coupe femme', 'Extensions', 'Autres'],
  },
  {
    id: 'coaching',
    label: 'Coaching',
    skills: ['Général','Coaching de vie', 'Carrière', 'Confiance en soi', 'Coaching sportif', 'Coaching business', 'Autres'],
  },
  {
    id: 'traduction',
    label: 'Traduction',
    skills: ['Général','Traduction juridique', 'Interprétariat', 'Traduction technique', 'Sous-titrage', 'Autres'],
  },
  {
    id: 'comptabilite',
    label: 'Comptabilité freelance',
    skills: ['Général','Bilans', 'Fiscalité', 'Paie', 'Audit', 'Prévisionnel', 'Déclarations fiscales', 'Autres'],
  },
];