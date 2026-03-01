import { useHistoryStore } from '@/stores/useHistoryStore'
import { useCalculatorStore } from '@/stores/useCalculatorStore'

export default function HistoryPanel() {
  const isOpen = useHistoryStore((s) => s.isOpen)
  const toggleOpen = useHistoryStore((s) => s.toggleOpen)
  const searchQuery = useHistoryStore((s) => s.searchQuery)
  const setSearchQuery = useHistoryStore((s) => s.setSearchQuery)
  const getFiltered = useHistoryStore((s) => s.getFiltered)
  const clearHistory = useHistoryStore((s) => s.clearHistory)
  const setExpression = useCalculatorStore((s) => s.setExpression)
  const entries = getFiltered()

  if (!isOpen) return null

  return (
    <div style={styles.overlay}>
      <div style={styles.panel} className="glass-panel animate-slide-in">
        <div style={styles.header}>
          <h3 style={styles.title} className="neon-text">History</h3>
          <div style={styles.headerActions}>
            <button style={styles.clearBtn} onClick={clearHistory}>Clear</button>
            <button style={styles.closeBtn} onClick={toggleOpen}>✕</button>
          </div>
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.search}
        />
        <div style={styles.list}>
          {entries.length === 0 && (
            <div style={styles.empty}>No history yet</div>
          )}
          {entries.map((entry) => (
            <button
              key={entry.id}
              style={styles.item}
              onClick={() => {
                setExpression(entry.expression)
                toggleOpen()
              }}
            >
              <div style={styles.itemExpr}>{entry.expression}</div>
              <div style={styles.itemResult} className="neon-text">= {entry.result}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    zIndex: 50,
    display: 'flex',
    justifyContent: 'flex-end'
  },
  panel: {
    width: 280,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: 16,
    borderRadius: 0,
    borderLeft: '1px solid var(--glass-border)'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  title: {
    fontSize: 16,
    fontFamily: 'var(--font-display)',
    fontWeight: 600
  },
  headerActions: {
    display: 'flex',
    gap: 8,
    alignItems: 'center'
  },
  clearBtn: {
    fontSize: 12,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: '4px 8px'
  },
  closeBtn: {
    fontSize: 16,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 4
  },
  search: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--glass-border)',
    background: 'var(--btn-bg)',
    color: 'var(--text-primary)',
    fontSize: 13,
    outline: 'none',
    marginBottom: 8
  },
  list: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  },
  empty: {
    color: 'var(--text-muted)',
    fontSize: 13,
    textAlign: 'center',
    padding: 32
  },
  item: {
    padding: '8px 12px',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    textAlign: 'right',
    transition: 'var(--transition-fast)',
    background: 'var(--btn-bg)',
    border: '1px solid transparent',
    width: '100%'
  },
  itemExpr: {
    fontSize: 12,
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-display)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  itemResult: {
    fontSize: 16,
    fontFamily: 'var(--font-display)',
    fontWeight: 600
  }
}
