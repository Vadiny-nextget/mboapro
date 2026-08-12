import type { AuthUser } from '../types/auth.types';

export function getFullName(user: Pick<AuthUser, 'firstName' | 'lastName'>): string {
  return `${user.firstName} ${user.lastName}`.trim();
}