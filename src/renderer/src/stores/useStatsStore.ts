import { create } from 'zustand'

interface StatsState {
  dataInput: string
  data: number[]
  setDataInput: (input: string) => void
  parseData: () => void
  clearData: () => void
}

export const useStatsStore = create<StatsState>()((set, get) => ({
  dataInput: '',
  data: [],

  setDataInput: (input) => set({ dataInput: input }),

  parseData: () => {
    const { dataInput } = get()
    const nums = dataInput
      .split(/[,\s\n]+/)
      .map((s) => s.trim())
      .filter((s) => s !== '')
      .map(Number)
      .filter((n) => !isNaN(n))
    set({ data: nums })
  },

  clearData: () => set({ dataInput: '', data: [] })
}))
