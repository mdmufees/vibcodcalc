import { useRef, useCallback } from 'react'

interface CalcButtonProps {
  label: string
  onClick: () => void
  variant?: 'default' | 'operator' | 'accent' | 'function'
  span?: number
  fontSize?: number
}

export default function CalcButton({ label, onClick, variant = 'default', span = 1, fontSize }: CalcButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null)

  const handleClick = useCallback((e: React.MouseEvent) => {
    // Ripple effect
    const btn = btnRef.current
    if (btn) {
      const rect = btn.getBoundingClientRect()
      const ripple = document.createElement('span')
      const size = Math.max(rect.width, rect.height)
      ripple.style.cssText = `
        position: absolute; border-radius: 50%;
        width: ${size}px; height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top: ${e.clientY - rect.top - size / 2}px;
        background: rgba(var(--accent-rgb), 0.3);
        transform: scale(0); animation: ripple 0.5s ease-out;
        pointer-events: none;
      `
      btn.appendChild(ripple)
      setTimeout(() => ripple.remove(), 500)
    }
    onClick()
  }, [onClick])

  const variantStyles: Record<string, React.CSSProperties> = {
    default: { background: 'var(--btn-bg)', color: 'var(--text-primary)' },
    operator: { background: 'rgba(var(--accent-rgb), 0.1)', color: 'var(--accent)' },
    accent: { background: 'rgba(var(--accent-rgb), 0.25)', color: 'var(--accent)', fontWeight: 600 },
    function: { background: 'var(--btn-bg)', color: 'var(--text-secondary)', fontSize: 13 }
  }

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      style={{
        ...styles.button,
        ...variantStyles[variant],
        gridColumn: span > 1 ? `span ${span}` : undefined,
        fontSize: fontSize || (variant === 'function' ? 13 : 18)
      }}
    >
      {label}
    </button>
  )
}

const styles: Record<string, React.CSSProperties> = {
  button: {
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--glass-border)',
    fontFamily: 'var(--font-display)',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
    padding: '12px 8px',
    minHeight: 48
  }
}
