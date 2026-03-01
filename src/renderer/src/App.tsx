import AppShell from '@/components/Layout/AppShell'
import HistoryPanel from '@/components/History/HistoryPanel'
import ThemeSelector from '@/components/common/ThemeSelector'
import { useCalculatorStore } from '@/stores/useCalculatorStore'
import { useKeyboard } from '@/hooks/useKeyboard'

import StandardCalc from '@/modes/StandardCalc'
import ScientificCalc from '@/modes/ScientificCalc'
import GraphingCalc from '@/modes/GraphingCalc'
import ProgrammerCalc from '@/modes/ProgrammerCalc'
import UnitConverter from '@/modes/UnitConverter'
import FinancialCalc from '@/modes/FinancialCalc'
import MatrixCalc from '@/modes/MatrixCalc'
import StatsCalc from '@/modes/StatsCalc'

const MODE_COMPONENTS = {
  standard: StandardCalc,
  scientific: ScientificCalc,
  graphing: GraphingCalc,
  programmer: ProgrammerCalc,
  converter: UnitConverter,
  financial: FinancialCalc,
  matrix: MatrixCalc,
  statistics: StatsCalc
} as const

export default function App() {
  useKeyboard()
  const mode = useCalculatorStore((s) => s.mode)
  const ModeComponent = MODE_COMPONENTS[mode]

  return (
    <AppShell>
      <div style={styles.themeRow}>
        <ThemeSelector />
      </div>
      <div style={styles.modeContent} className="animate-fade-in" key={mode}>
        <ModeComponent />
      </div>
      <HistoryPanel />
    </AppShell>
  )
}

const styles: Record<string, React.CSSProperties> = {
  themeRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: 4
  },
  modeContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  }
}
