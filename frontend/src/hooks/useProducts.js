import { useQuery } from '@tanstack/react-query';
import api from '../api';

export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const { data } = await api.get('/products', { params });
      return data;
    },
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true
  });
};

export const useProduct = (slug) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data } = await api.get(`/products/${slug}`);
      return data.data;
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data } = await api.get('/products/featured');
      return data.data;
    },
    staleTime: 30 * 60 * 1000
  });
};

export const useBestSellers = () => {
  return useQuery({
    queryKey: ['products', 'best-sellers'],
    queryFn: async () => {
      const { data } = await api.get('/products/best-sellers');
      return data.data;
    },
    staleTime: 30 * 60 * 1000
  });
};

export const useNewArrivals = () => {
  return useQuery({
    queryKey: ['products', 'new-arrivals'],
    queryFn: async () => {
      const { data } = await api.get('/products/new-arrivals');
      return data.data;
    },
    staleTime: 30 * 60 * 1000
  });
};

export const useRelatedProducts = (slug) => {
  return useQuery({
    queryKey: ['products', 'related', slug],
    queryFn: async () => {
      const { data } = await api.get(`/products/${slug}/related`);
      return data.data;
    },
    enabled: !!slug
  });
};
