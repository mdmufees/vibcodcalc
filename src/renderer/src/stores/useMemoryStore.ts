import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface MemoryState {
  value: number
  hasValue: boolean
  memoryAdd: (n: number) => void
  memorySubtract: (n: number) => void
  memoryRecall: () => number
  memoryClear: () => void
}

export const useMemoryStore = create<MemoryState>()(
  persist(
    (set, get) => ({
      value: 0,
      hasValue: false,
      memoryAdd: (n) => set((s) => ({ value: s.value + n, hasValue: true })),
      memorySubtract: (n) => set((s) => ({ value: s.value - n, hasValue: true })),
      memoryRecall: () => get().value,
      memoryClear: () => set({ value: 0, hasValue: false })
    }),
    { name: 'vibcodcalc-memory' }
  )
)
