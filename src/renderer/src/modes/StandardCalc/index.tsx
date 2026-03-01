import MainDisplay from '@/components/Display/MainDisplay'
import CalcButton from '@/components/Buttons/CalcButton'
import { useCalculatorStore } from '@/stores/useCalculatorStore'
import { useHistoryStore } from '@/stores/useHistoryStore'
import { useMemoryStore } from '@/stores/useMemoryStore'

export default function StandardCalc() {
  const store = useCalculatorStore()
  const addHistory = useHistoryStore((s) => s.addEntry)
  const memory = useMemoryStore()

  const handleEval = () => {
    const result = store.evaluateExpression()
    if (result) {
      addHistory({ expression: result.expression, result: result.result, mode: 'standard' })
    }
  }

  const handleMemoryRecall = () => {
    const val = memory.memoryRecall()
    store.appendDigit(String(val))
  }

  const handleMemoryAdd = () => {
    const val = parseFloat(store.display)
    if (!isNaN(val)) memory.memoryAdd(val)
  }

  const handleMemorySub = () => {
    const val = parseFloat(store.display)
    if (!isNaN(val)) memory.memorySubtract(val)
  }

  return (
    <div style={styles.container}>
      <MainDisplay />
      <div style={styles.memoryRow}>
        <CalcButton label="MC" onClick={memory.memoryClear} variant="function" />
        <CalcButton label="MR" onClick={handleMemoryRecall} variant="function" />
        <CalcButton label="M+" onClick={handleMemoryAdd} variant="function" />
        <CalcButton label="M-" onClick={handleMemorySub} variant="function" />
      </div>
      <div style={styles.grid}>
        <CalcButton label="C" onClick={store.clear} variant="function" />
        <CalcButton label="CE" onClick={store.clearEntry} variant="function" />
        <CalcButton label="⌫" onClick={store.backspace} variant="function" />
        <CalcButton label="÷" onClick={() => store.appendOperator('÷')} variant="operator" />

        <CalcButton label="7" onClick={() => store.appendDigit('7')} />
        <CalcButton label="8" onClick={() => store.appendDigit('8')} />
        <CalcButton label="9" onClick={() => store.appendDigit('9')} />
        <CalcButton label="×" onClick={() => store.appendOperator('×')} variant="operator" />

        <CalcButton label="4" onClick={() => store.appendDigit('4')} />
        <CalcButton label="5" onClick={() => store.appendDigit('5')} />
        <CalcButton label="6" onClick={() => store.appendDigit('6')} />
        <CalcButton label="-" onClick={() => store.appendOperator('-')} variant="operator" />

        <CalcButton label="1" onClick={() => store.appendDigit('1')} />
        <CalcButton label="2" onClick={() => store.appendDigit('2')} />
        <CalcButton label="3" onClick={() => store.appendDigit('3')} />
        <CalcButton label="+" onClick={() => store.appendOperator('+')} variant="operator" />

        <CalcButton label="±" onClick={store.toggleSign} variant="function" />
        <CalcButton label="0" onClick={() => store.appendDigit('0')} />
        <CalcButton label="." onClick={store.addDecimal} />
        <CalcButton label="=" onClick={handleEval} variant="accent" />
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    gap: 4
  },
  memoryRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 4,
    marginBottom: 4
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 4,
    flex: 1
  }
}
