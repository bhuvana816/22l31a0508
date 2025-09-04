import { z } from 'zod'
import type { CreateRequest, CreateResult, ShortUrl } from './types'
import { codeExists, append } from './storage'
import { Logger } from './logger'

const urlSchema = z.string().url()
const minutesSchema = z.number().int().positive().max(60 * 24 * 365) // max 1 year
const codeSchema = z.string().regex(/^[a-zA-Z0-9_-]{3,24}$/)

function randomCode(len = 7) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'
  let out = ''
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

function generateUniqueCode(preferred?: string): string | null {
  if (preferred) {
    if (codeExists(preferred)) return null
    return preferred
  }
  let attempts = 0
  while (attempts < 10) {
    const c = randomCode()
    if (!codeExists(c)) return c
    attempts++
  }
  return null
}

export function createShortUrl(input: CreateRequest): CreateResult {
  // Validation
  const urlSafe = urlSchema.safeParse(input.longUrl)
  if (!urlSafe.success) {
    Logger.log('VALIDATION_FAIL', { reason: 'url', value: input.longUrl })
    return { ok: false, error: 'Please enter a valid URL (https://...)' }
  }
  let minutes = 30
  if (typeof input.minutes !== 'undefined') {
    const num = Number(input.minutes)
    const minSafe = minutesSchema.safeParse(num)
    if (!minSafe.success) {
      Logger.log('VALIDATION_FAIL', { reason: 'minutes', value: input.minutes })
      return { ok: false, error: 'Validity must be a positive integer number of minutes' }
    }
    minutes = num
  }
  let preferred: string | undefined = undefined
  if (input.preferredCode && input.preferredCode.trim().length) {
    const codeSafe = codeSchema.safeParse(input.preferredCode.trim())
    if (!codeSafe.success) {
      Logger.log('VALIDATION_FAIL', { reason: 'code', value: input.preferredCode })
      return { ok: false, error: 'Shortcode must be 3–24 chars: letters, numbers, _ or -' }
    }
    preferred = input.preferredCode.trim()
  }

  const code = generateUniqueCode(preferred)
  if (!code) return { ok: false, error: 'Could not allocate a unique shortcode. Try another.' }

  const now = Date.now()
  const expiresAt = now + minutes * 60 * 1000

  const short: ShortUrl = {
    code,
    longUrl: input.longUrl,
    createdAt: now,
    expiresAt,
    clicks: []
  }
  append(short)
  Logger.log('CREATE', { code, longUrl: input.longUrl, minutes })
  return { ok: true, data: short }
}
