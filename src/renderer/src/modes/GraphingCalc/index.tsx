import { useRef, useEffect, useCallback } from 'react'
import { useGraphStore } from '@/stores/useGraphStore'
import { sampleFunction, evaluateAt } from '@/engine/graphing'

export default function GraphingCalc() {
  const store = useGraphStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDragging = useRef(false)
  const lastMouse = useRef({ x: 0, y: 0 })

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = canvas.clientWidth * dpr
    canvas.height = canvas.clientHeight * dpr
    ctx.scale(dpr, dpr)

    const w = canvas.clientWidth
    const h = canvas.clientHeight
    const { xMin, xMax, yMin, yMax } = store.viewport

    const toScreenX = (x: number) => ((x - xMin) / (xMax - xMin)) * w
    const toScreenY = (y: number) => h - ((y - yMin) / (yMax - yMin)) * h

    // Clear
    ctx.fillStyle = 'rgba(10, 10, 26, 0.95)'
    ctx.fillRect(0, 0, w, h)

    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)'
    ctx.lineWidth = 1
    const xStep = niceStep((xMax - xMin) / 10)
    const yStep = niceStep((yMax - yMin) / 10)

    for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
      const sx = toScreenX(x)
      ctx.beginPath()
      ctx.moveTo(sx, 0)
      ctx.lineTo(sx, h)
      ctx.stroke()
      // Label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.font = '10px JetBrains Mono, monospace'
      ctx.fillText(formatGridLabel(x), sx + 3, h - 4)
    }
    for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
      const sy = toScreenY(y)
      ctx.beginPath()
      ctx.moveTo(0, sy)
      ctx.lineTo(w, sy)
      ctx.stroke()
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.font = '10px JetBrains Mono, monospace'
      ctx.fillText(formatGridLabel(y), 3, sy - 3)
    }

    // Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 1.5
    const ax = toScreenX(0)
    const ay = toScreenY(0)
    ctx.beginPath(); ctx.moveTo(ax, 0); ctx.lineTo(ax, h); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0, ay); ctx.lineTo(w, ay); ctx.stroke()

    // Plot functions
    for (const fn of store.functions) {
      if (!fn.visible || !fn.expression.trim()) continue
      const points = sampleFunction(fn.expression, xMin, xMax, Math.max(w, 500))

      ctx.strokeStyle = fn.color
      ctx.lineWidth = 2
      ctx.shadowColor = fn.color
      ctx.shadowBlur = 6
      ctx.beginPath()

      let penDown = false
      for (const pt of points) {
        if (isNaN(pt.y)) {
          penDown = false
          continue
        }
        const sx = toScreenX(pt.x)
        const sy = toScreenY(pt.y)
        if (sy < -1000 || sy > h + 1000) {
          penDown = false
          continue
        }
        if (!penDown) {
          ctx.moveTo(sx, sy)
          penDown = true
        } else {
          ctx.lineTo(sx, sy)
        }
      }
      ctx.stroke()
      ctx.shadowBlur = 0
    }

    // Trace point
    if (store.tracePoint) {
      const sx = toScreenX(store.tracePoint.x)
      const sy = toScreenY(store.tracePoint.y)
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(sx, sy, 5, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(sx + 8, sy - 24, 120, 20)
      ctx.fillStyle = '#ffffff'
      ctx.font = '11px JetBrains Mono, monospace'
      ctx.fillText(`(${store.tracePoint.x.toFixed(2)}, ${store.tracePoint.y.toFixed(2)})`, sx + 12, sy - 10)
    }
  }, [store.viewport, store.functions, store.tracePoint])

  useEffect(() => {
    draw()
  }, [draw])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    store.zoom(e.deltaY > 0 ? 1.1 : 0.9)
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true
    lastMouse.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (isDragging.current) {
      const dx = e.clientX - lastMouse.current.x
      const dy = e.clientY - lastMouse.current.y
      lastMouse.current = { x: e.clientX, y: e.clientY }
      const { xMin, xMax, yMin, yMax } = store.viewport
      const xRange = xMax - xMin
      const yRange = yMax - yMin
      store.pan(-dx / canvas.clientWidth * xRange, dy / canvas.clientHeight * yRange)
    } else if (store.traceEnabled && store.functions.length > 0) {
      const rect = canvas.getBoundingClientRect()
      const { xMin, xMax } = store.viewport
      const mx = ((e.clientX - rect.left) / rect.width) * (xMax - xMin) + xMin
      const fn = store.functions.find((f) => f.visible && f.expression.trim())
      if (fn) {
        const y = evaluateAt(fn.expression, mx)
        if (y !== null) {
          store.setTracePoint({ x: mx, y, functionId: fn.id })
        }
      }
    }
  }, [store.traceEnabled])

  const handleMouseUp = useCallback(() => {
    isDragging.current = false
  }, [])

  return (
    <div style={styles.container}>
      {/* Function inputs */}
      <div style={styles.functionList}>
        {store.functions.map((fn) => (
          <div key={fn.id} style={styles.funcRow}>
            <div style={{ ...styles.colorDot, background: fn.color }} />
            <input
              type="text"
              value={fn.expression}
              onChange={(e) => store.updateFunction(fn.id, e.target.value)}
              placeholder="e.g. sin(x), x^2"
              style={styles.funcInput}
            />
            {store.functions.length > 1 && (
              <button onClick={() => store.removeFunction(fn.id)} style={styles.removeBtn}>✕</button>
            )}
          </div>
        ))}
        {store.functions.length < 5 && (
          <button onClick={() => store.addFunction('')} style={styles.addBtn}>+ Add Function</button>
        )}
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <button onClick={() => store.zoom(0.8)} style={styles.ctrlBtn}>Zoom +</button>
        <button onClick={() => store.zoom(1.25)} style={styles.ctrlBtn}>Zoom -</button>
        <button onClick={store.resetViewport} style={styles.ctrlBtn}>Reset</button>
        <button
          onClick={() => store.setTraceEnabled(!store.traceEnabled)}
          style={{ ...styles.ctrlBtn, ...(store.traceEnabled ? styles.ctrlBtnActive : {}) }}
        >
          Trace
        </button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={styles.canvas}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  )
}

function niceStep(roughStep: number): number {
  const pow = Math.pow(10, Math.floor(Math.log10(roughStep)))
  const frac = roughStep / pow
  if (frac <= 1.5) return pow
  if (frac <= 3.5) return 2 * pow
  if (frac <= 7.5) return 5 * pow
  return 10 * pow
}

function formatGridLabel(v: number): string {
  if (Math.abs(v) < 1e-10) return '0'
  if (Math.abs(v) >= 1000 || (Math.abs(v) < 0.01 && v !== 0)) return v.toExponential(1)
  return parseFloat(v.toPrecision(4)).toString()
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', flex: 1, gap: 6 },
  functionList: { display: 'flex', flexDirection: 'column', gap: 4 },
  funcRow: { display: 'flex', alignItems: 'center', gap: 6 },
  colorDot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0 },
  funcInput: {
    flex: 1, padding: '6px 10px', borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--glass-border)', background: 'var(--btn-bg)',
    color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-display)', outline: 'none'
  },
  removeBtn: {
    width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 4, border: 'none', background: 'rgba(255,85,85,0.2)',
    color: '#ff5555', fontSize: 12, cursor: 'pointer'
  },
  addBtn: {
    padding: '6px 0', borderRadius: 'var(--radius-sm)',
    border: '1px dashed var(--glass-border)', background: 'transparent',
    color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer'
  },
  controls: { display: 'flex', gap: 4 },
  ctrlBtn: {
    flex: 1, padding: '5px 0', borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--glass-border)', background: 'var(--btn-bg)',
    color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600, cursor: 'pointer'
  },
  ctrlBtnActive: {
    background: 'rgba(var(--accent-rgb), 0.2)', color: 'var(--accent)',
    borderColor: 'rgba(var(--accent-rgb), 0.4)'
  },
  canvas: {
    flex: 1, borderRadius: 'var(--radius-md)',
    border: '1px solid var(--glass-border)', cursor: 'crosshair', minHeight: 200
  }
}
