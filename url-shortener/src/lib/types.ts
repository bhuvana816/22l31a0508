export type ShortUrl = {
  code: string
  longUrl: string
  createdAt: number
  expiresAt: number
  clicks: ClickEvent[]
}

export type ClickEvent = {
  ts: number
  source: string | null
  geo: string | null
}

export type CreateRequest = {
  longUrl: string
  minutes?: number
  preferredCode?: string
}

export type CreateResult = {
  ok: boolean
  error?: string
  data?: ShortUrl
}
