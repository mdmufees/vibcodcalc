import { create } from 'zustand'
import type { CalculatorMode } from '@/types/calculator'
import { evaluate } from '@/engine/parser'
import { formatResult } from '@/engine/arithmetic'

interface CalculatorState {
  mode: CalculatorMode
  display: string
  expression: string
  isDeg: boolean
  hasResult: boolean
  error: string | null

  setMode: (mode: CalculatorMode) => void
  appendDigit: (digit: string) => void
  appendOperator: (op: string) => void
  appendFunction: (fn: string) => void
  appendConstant: (name: string, value: string) => void
  setExpression: (expr: string) => void
  toggleSign: () => void
  addDecimal: () => void
  backspace: () => void
  clear: () => void
  clearEntry: () => void
  toggleDeg: () => void
  evaluateExpression: () => { expression: string; result: string } | null
  openParen: () => void
  closeParen: () => void
}

export const useCalculatorStore = create<CalculatorState>()((set, get) => ({
  mode: 'standard',
  display: '0',
  expression: '',
  isDeg: true,
  hasResult: false,
  error: null,

  setMode: (mode) => set({ mode }),

  appendDigit: (digit) => {
    const { display, hasResult } = get()
    if (hasResult) {
      set({ display: digit, expression: '', hasResult: false, error: null })
      return
    }
    if (display === '0' && digit !== '.') {
      set({ display: digit, error: null })
    } else {
      set({ display: display + digit, error: null })
    }
  },

  appendOperator: (op) => {
    const { display, expression, hasResult } = get()
    if (hasResult) {
      set({ expression: display + ' ' + op + ' ', display: '0', hasResult: false, error: null })
      return
    }
    set({ expression: expression + display + ' ' + op + ' ', display: '0', error: null })
  },

  appendFunction: (fn) => {
    const { hasResult, display } = get()
    if (hasResult) {
      set({ expression: fn + '(' + display + ')', display: '0', hasResult: false, error: null })
      return
    }
    set({ expression: fn + '(', display: '0', error: null })
  },

  appendConstant: (name, value) => {
    const { hasResult } = get()
    if (hasResult) {
      set({ display: value, expression: '', hasResult: false, error: null })
      return
    }
    set({ display: value, error: null })
  },

  setExpression: (expr) => set({ expression: expr }),

  toggleSign: () => {
    const { display } = get()
    if (display === '0') return
    set({ display: display.startsWith('-') ? display.slice(1) : '-' + display })
  },

  addDecimal: () => {
    const { display, hasResult } = get()
    if (hasResult) {
      set({ display: '0.', expression: '', hasResult: false, error: null })
      return
    }
    if (!display.includes('.')) {
      set({ display: display + '.' })
    }
  },

  backspace: () => {
    const { display, hasResult } = get()
    if (hasResult) return
    if (display.length <= 1 || (display.length === 2 && display.startsWith('-'))) {
      set({ display: '0' })
    } else {
      set({ display: display.slice(0, -1) })
    }
  },

  clear: () => set({ display: '0', expression: '', hasResult: false, error: null }),

  clearEntry: () => set({ display: '0', error: null }),

  toggleDeg: () => set((s) => ({ isDeg: !s.isDeg })),

  openParen: () => {
    const { expression } = get()
    set({ expression: expression + '(', display: '0' })
  },

  closeParen: () => {
    const { display, expression } = get()
    set({ expression: expression + display + ')', display: '0' })
  },

  evaluateExpression: () => {
    const { expression, display, isDeg } = get()
    const fullExpr = expression + display
    if (!fullExpr.trim() || fullExpr.trim() === '0') return null

    try {
      const result = evaluate(fullExpr, { isDeg })
      const formatted = formatResult(result)
      set({ display: formatted, expression: '', hasResult: true, error: null })
      return { expression: fullExpr, result: formatted }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error'
      set({ error: msg })
      return null
    }
  }
}))
