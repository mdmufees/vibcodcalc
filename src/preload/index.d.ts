import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electronAPI: {
      minimize: () => void
      maximize: () => void
      close: () => void
      copyToClipboard: (text: string) => void
    }
    electron: ElectronAPI
  }
}
