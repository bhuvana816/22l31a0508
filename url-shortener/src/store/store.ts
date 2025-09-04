import { create } from 'zustand'
import type { ShortUrl } from '../lib/types'
import { loadAll, pruneExpired } from '../lib/storage'
import { Logger } from '../lib/logger'

type State = {
  urls: ShortUrl[]
  reload: () => void
}

export const useStore = create<State>((set) => ({
  urls: [],
  reload: () => {
    pruneExpired()
    const urls = loadAll().sort((a,b) => b.createdAt - a.createdAt)
    set({ urls })
    Logger.log('STORE_RELOAD', { count: urls.length })
  }
}))
