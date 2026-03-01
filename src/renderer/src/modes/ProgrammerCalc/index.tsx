import { useState, useCallback } from 'react'
import CalcButton from '@/components/Buttons/CalcButton'
import * as prog from '@/engine/programmer'
import type { NumBase, WordSize } from '@/engine/programmer'

export default function ProgrammerCalc() {
  const [value, setValue] = useState<bigint>(0n)
  const [base, setBase] = useState<NumBase>('DEC')
  const [wordSize, setWordSize] = useState<WordSize>('DWORD')
  const [inputBuffer, setInputBuffer] = useState('0')

  const commitInput = useCallback(() => {
    try {
      const v = prog.fromBase(inputBuffer, base)
      setValue(prog.clampToSize(v, wordSize))
    } catch {
      /* ignore parse errors */
    }
  }, [inputBuffer, base, wordSize])

  const appendDigit = (d: string) => {
    const newBuf = inputBuffer === '0' ? d : inputBuffer + d
    setInputBuffer(newBuf)
    try {
      const v = prog.fromBase(newBuf, base)
      setValue(prog.clampToSize(v, wordSize))
    } catch { /* ignore */ }
  }

  const clear = () => {
    setValue(0n)
    setInputBuffer('0')
  }

  const applyOp = (op: string) => {
    // For unary NOT
    if (op === 'NOT') {
      const result = prog.bitwiseNot(value, wordSize)
      setValue(result)
      setInputBuffer(prog.toBase(result, base, wordSize))
    }
  }

  const changeBase = (newBase: NumBase) => {
    setBase(newBase)
    setInputBuffer(prog.toBase(value, newBase, wordSize))
  }

  const changeWordSize = (ws: WordSize) => {
    setWordSize(ws)
    const clamped = prog.clampToSize(value, ws)
    setValue(clamped)
    setInputBuffer(prog.toBase(clamped, base, ws))
  }

  const handleToggleBit = (bitIndex: number) => {
    const newVal = prog.toggleBit(value, bitIndex, wordSize)
    setValue(newVal)
    setInputBuffer(prog.toBase(newVal, base, wordSize))
  }

  const bits = prog.getBits(value, wordSize)
  const bitCount = prog.getBitCount(wordSize)

  const hexDigits = '0123456789ABCDEF'.split('')
  const isValidDigit = (d: string) => {
    switch (base) {
      case 'BIN': return '01'.includes(d)
      case 'OCT': return '01234567'.includes(d)
      case 'DEC': return '0123456789'.includes(d)
      case 'HEX': return true
    }
  }

  return (
    <div style={styles.container}>
      {/* Base displays */}
      <div style={styles.baseDisplays} className="glass-panel">
        {(['HEX', 'DEC', 'OCT', 'BIN'] as NumBase[]).map((b) => (
          <button
            key={b}
            onClick={() => changeBase(b)}
            style={{
              ...styles.baseRow,
              ...(b === base ? styles.baseRowActive : {})
            }}
          >
            <span style={styles.baseLabel}>{b}</span>
            <span style={{
              ...styles.baseValue,
              ...(b === base ? { color: 'var(--accent)' } : {})
            }}>
              {prog.toBase(value, b, wordSize)}
            </span>
          </button>
        ))}
      </div>

      {/* Word size selector */}
      <div style={styles.wordSizeRow}>
        {(['BYTE', 'WORD', 'DWORD', 'QWORD'] as WordSize[]).map((ws) => (
          <button
            key={ws}
            onClick={() => changeWordSize(ws)}
            style={{
              ...styles.wsBtn,
              ...(ws === wordSize ? styles.wsBtnActive : {})
            }}
          >
            {ws}
          </button>
        ))}
      </div>

      {/* Bit grid */}
      <div style={styles.bitGrid} className="glass-panel-sm">
        {bits.map((bit, i) => (
          <button
            key={i}
            onClick={() => handleToggleBit(bitCount - 1 - i)}
            style={{
              ...styles.bitCell,
              background: bit ? 'rgba(var(--accent-rgb), 0.3)' : 'var(--btn-bg)',
              color: bit ? 'var(--accent)' : 'var(--text-muted)'
            }}
          >
            {bit ? '1' : '0'}
          </button>
        ))}
      </div>

      {/* Buttons */}
      <div style={styles.grid}>
        {hexDigits.map((d) => (
          <CalcButton
            key={d}
            label={d}
            onClick={() => appendDigit(d)}
            variant={isValidDigit(d) ? 'default' : 'function'}
            fontSize={14}
          />
        ))}
        <CalcButton label="NOT" onClick={() => applyOp('NOT')} variant="operator" fontSize={12} />
        <CalcButton label="C" onClick={clear} variant="function" fontSize={14} />
        <CalcButton label="⌫" onClick={() => {
          const newBuf = inputBuffer.length <= 1 ? '0' : inputBuffer.slice(0, -1)
          setInputBuffer(newBuf)
          try {
            const v = prog.fromBase(newBuf, base)
            setValue(prog.clampToSize(v, wordSize))
          } catch { /* ignore */ }
        }} variant="function" fontSize={14} />
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    gap: 6
  },
  baseDisplays: {
    padding: 8,
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  },
  baseRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '4px 8px',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
    width: '100%',
    textAlign: 'left'
  },
  baseRowActive: {
    background: 'rgba(var(--accent-rgb), 0.08)'
  },
  baseLabel: {
    fontSize: 11,
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    color: 'var(--text-muted)',
    width: 30
  },
  baseValue: {
    fontSize: 14,
    fontFamily: 'var(--font-display)',
    color: 'var(--text-secondary)',
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  wordSizeRow: {
    display: 'flex',
    gap: 4
  },
  wsBtn: {
    flex: 1,
    padding: '5px 0',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--glass-border)',
    background: 'var(--btn-bg)',
    color: 'var(--text-secondary)',
    fontSize: 10,
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    cursor: 'pointer'
  },
  wsBtnActive: {
    background: 'rgba(var(--accent-rgb), 0.2)',
    color: 'var(--accent)',
    borderColor: 'rgba(var(--accent-rgb), 0.4)'
  },
  bitGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(8, 1fr)',
    gap: 2,
    padding: 6
  },
  bitCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    borderRadius: 3,
    fontSize: 9,
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    cursor: 'pointer',
    border: '1px solid var(--glass-border)',
    transition: 'var(--transition-fast)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 4,
    flex: 1
  }
}
