import { apiClient, toApiError } from '../lib/apiClient';
import { normalizeCategory, normalizeProviderProfile, normalizeService } from '../utils/normalize';
import type { Category, CategoryMatch, PaginatedResult, PendingCategorySuggestion, ProviderContactInfo, ProviderProfile, Service, ServiceSearchFilters, Skill } from '../types/catalog.types';

export const catalogService = {
  getCategories: async (): Promise<Category[]> => {
    try {
      const { data } = await apiClient.get('/categories');
      return data.data.map(normalizeCategory);
    } catch (err) {
      throw toApiError(err);
    }
  },

  createCategory: async (formData: FormData): Promise<Category> => {
    try {
      const { data } = await apiClient.post('/categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
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

  searchSkills: async (categoryId: string | null, query: string): Promise<Skill[]> => {
    try {
      const { data } = await apiClient.get('/skills', { params: { category_id: categoryId, q: query } });
      return data.data.map((s: any) => ({ id: s.id, name: s.name }));
    } catch (err) {
      throw toApiError(err);
    }
  },

  searchServices: async (filters: ServiceSearchFilters): Promise<PaginatedResult<Service>> => {
    try {
      const { data } = await apiClient.get('/services', {
        params: { ...filters, skills: filters.skills?.join(',') },
      });
      return {
        items: data.data.items.map(normalizeService),
        pagination: data.data.pagination,
      };
    } catch (err) {
      throw toApiError(err);
    }
  },

  getServiceBySlug: async (slug: string): Promise<Service> => {
    try {
      const { data } = await apiClient.get(`/services/${slug}`);
      return normalizeService(data.data);
    } catch (err) {
      throw toApiError(err);
    }
  },

  getServicesByProvider: async (userId: string): Promise<Service[]> => {
    try {
      const { data } = await apiClient.get(`/providers/${userId}/services`);
      return data.data.map(normalizeService);
    } catch (err) {
      throw toApiError(err);
    }
  },
  getServiceReviews: async (serviceId: string) => {
    try {
      const { data } = await apiClient.get(`/services/${serviceId}/reviews`);
      return data.data;
    } catch (err) {
      throw toApiError(err);
    }
  },

  createService: async (formData: FormData): Promise<Service> => {
    try {
      const { data } = await apiClient.post('/services', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return normalizeService(data.data);
    } catch (err) {
      throw toApiError(err);
    }
  },

  toggleAvailability: async (serviceId: string, availability: string): Promise<void> => {
    try {
      await apiClient.patch(`/services/${serviceId}/availability`, { availability });
    } catch (err) {
      throw toApiError(err);
    }
  },

  deleteService: async (serviceId: string): Promise<void> => {
    try {
      await apiClient.delete(`/services/${serviceId}`);
    } catch (err) {
      throw toApiError(err);
    }
  },

  getProviderProfile: async (userId: string): Promise<ProviderProfile> => {
    try {
      const { data } = await apiClient.get(`/providers/${userId}`);
      return normalizeProviderProfile(data.data);
    } catch (err) {
      throw toApiError(err);
    }
  },

  // sendContactRequest: async (serviceId: string, message: string): Promise<void> => {
  //   try {
  //     await apiClient.post(`/services/${serviceId}/contact`, { message });
  //   } catch (err) {
  //     throw toApiError(err);
  //   }
  // },

  sendContactRequest: async (serviceId: string, message?: string): Promise<ProviderContactInfo> => {
    try {
      const { data } = await apiClient.post(`/services/${serviceId}/contact`, { message });
      return data.data.contact;
    } catch (err) {
      throw toApiError(err);
    }
  },

  updateService: async (id: string, formData: FormData): Promise<Service> => {
    try {
      const { data } = await apiClient.post(`/services/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return normalizeService(data.data);
    } catch (err) {
      throw toApiError(err);
    }
  },
  checkCategoryMatch: async (query: string): Promise<CategoryMatch[]> => {
    try {
      const { data } = await apiClient.get('/categories/check', { params: { q: query } });
      return data.data.map((m: any) => ({ title: m.title, slug: m.slug, score: Number(m.score) }));
    } catch (err) {
      throw toApiError(err);
    }
  },

  getMyCategorySuggestions: async (): Promise<PendingCategorySuggestion[]> => {
    try {
      const { data } = await apiClient.get('/prestataire/category-suggestions');
      return data.data.map((s: any) => ({
        id: s.id,
        proposedTitle: s.proposed_title,
        waitingServicesCount: Number(s.waiting_services_count),
        createdAt: s.created_at,
      }));
    } catch (err) {
      throw toApiError(err);
    }
  },

};