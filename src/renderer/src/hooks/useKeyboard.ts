import { useEffect } from 'react'
import { useCalculatorStore } from '@/stores/useCalculatorStore'
import { useHistoryStore } from '@/stores/useHistoryStore'
import type { CalculatorMode } from '@/types/calculator'

const MODE_MAP: Record<string, CalculatorMode> = {
  '1': 'standard',
  '2': 'scientific',
  '3': 'graphing',
  '4': 'programmer',
  '5': 'converter',
  '6': 'financial',
  '7': 'matrix',
  '8': 'statistics'
}

export function useKeyboard() {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Skip if focused on an input element
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      const store = useCalculatorStore.getState()
      const historyStore = useHistoryStore.getState()

      // Ctrl shortcuts
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'h' || e.key === 'H') {
          e.preventDefault()
          historyStore.toggleOpen()
          return
        }
        if (MODE_MAP[e.key]) {
          e.preventDefault()
          store.setMode(MODE_MAP[e.key])
          return
        }
        return
      }

      // Digits
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault()
        store.appendDigit(e.key)
        return
      }

      // Operators
      switch (e.key) {
        case '+':
          e.preventDefault()
          store.appendOperator('+')
          return
        case '-':
          e.preventDefault()
          store.appendOperator('-')
          return
        case '*':
          e.preventDefault()
          store.appendOperator('×')
          return
        case '/':
          e.preventDefault()
          store.appendOperator('÷')
          return
        case '%':
          e.preventDefault()
          store.appendOperator('%')
          return
        case '^':
          e.preventDefault()
          store.appendOperator('^')
          return
        case '.':
          e.preventDefault()
          store.addDecimal()
          return
        case 'Enter':
        case '=':
          e.preventDefault()
          const result = store.evaluateExpression()
          if (result) {
            historyStore.addEntry({
              expression: result.expression,
              result: result.result,
              mode: store.mode
            })
          }
          return
        case 'Backspace':
          e.preventDefault()
          store.backspace()
          return
        case 'Escape':
          e.preventDefault()
          store.clear()
          return
        case 'Delete':
          e.preventDefault()
          store.clearEntry()
          return
        case '(':
          e.preventDefault()
          store.openParen()
          return
        case ')':
          e.preventDefault()
          store.closeParen()
          return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
}
