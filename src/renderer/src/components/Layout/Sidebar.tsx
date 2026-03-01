import type { CalculatorMode, ModeInfo } from '@/types/calculator'
import { MODES } from '@/types/calculator'
import { useCalculatorStore } from '@/stores/useCalculatorStore'
import { useHistoryStore } from '@/stores/useHistoryStore'

export default function Sidebar() {
  const currentMode = useCalculatorStore((s) => s.mode)
  const setMode = useCalculatorStore((s) => s.setMode)
  const toggleHistory = useHistoryStore((s) => s.toggleOpen)

  return (
    <div style={styles.sidebar}>
      <div style={styles.modes}>
        {MODES.map((m) => (
          <SidebarButton
            key={m.id}
            mode={m}
            isActive={currentMode === m.id}
            onClick={() => setMode(m.id)}
          />
        ))}
      </div>
      <div style={styles.bottom}>
        <button style={styles.historyBtn} onClick={toggleHistory} title="History (Ctrl+H)">
          <span style={{ fontSize: 16 }}>⏱</span>
        </button>
      </div>
    </div>
  )
}

function SidebarButton({ mode, isActive, onClick }: { mode: ModeInfo; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={`${mode.label} (Ctrl+${mode.shortcut})`}
      style={{
        ...styles.modeBtn,
        ...(isActive ? styles.modeBtnActive : {})
      }}
      className={isActive ? 'neon-text' : ''}
    >
      <span style={{ fontSize: 16, lineHeight: 1 }}>{mode.icon}</span>
      <span style={{ fontSize: 9, fontWeight: 500, marginTop: 2 }}>{mode.label}</span>
    </button>
  )
}

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: 64,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '8px 4px',
    borderRight: '1px solid var(--glass-border)',
    background: 'var(--glass-bg)',
    backdropFilter: 'blur(var(--glass-blur))'
  },
  modes: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2
  },
  modeBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
    padding: '8px 4px',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-secondary)',
    transition: 'var(--transition-fast)',
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
    width: '100%'
  },
  modeBtnActive: {
    background: 'rgba(var(--accent-rgb), 0.12)',
    color: 'var(--accent)'
  },
  bottom: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4
  },
  historyBtn: {
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
    transition: 'var(--transition-fast)'
  }
}
