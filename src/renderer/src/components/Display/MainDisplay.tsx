import { useCalculatorStore } from '@/stores/useCalculatorStore'

export default function MainDisplay() {
  const display = useCalculatorStore((s) => s.display)
  const expression = useCalculatorStore((s) => s.expression)
  const error = useCalculatorStore((s) => s.error)

  const displayFontSize = display.length > 12 ? 28 : display.length > 8 ? 34 : 42

  return (
    <div style={styles.container} className="glass-panel">
      <div style={styles.expression}>{expression || '\u00A0'}</div>
      <div
        style={{
          ...styles.display,
          fontSize: displayFontSize,
          color: error ? '#ff5555' : 'var(--text-primary)'
        }}
        className={!error ? 'neon-text' : ''}
      >
        {error || display}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '12px 16px',
    marginBottom: 8,
    textAlign: 'right',
    minHeight: 100,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },
  expression: {
    fontSize: 14,
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-display)',
    marginBottom: 4,
    minHeight: 20,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  display: {
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    lineHeight: 1.2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    transition: 'font-size var(--transition-fast)'
  }
}
