import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { HistoryEntry } from '@/types/history'

interface HistoryState {
  entries: HistoryEntry[]
  isOpen: boolean
  searchQuery: string
  addEntry: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void
  clearHistory: () => void
  removeEntry: (id: string) => void
  toggleOpen: () => void
  setSearchQuery: (query: string) => void
  getFiltered: () => HistoryEntry[]
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      entries: [],
      isOpen: false,
      searchQuery: '',

      addEntry: (entry) =>
        set((s) => ({
          entries: [
            { ...entry, id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), timestamp: Date.now() },
            ...s.entries
          ].slice(0, 500)
        })),

      clearHistory: () => set({ entries: [] }),

      removeEntry: (id) =>
        set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),

      toggleOpen: () => set((s) => ({ isOpen: !s.isOpen })),

      setSearchQuery: (query) => set({ searchQuery: query }),

      getFiltered: () => {
        const { entries, searchQuery } = get()
        if (!searchQuery) return entries
        const q = searchQuery.toLowerCase()
        return entries.filter(
          (e) =>
            e.expression.toLowerCase().includes(q) ||
            e.result.toLowerCase().includes(q)
        )
      }
    }),
    {
      name: 'vibcodcalc-history',
      partialize: (state) => ({ entries: state.entries })
    }
  )
)
