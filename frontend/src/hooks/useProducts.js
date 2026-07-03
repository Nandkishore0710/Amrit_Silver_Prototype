import { useQuery } from '@tanstack/react-query';
import api from '../api';
import mockDb from '../utils/mockDb';

// Simulated delay to mimic network latency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      await delay(500);
      let filtered = mockDb.getProducts();
      if (params.category) {
        filtered = filtered.filter(p => p.category.toLowerCase() === params.category.toLowerCase());
      }
      if (params.search) {
        filtered = filtered.filter(p => p.title.toLowerCase().includes(params.search.toLowerCase()));
      }
      return { data: filtered, count: filtered.length, pages: 1 };
    },
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true
  });
};

export const useProduct = (slug) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      await delay(500);
      const product = mockDb.getProduct(slug);
      if (!product) throw new Error('Product not found');
      return product;
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      await delay(500);
      return mockDb.getProducts().filter(p => p.featured);
    },
    staleTime: 30 * 60 * 1000
  });
};

export const useBestSellers = () => {
  return useQuery({
    queryKey: ['products', 'best-sellers'],
    queryFn: async () => {
      await delay(500);
      return mockDb.getProducts().sort((a, b) => b.rating - a.rating).slice(0, 4);
    },
    staleTime: 30 * 60 * 1000
  });
};

export const useNewArrivals = () => {
  return useQuery({
    queryKey: ['products', 'new-arrivals'],
    queryFn: async () => {
      await delay(500);
      return mockDb.getProducts().slice(0, 4);
    },
    staleTime: 30 * 60 * 1000
  });
};

export const useRelatedProducts = (slug) => {
  return useQuery({
    queryKey: ['products', 'related', slug],
    queryFn: async () => {
      await delay(500);
      const product = mockDb.getProduct(slug);
      if (!product) return [];
      return mockDb.getProducts().filter(p => p.category === product.category && p.slug !== slug).slice(0, 4);
    },
    enabled: !!slug
  });
};
