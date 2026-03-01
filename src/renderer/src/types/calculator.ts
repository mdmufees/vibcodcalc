export type CalculatorMode =
  | 'standard'
  | 'scientific'
  | 'graphing'
  | 'programmer'
  | 'converter'
  | 'financial'
  | 'matrix'
  | 'statistics'

export interface ModeInfo {
  id: CalculatorMode
  label: string
  icon: string
  shortcut: string
}

export const MODES: ModeInfo[] = [
  { id: 'standard', label: 'Standard', icon: '🔢', shortcut: '1' },
  { id: 'scientific', label: 'Scientific', icon: 'ƒ', shortcut: '2' },
  { id: 'graphing', label: 'Graphing', icon: '📈', shortcut: '3' },
  { id: 'programmer', label: 'Programmer', icon: '⟨⟩', shortcut: '4' },
  { id: 'converter', label: 'Converter', icon: '⇄', shortcut: '5' },
  { id: 'financial', label: 'Financial', icon: '$', shortcut: '6' },
  { id: 'matrix', label: 'Matrix', icon: '▦', shortcut: '7' },
  { id: 'statistics', label: 'Statistics', icon: 'σ', shortcut: '8' }
]
