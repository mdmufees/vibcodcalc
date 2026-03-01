import { create } from 'zustand'
import type { GraphFunction, Viewport, TracePoint } from '@/types/graph'

const COLORS = ['#00e5ff', '#ff00e5', '#39ff14', '#ff6600', '#bf00ff']

interface GraphState {
  functions: GraphFunction[]
  viewport: Viewport
  traceEnabled: boolean
  tracePoint: TracePoint | null

  addFunction: (expression: string) => void
  removeFunction: (id: string) => void
  updateFunction: (id: string, expression: string) => void
  toggleVisibility: (id: string) => void
  setViewport: (vp: Partial<Viewport>) => void
  zoom: (factor: number) => void
  pan: (dx: number, dy: number) => void
  resetViewport: () => void
  setTraceEnabled: (enabled: boolean) => void
  setTracePoint: (point: TracePoint | null) => void
}

const DEFAULT_VIEWPORT: Viewport = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 }

export const useGraphStore = create<GraphState>()((set, get) => ({
  functions: [{ id: '1', expression: '', color: COLORS[0], visible: true }],
  viewport: { ...DEFAULT_VIEWPORT },
  traceEnabled: false,
  tracePoint: null,

  addFunction: (expression) => {
    const { functions } = get()
    if (functions.length >= 5) return
    const id = Date.now().toString(36)
    const color = COLORS[functions.length % COLORS.length]
    set({ functions: [...functions, { id, expression, color, visible: true }] })
  },

  removeFunction: (id) =>
    set((s) => ({ functions: s.functions.filter((f) => f.id !== id) })),

  updateFunction: (id, expression) =>
    set((s) => ({
      functions: s.functions.map((f) => f.id === id ? { ...f, expression } : f)
    })),

  toggleVisibility: (id) =>
    set((s) => ({
      functions: s.functions.map((f) => f.id === id ? { ...f, visible: !f.visible } : f)
    })),

  setViewport: (vp) => set((s) => ({ viewport: { ...s.viewport, ...vp } })),

  zoom: (factor) =>
    set((s) => {
      const { xMin, xMax, yMin, yMax } = s.viewport
      const xCenter = (xMin + xMax) / 2
      const yCenter = (yMin + yMax) / 2
      const xRange = (xMax - xMin) * factor / 2
      const yRange = (yMax - yMin) * factor / 2
      return {
        viewport: {
          xMin: xCenter - xRange,
          xMax: xCenter + xRange,
          yMin: yCenter - yRange,
          yMax: yCenter + yRange
        }
      }
    }),

  pan: (dx, dy) =>
    set((s) => ({
      viewport: {
        xMin: s.viewport.xMin + dx,
        xMax: s.viewport.xMax + dx,
        yMin: s.viewport.yMin + dy,
        yMax: s.viewport.yMax + dy
      }
    })),

  resetViewport: () => set({ viewport: { ...DEFAULT_VIEWPORT } }),

  setTraceEnabled: (enabled) => set({ traceEnabled: enabled, tracePoint: enabled ? get().tracePoint : null }),
  setTracePoint: (point) => set({ tracePoint: point })
}))
