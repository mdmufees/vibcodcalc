import type { ReactNode } from 'react'
import TitleBar from './TitleBar'
import Sidebar from './Sidebar'

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div style={styles.shell}>
      {/* Background orbs */}
      <div className="orb orb-accent" style={{ width: 300, height: 300, top: -80, right: -80 }} />
      <div className="orb orb-accent" style={{ width: 200, height: 200, bottom: -40, left: -40 }} />

      <TitleBar />
      <div style={styles.body}>
        <Sidebar />
        <main style={styles.main}>
          {children}
        </main>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  shell: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden'
  },
  body: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 1
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    padding: 8
  }
}
