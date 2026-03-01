import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AccentColor, ThemeMode } from '@/types/theme'

interface ThemeState {
  accent: AccentColor
  mode: ThemeMode
  setAccent: (accent: AccentColor) => void
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      accent: 'cyan',
      mode: 'dark',
      setAccent: (accent) => {
        document.documentElement.setAttribute('data-accent', accent)
        set({ accent })
      },
      setMode: (mode) => {
        document.documentElement.setAttribute('data-theme', mode)
        set({ mode })
      },
      toggleMode: () =>
        set((state) => {
          const mode = state.mode === 'dark' ? 'light' : 'dark'
          document.documentElement.setAttribute('data-theme', mode)
          return { mode }
        })
    }),
    {
      name: 'vibcodcalc-theme',
      onRehydrate: (_state, options) => {
        return (rehydratedState) => {
          if (rehydratedState) {
            document.documentElement.setAttribute('data-accent', rehydratedState.accent)
            document.documentElement.setAttribute('data-theme', rehydratedState.mode)
          }
        }
      }
    }
  )
)
