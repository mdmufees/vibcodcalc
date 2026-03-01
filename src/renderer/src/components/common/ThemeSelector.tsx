import { useThemeStore } from '@/stores/useThemeStore'
import type { AccentColor } from '@/types/theme'

const ACCENT_COLORS: { id: AccentColor; color: string }[] = [
  { id: 'cyan', color: '#00e5ff' },
  { id: 'magenta', color: '#ff00e5' },
  { id: 'green', color: '#39ff14' },
  { id: 'orange', color: '#ff6600' },
  { id: 'purple', color: '#bf00ff' }
]

export default function ThemeSelector() {
  const { accent, mode, setAccent, toggleMode } = useThemeStore()

  return (
    <div style={styles.container}>
      <div style={styles.accents}>
        {ACCENT_COLORS.map(({ id, color }) => (
          <button
            key={id}
            onClick={() => setAccent(id)}
            style={{
              ...styles.colorBtn,
              background: color,
              boxShadow: accent === id ? `0 0 12px ${color}, 0 0 4px ${color}` : 'none',
              transform: accent === id ? 'scale(1.2)' : 'scale(1)'
            }}
            title={id}
          />
        ))}
      </div>
      <button onClick={toggleMode} style={styles.modeBtn} title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
        {mode === 'dark' ? '☀' : '🌙'}
      </button>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '6px 12px'
  },
  accents: {
    display: 'flex',
    gap: 6
  },
  colorBtn: {
    width: 16,
    height: 16,
    borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.2)',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    padding: 0
  },
  modeBtn: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    border: '1px solid var(--glass-border)',
    background: 'var(--btn-bg)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    padding: 0
  }
}
