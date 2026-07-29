import {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  Heart,
  User,
  Wallet,
  Star,
  Users,
  ShieldCheck,
  Tags,
  CreditCard,
  Gavel,
  type LucideIcon,
} from 'lucide-react';
import type { UserRole } from '../types/auth.types';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
}

export const navigationByRole: Record<UserRole, NavItem[]> = {
  client: [
    { label: 'Tableau de bord', to: '/client', icon: LayoutDashboard, end: true },
    { label: 'Mes missions', to: '/client/missions', icon: Briefcase },
    { label: 'Messages', to: '/client/messages', icon: MessageSquare },
    { label: 'Favoris', to: '/client/favoris', icon: Heart },
    { label: 'Mon profil', to: '/client/profil', icon: User },
  ],
  prestataire: [
    { label: 'Tableau de bord', to: '/prestataire', icon: LayoutDashboard, end: true },
    { label: 'Mes prestations', to: '/prestataire/prestations', icon: Briefcase },
    { label: 'Commandes', to: '/prestataire/commandes', icon: MessageSquare },
    { label: 'Avis & réputation', to: '/prestataire/avis', icon: Star },
    { label: 'Revenus', to: '/prestataire/revenus', icon: Wallet },
    { label: 'Mon profil', to: '/prestataire/profil', icon: User },
  ],
  admin: [
    { label: 'Vue d\'ensemble', to: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Utilisateurs', to: '/admin/utilisateurs', icon: Users },
    { label: 'Prestataires', to: '/admin/prestataires', icon: ShieldCheck },
    { label: 'Catégories', to: '/admin/categories', icon: Tags },
    { label: 'Paiements', to: '/admin/paiements', icon: CreditCard },
    { label: 'Litiges', to: '/admin/litiges', icon: Gavel },
  ],
};