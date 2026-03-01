import { useRef, useEffect } from 'react'
import { useStatsStore } from '@/stores/useStatsStore'
import * as stats from '@/engine/statistics'

export default function StatsCalc() {
  const store = useStatsStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const hasData = store.data.length > 0

  useEffect(() => {
    if (!hasData || !canvasRef.current) return
    drawHistogram(canvasRef.current, store.data)
  }, [store.data, hasData])

  return (
    <div style={styles.container}>
      {/* Data input */}
      <div style={styles.inputSection}>
        <label style={styles.label}>Data (comma or space separated)</label>
        <textarea
          value={store.dataInput}
          onChange={(e) => store.setDataInput(e.target.value)}
          placeholder="1, 2, 3, 4, 5, 6, 7, 8, 9, 10"
          style={styles.textarea}
          rows={3}
        />
        <div style={styles.inputActions}>
          <button onClick={store.parseData} style={styles.goBtn} className="neon-border-subtle">
            <span className="neon-text">Analyze</span>
          </button>
          <button onClick={store.clearData} style={styles.clearBtn}>Clear</button>
        </div>
      </div>

      {hasData && (
        <>
          {/* Stats results */}
          <div style={styles.statsGrid} className="glass-panel">
            <StatItem label="Count" value={stats.count(store.data)} />
            <StatItem label="Sum" value={stats.sum(store.data)} />
            <StatItem label="Mean" value={stats.mean(store.data)} />
            <StatItem label="Median" value={stats.median(store.data)} />
            <StatItem label="Mode" value={stats.mode(store.data).join(', ') || 'None'} />
            <StatItem label="Std Dev" value={stats.stddev(store.data)} />
            <StatItem label="Variance" value={stats.variance(store.data)} />
            <StatItem label="Min" value={stats.min(store.data)} />
            <StatItem label="Max" value={stats.max(store.data)} />
            {store.data.length >= 2 && (
              <StatItem label="R²" value={stats.linearRegression(store.data).r2} />
            )}
          </div>

          {/* Histogram */}
          <div className="glass-panel" style={styles.chartPanel}>
            <span style={styles.label}>Histogram</span>
            <canvas ref={canvasRef} width={300} height={150} style={{ width: '100%', height: 150 }} />
          </div>
        </>
      )}
    </div>
  )
}

function StatItem({ label, value }: { label: string; value: number | string }) {
  const formatted = typeof value === 'number'
    ? (Number.isInteger(value) ? value.toString() : value.toFixed(4).replace(/\.?0+$/, ''))
    : value
  return (
    <div style={styles.statItem}>
      <span style={styles.statLabel}>{label}</span>
      <span style={styles.statValue} className="neon-text">{formatted}</span>
    </div>
  )
}

function drawHistogram(canvas: HTMLCanvasElement, data: number[]) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  canvas.width = canvas.clientWidth * dpr
  canvas.height = canvas.clientHeight * dpr
  ctx.scale(dpr, dpr)

  const w = canvas.clientWidth
  const h = canvas.clientHeight
  const bins = Math.min(Math.max(5, Math.ceil(Math.sqrt(data.length))), 20)
  const { counts } = stats.histogram(data, bins)
  const maxCount = Math.max(...counts)

  ctx.clearRect(0, 0, w, h)

  const accentStyle = getComputedStyle(document.documentElement)
  const accentRgb = accentStyle.getPropertyValue('--accent-rgb').trim()
  const barColor = `rgba(${accentRgb}, 0.6)`
  const barBorder = `rgba(${accentRgb}, 0.9)`

  const padding = { top: 10, bottom: 20, left: 10, right: 10 }
  const chartW = w - padding.left - padding.right
  const chartH = h - padding.top - padding.bottom
  const barW = chartW / bins

  counts.forEach((count, i) => {
    const barH = maxCount > 0 ? (count / maxCount) * chartH : 0
    const x = padding.left + i * barW
    const y = padding.top + chartH - barH

    ctx.fillStyle = barColor
    ctx.fillRect(x + 1, y, barW - 2, barH)
    ctx.strokeStyle = barBorder
    ctx.lineWidth = 1
    ctx.strokeRect(x + 1, y, barW - 2, barH)
  })
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', flex: 1, gap: 8, overflowY: 'auto' },
  inputSection: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 },
  textarea: {
    width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--glass-border)', background: 'var(--btn-bg)',
    color: 'var(--text-primary)', fontSize: 14, fontFamily: 'var(--font-display)',
    outline: 'none', resize: 'vertical'
  },
  inputActions: { display: 'flex', gap: 8 },
  goBtn: {
    flex: 1, padding: '8px 0', borderRadius: 'var(--radius-sm)',
    background: 'rgba(var(--accent-rgb), 0.1)', border: '1px solid rgba(var(--accent-rgb), 0.3)',
    cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600
  },
  clearBtn: {
    padding: '8px 16px', borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--glass-border)', background: 'var(--btn-bg)',
    color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer'
  },
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, padding: 12
  },
  statItem: { display: 'flex', flexDirection: 'column', gap: 2 },
  statLabel: { fontSize: 11, color: 'var(--text-muted)' },
  statValue: { fontSize: 15, fontFamily: 'var(--font-display)', fontWeight: 700 },
  chartPanel: { padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }
}
