import MainDisplay from '@/components/Display/MainDisplay'
import CalcButton from '@/components/Buttons/CalcButton'
import { useCalculatorStore } from '@/stores/useCalculatorStore'
import { useHistoryStore } from '@/stores/useHistoryStore'

export default function ScientificCalc() {
  const store = useCalculatorStore()
  const addHistory = useHistoryStore((s) => s.addEntry)

  const handleEval = () => {
    const result = store.evaluateExpression()
    if (result) {
      addHistory({ expression: result.expression, result: result.result, mode: 'scientific' })
    }
  }

  return (
    <div style={styles.container}>
      <MainDisplay />
      <div style={styles.degToggle}>
        <button
          style={{ ...styles.toggleBtn, ...(store.isDeg ? styles.toggleActive : {}) }}
          onClick={() => store.isDeg || store.toggleDeg()}
        >
          DEG
        </button>
        <button
          style={{ ...styles.toggleBtn, ...(!store.isDeg ? styles.toggleActive : {}) }}
          onClick={() => !store.isDeg || store.toggleDeg()}
        >
          RAD
        </button>
      </div>
      <div style={styles.sciRow}>
        <CalcButton label="sin" onClick={() => store.appendFunction('sin')} variant="function" fontSize={12} />
        <CalcButton label="cos" onClick={() => store.appendFunction('cos')} variant="function" fontSize={12} />
        <CalcButton label="tan" onClick={() => store.appendFunction('tan')} variant="function" fontSize={12} />
        <CalcButton label="(" onClick={store.openParen} variant="function" />
        <CalcButton label=")" onClick={store.closeParen} variant="function" />
      </div>
      <div style={styles.sciRow}>
        <CalcButton label="asin" onClick={() => store.appendFunction('asin')} variant="function" fontSize={11} />
        <CalcButton label="acos" onClick={() => store.appendFunction('acos')} variant="function" fontSize={11} />
        <CalcButton label="atan" onClick={() => store.appendFunction('atan')} variant="function" fontSize={11} />
        <CalcButton label="π" onClick={() => store.appendConstant('π', '3.14159265358979')} variant="function" />
        <CalcButton label="e" onClick={() => store.appendConstant('e', '2.71828182845905')} variant="function" />
      </div>
      <div style={styles.sciRow}>
        <CalcButton label="x²" onClick={() => store.appendOperator('^')} variant="function" fontSize={12} />
        <CalcButton label="√" onClick={() => store.appendFunction('sqrt')} variant="function" />
        <CalcButton label="log" onClick={() => store.appendFunction('log')} variant="function" fontSize={12} />
        <CalcButton label="ln" onClick={() => store.appendFunction('ln')} variant="function" fontSize={12} />
        <CalcButton label="n!" onClick={() => { store.appendOperator('!') }} variant="function" fontSize={12} />
      </div>
      <div style={styles.grid}>
        <CalcButton label="C" onClick={store.clear} variant="function" />
        <CalcButton label="⌫" onClick={store.backspace} variant="function" />
        <CalcButton label="%" onClick={() => store.appendOperator('%')} variant="function" />
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
  degToggle: {
    display: 'flex',
    gap: 2,
    marginBottom: 4,
    padding: '0 4px'
  },
  toggleBtn: {
    flex: 1,
    padding: '6px 0',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--glass-border)',
    background: 'var(--btn-bg)',
    color: 'var(--text-secondary)',
    fontSize: 12,
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'var(--transition-fast)'
  },
  toggleActive: {
    background: 'rgba(var(--accent-rgb), 0.2)',
    color: 'var(--accent)',
    borderColor: 'rgba(var(--accent-rgb), 0.4)'
  },
  sciRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 4
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 4,
    flex: 1
  }
}
