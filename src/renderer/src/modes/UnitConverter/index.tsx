import { useState, useEffect } from 'react'
import { CATEGORIES, convert } from '@/engine/units'

export default function UnitConverter() {
  const [categoryIdx, setCategoryIdx] = useState(0)
  const [fromUnit, setFromUnit] = useState('')
  const [toUnit, setToUnit] = useState('')
  const [fromValue, setFromValue] = useState('1')
  const [toValue, setToValue] = useState('')

  const category = CATEGORIES[categoryIdx]

  useEffect(() => {
    setFromUnit(category.units[0].id)
    setToUnit(category.units[1]?.id || category.units[0].id)
  }, [categoryIdx])

  useEffect(() => {
    const val = parseFloat(fromValue)
    if (isNaN(val)) {
      setToValue('')
      return
    }
    try {
      const result = convert(val, fromUnit, toUnit, category)
      setToValue(result.toPrecision(10).replace(/\.?0+$/, ''))
    } catch {
      setToValue('Error')
    }
  }, [fromValue, fromUnit, toUnit, category])

  const swap = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    setFromValue(toValue)
  }

  return (
    <div style={styles.container}>
      {/* Category selector */}
      <div style={styles.categories}>
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat.name}
            onClick={() => setCategoryIdx(i)}
            style={{
              ...styles.catBtn,
              ...(i === categoryIdx ? styles.catBtnActive : {})
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* From */}
      <div style={styles.convSection} className="glass-panel">
        <select
          value={fromUnit}
          onChange={(e) => setFromUnit(e.target.value)}
          style={styles.select}
        >
          {category.units.map((u) => (
            <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>
          ))}
        </select>
        <input
          type="text"
          value={fromValue}
          onChange={(e) => setFromValue(e.target.value)}
          style={styles.input}
          autoFocus
        />
      </div>

      {/* Swap */}
      <div style={styles.swapRow}>
        <button onClick={swap} style={styles.swapBtn} className="neon-text">⇅</button>
      </div>

      {/* To */}
      <div style={styles.convSection} className="glass-panel">
        <select
          value={toUnit}
          onChange={(e) => setToUnit(e.target.value)}
          style={styles.select}
        >
          {category.units.map((u) => (
            <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>
          ))}
        </select>
        <div style={styles.resultDisplay} className="neon-text">
          {toValue || '0'}
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    gap: 8
  },
  categories: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 4
  },
  catBtn: {
    padding: '6px 10px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--glass-border)',
    background: 'var(--btn-bg)',
    color: 'var(--text-secondary)',
    fontSize: 11,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'var(--transition-fast)'
  },
  catBtnActive: {
    background: 'rgba(var(--accent-rgb), 0.2)',
    color: 'var(--accent)',
    borderColor: 'rgba(var(--accent-rgb), 0.4)'
  },
  convSection: {
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--glass-border)',
    background: 'var(--btn-bg)',
    color: 'var(--text-primary)',
    fontSize: 13,
    outline: 'none',
    cursor: 'pointer'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--glass-border)',
    background: 'var(--btn-bg)',
    color: 'var(--text-primary)',
    fontSize: 24,
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    outline: 'none',
    textAlign: 'right'
  },
  swapRow: {
    display: 'flex',
    justifyContent: 'center'
  },
  swapBtn: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: '1px solid rgba(var(--accent-rgb), 0.3)',
    background: 'rgba(var(--accent-rgb), 0.1)',
    fontSize: 20,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  resultDisplay: {
    fontSize: 24,
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    textAlign: 'right',
    padding: '10px 12px'
  }
}
