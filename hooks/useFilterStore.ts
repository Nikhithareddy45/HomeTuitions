import { create } from 'zustand';

type FilterState = {
  selectedFilters: Record<string, string[]>;
  setFilters: (filters: Record<string, string[]>) => void;
  clearFilters: () => void;
};

export const useFilterStore = create<FilterState>(set => ({
  selectedFilters: {},

  setFilters: (filters) => set({ selectedFilters: filters }),

  clearFilters: () => set({ selectedFilters: {} }),
}));
