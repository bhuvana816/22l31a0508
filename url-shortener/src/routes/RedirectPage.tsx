import * as React from 'react'
import { useParams } from 'react-router-dom'
import { Alert, Box, Button, Card, CardContent, CircularProgress, Link as MLink, Typography } from '@mui/material'
import { findByCode, updateClicks } from '../lib/storage'
import { Logger } from '../lib/logger'

export default function RedirectPage() {
  const { code } = useParams()
  const [status, setStatus] = React.useState<'checking'|'error'|'expired'|'ok'>('checking')
  const [longUrl, setLongUrl] = React.useState<string>('')
  const [message, setMessage] = React.useState<string>('')

  React.useEffect(() => {
    const c = code || ''
    const item = findByCode(c)
    if (!item) {
      setStatus('error')
      setMessage('Short link not found.')
      Logger.log('RESOLVE_FAIL', { code: c, reason: 'not_found' })
      return
    }
    const now = Date.now()
    if (item.expiresAt <= now) {
      setStatus('expired')
      setMessage(`This link expired on ${new Date(item.expiresAt).toLocaleString()}`)
      Logger.log('RESOLVE_FAIL', { code: c, reason: 'expired' })
      return
    }

    setStatus('ok')
    setLongUrl(item.longUrl)

    // Prepare click analytics
    const src = document.referrer || null
    let geo: string | null = null
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
      geo = tz || null
    } catch {}

    const click = { ts: Date.now(), source: src, geo }
    updateClicks(c, click)
    Logger.log('CLICK', { code: c, source: src, geo })

    // Redirect after a short delay to allow UI update/log
    const t = setTimeout(() => {
      window.location.href = item.longUrl
    }, 800)
    return () => clearTimeout(t)
  }, [code])

  return (
    <Card>
      <CardContent>
        {status === 'checking' && (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <CircularProgress size={20} /> <Typography>Checking link...</Typography>
          </Box>
        )}
        {status === 'error' && (<Alert severity="error">{message}</Alert>)}
        {status === 'expired' && (
          <Alert severity="warning" action={<Button component={MLink} href="/">Create new</Button>}>
            {message}
          </Alert>
        )}
        {status === 'ok' && (
          <>
            <Typography variant="h6">Redirecting…</Typography>
            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>{longUrl}</Typography>
          </>
        )}
      </CardContent>
    </Card>
  )
}
