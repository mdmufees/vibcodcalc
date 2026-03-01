import { useState } from 'react'

export default function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false)

  const handleMinimize = () => window.electronAPI?.minimize()
  const handleMaximize = () => {
    window.electronAPI?.maximize()
    setIsMaximized(!isMaximized)
  }
  const handleClose = () => window.electronAPI?.close()

  return (
    <div style={styles.titleBar}>
      <div style={styles.dragRegion}>
        <span style={styles.title} className="neon-text">VibCodCalc</span>
      </div>
      <div style={styles.controls}>
        <button style={styles.btn} onClick={handleMinimize} title="Minimize">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <rect y="5" width="12" height="2" rx="1" fill="currentColor" />
          </svg>
        </button>
        <button style={styles.btn} onClick={handleMaximize} title="Maximize">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <rect x="1" y="1" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </button>
        <button style={{ ...styles.btn, ...styles.closeBtn }} onClick={handleClose} title="Close">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  titleBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 38,
    padding: '0 8px 0 16px',
    WebkitAppRegion: 'drag' as any,
    position: 'relative',
    zIndex: 100
  },
  dragRegion: {
    flex: 1,
    display: 'flex',
    alignItems: 'center'
  },
  title: {
    fontSize: 13,
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    letterSpacing: '0.15em'
  },
  controls: {
    display: 'flex',
    gap: 4,
    WebkitAppRegion: 'no-drag' as any
  },
  btn: {
    width: 28,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    color: 'var(--text-secondary)',
    transition: 'var(--transition-fast)',
    cursor: 'pointer',
    background: 'transparent',
    border: 'none'
  },
  closeBtn: {
    color: '#ff5555'
  }
}
