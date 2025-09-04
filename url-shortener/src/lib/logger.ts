import { saveLogs, loadLogs } from './storage'

// Custom logging "middleware" that does NOT use console.*
// Writes structured logs to localStorage and dispatches a custom event
// to which the UI can subscribe.
export class Logger {
  static log(event: string, payload?: Record<string, unknown>) {
    const line = JSON.stringify({
      ts: Date.now(),
      event,
      payload: payload ?? null
    })
    const lines = loadLogs()
    lines.push(line)
    // Keep last 1000 logs
    const trimmed = lines.slice(-1000)
    saveLogs(trimmed)
    document.dispatchEvent(new CustomEvent('app:log', { detail: line }))
  }
}
