import type { ShortUrl, ClickEvent } from './types'
import { Logger } from './logger'

const KEY = 'URLS_V1'
const LOGKEY = 'LOGS_V1'

export function loadAll(): ShortUrl[] {
  const raw = localStorage.getItem(KEY)
  if (!raw) return []
  try {
    const list = JSON.parse(raw) as ShortUrl[]
    return list
  } catch {
    return []
  }
}

export function saveAll(list: ShortUrl[]) {
  localStorage.setItem(KEY, JSON.stringify(list))
  Logger.log('STORAGE_SAVE', { count: list.length })
}

export function append(item: ShortUrl) {
  const list = loadAll()
  list.push(item)
  saveAll(list)
}

export function findByCode(code: string): ShortUrl | undefined {
  return loadAll().find(x => x.code === code)
}

export function updateClicks(code: string, click: ClickEvent) {
  const list = loadAll()
  const idx = list.findIndex(x => x.code === code)
  if (idx >= 0) {
    list[idx].clicks.push(click)
    saveAll(list)
  }
}

export function codeExists(code: string): boolean {
  return !!findByCode(code)
}

export function pruneExpired(now: number = Date.now()) {
  const list = loadAll()
  const filtered = list.filter(x => x.expiresAt > now)
  if (filtered.length !== list.length) {
    saveAll(filtered)
    Logger.log('PRUNE_EXPIRED', { removed: list.length - filtered.length })
  }
}

export function loadLogs(): string[] {
  const raw = localStorage.getItem(LOGKEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as string[]
  } catch {
    return []
  }
}

export function saveLogs(lines: string[]) {
  localStorage.setItem(LOGKEY, JSON.stringify(lines))
}
