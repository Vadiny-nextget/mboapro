import { apiClient, toApiError } from '../lib/apiClient';
import { normalizeCategory, normalizePendingProvider } from '../utils/normalize';
import type { AdminDashboardStats, PaginatedUsers, PendingProvider } from '../types/admin.types';
import type { Category } from '../types/catalog.types';

export const adminService = {
  getDashboard: async (): Promise<AdminDashboardStats> => {
    try {
      const { data } = await apiClient.get('/admin/dashboard');
      return data.data;
    } catch (err) {
      throw toApiError(err);
    }
  },

  getUsers: async (params: { role?: string; search?: string; page?: number }): Promise<PaginatedUsers> => {
    try {
      const { data } = await apiClient.get('/admin/users', { params });
      return data.data;
    } catch (err) {
      throw toApiError(err);
    }
  },

  promoteToAdmin: async (userId: string): Promise<void> => {
    try {
      await apiClient.post(`/admin/users/${userId}/promote`);
    } catch (err) {
      throw toApiError(err);
    }
  },

  updateUserStatus: async (userId: string, status: 'active' | 'suspended'): Promise<void> => {
    try {
      await apiClient.post(`/admin/users/${userId}/suspend`, { status });
    } catch (err) {
      throw toApiError(err);
    }
  },

  getPendingProviders: async (): Promise<PendingProvider[]> => {
    try {
      const { data } = await apiClient.get('/admin/providers/pending');
      return data.data.map(normalizePendingProvider);
    } catch (err) {
      throw toApiError(err);
    }
  },

  verifyProvider: async (profileId: string, status: 'verified' | 'rejected'): Promise<void> => {
    try {
      await apiClient.post(`/admin/providers/${profileId}/verify`, { status });
    } catch (err) {
      throw toApiError(err);
    }
  },

  getAllCategories: async (): Promise<Category[]> => {
    try {
      const { data } = await apiClient.get('/categories');
      return data.data.map(normalizeCategory);
    } catch (err) {
      throw toApiError(err);
    }
  },

  createCategory: async (formData: FormData): Promise<Category> => {
    try {
      const { data } = await apiClient.post('/categories', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      return normalizeCategory(data.data);
    } catch (err) {
      throw toApiError(err);
    }
  },

  updateCategory: async (id: string, formData: FormData): Promise<Category> => {
    try {
      const { data } = await apiClient.post(`/categories/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      return normalizeCategory(data.data);
    } catch (err) {
      throw toApiError(err);
    }
  },

  deleteCategory: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/categories/${id}`);
    } catch (err) {
      throw toApiError(err);
    }
  },
};