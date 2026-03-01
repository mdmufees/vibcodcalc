import { useMatrixStore } from '@/stores/useMatrixStore'
import type { Matrix, MatrixOp } from '@/types/matrix'

export default function MatrixCalc() {
  const store = useMatrixStore()
  const needsB = ['add', 'subtract', 'multiply'].includes(store.operation)

  return (
    <div style={styles.container}>
      {/* Size + Operation */}
      <div style={styles.controls}>
        <div style={styles.sizeControl}>
          <span style={styles.label}>Size</span>
          <select
            value={store.size}
            onChange={(e) => store.setSize(parseInt(e.target.value))}
            style={styles.select}
          >
            {[2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}×{n}</option>
            ))}
          </select>
        </div>
        <div style={styles.ops}>
          {([
            ['add', 'A+B'], ['subtract', 'A-B'], ['multiply', 'A×B'],
            ['determinant', 'det(A)'], ['inverse', 'A⁻¹'], ['transpose', 'Aᵀ']
          ] as [MatrixOp, string][]).map(([op, label]) => (
            <button
              key={op}
              onClick={() => store.setOperation(op)}
              style={{ ...styles.opBtn, ...(store.operation === op ? styles.opBtnActive : {}) }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Matrices */}
      <div style={styles.matrices}>
        <MatrixGrid
          label="Matrix A"
          matrix={store.matrixA}
          size={store.size}
          onCellChange={store.setCellA}
        />
        {needsB && (
          <MatrixGrid
            label="Matrix B"
            matrix={store.matrixB}
            size={store.size}
            onCellChange={store.setCellB}
          />
        )}
      </div>

      {/* Calculate */}
      <button onClick={store.calculate} style={styles.calcBtn} className="neon-border-subtle">
        <span className="neon-text" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>
          Calculate
        </span>
      </button>

      {/* Result */}
      {store.error && (
        <div style={styles.error}>{store.error}</div>
      )}
      {store.resultScalar !== null && (
        <div style={styles.resultPanel} className="glass-panel">
          <span style={styles.label}>Result</span>
          <span className="neon-text" style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 700 }}>
            {store.resultScalar.toFixed(6).replace(/\.?0+$/, '')}
          </span>
        </div>
      )}
      {store.result && (
        <div style={styles.resultPanel} className="glass-panel">
          <span style={styles.label}>Result</span>
          <MatrixDisplay matrix={store.result} />
        </div>
      )}

      <button onClick={store.clearAll} style={styles.clearBtn}>Clear All</button>
    </div>
  )
}

function MatrixGrid({ label, matrix, size, onCellChange }: {
  label: string; matrix: Matrix; size: number;
  onCellChange: (row: number, col: number, value: number) => void
}) {
  return (
    <div style={styles.matrixSection}>
      <span style={styles.label}>{label}</span>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gap: 3
      }}>
        {Array.from({ length: size }, (_, i) =>
          Array.from({ length: size }, (_, j) => (
            <input
              key={`${i}-${j}`}
              type="number"
              value={matrix[i]?.[j] || 0}
              onChange={(e) => onCellChange(i, j, parseFloat(e.target.value) || 0)}
              style={styles.cell}
            />
          ))
        )}
      </div>
    </div>
  )
}

function MatrixDisplay({ matrix }: { matrix: Matrix }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${matrix[0].length}, 1fr)`,
      gap: 3
    }}>
      {matrix.map((row, i) =>
        row.map((v, j) => (
          <div
            key={`${i}-${j}`}
            style={styles.resultCell}
            className="neon-text"
          >
            {v.toFixed(4).replace(/\.?0+$/, '')}
          </div>
        ))
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', flex: 1, gap: 8, overflowY: 'auto' },
  controls: { display: 'flex', flexDirection: 'column', gap: 6 },
  sizeControl: { display: 'flex', alignItems: 'center', gap: 8 },
  label: { fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 },
  select: {
    padding: '6px 10px', borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--glass-border)', background: 'var(--btn-bg)',
    color: 'var(--text-primary)', fontSize: 13, outline: 'none'
  },
  ops: { display: 'flex', flexWrap: 'wrap', gap: 4 },
  opBtn: {
    padding: '6px 10px', borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--glass-border)', background: 'var(--btn-bg)',
    color: 'var(--text-secondary)', fontSize: 11, fontFamily: 'var(--font-display)',
    fontWeight: 600, cursor: 'pointer'
  },
  opBtnActive: {
    background: 'rgba(var(--accent-rgb), 0.2)', color: 'var(--accent)',
    borderColor: 'rgba(var(--accent-rgb), 0.4)'
  },
  matrices: { display: 'flex', flexDirection: 'column', gap: 8 },
  matrixSection: { display: 'flex', flexDirection: 'column', gap: 4 },
  cell: {
    width: '100%', padding: 6, textAlign: 'center',
    borderRadius: 4, border: '1px solid var(--glass-border)',
    background: 'var(--btn-bg)', color: 'var(--text-primary)',
    fontSize: 13, fontFamily: 'var(--font-display)', outline: 'none'
  },
  calcBtn: {
    padding: '10px 0', borderRadius: 'var(--radius-md)',
    background: 'rgba(var(--accent-rgb), 0.1)', border: '1px solid rgba(var(--accent-rgb), 0.3)',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  resultPanel: { padding: 12, display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'center' },
  resultCell: {
    padding: 6, textAlign: 'center', fontSize: 13,
    fontFamily: 'var(--font-display)', fontWeight: 600
  },
  error: { color: '#ff5555', fontSize: 13, textAlign: 'center', padding: 8 },
  clearBtn: {
    padding: '8px 0', borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--glass-border)', background: 'var(--btn-bg)',
    color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer'
  }
}
