import * as React from 'react'
import { Alert, Box, Button, Card, CardContent, Divider, Grid, Link as MLink, Typography } from '@mui/material'
import UrlRow from '../components/UrlRow'
import { createShortUrl } from '../lib/shortener'
import { useStore } from '../store/store'
import { Logger } from '../lib/logger'

type Row = { url: string; minutes: string; code: string }
const emptyRow: Row = { url: '', minutes: '', code: '' }

export default function ShortenerPage() {
  const [rows, setRows] = React.useState<Row[]>([emptyRow])
  const [errors, setErrors] = React.useState<string[]>([])
  const reload = useStore(s => s.reload)
  const urls = useStore(s => s.urls)
  React.useEffect(() => { reload() }, [reload])

  const onAddRow = () => {
    if (rows.length >= 5) return
    setRows(prev => [...prev, emptyRow])
    Logger.log('ADD_ROW', { rows: rows.length + 1 })
  }

  const onChangeRow = (i: number, v: Row) => {
    setRows(prev => prev.map((r, idx) => idx === i ? v : r))
  }

  const onShorten = () => {
    const errs: string[] = []
    let created = 0
    rows.forEach((r, i) => {
      if (!r.url.trim()) return
      const minutes = r.minutes.trim() ? parseInt(r.minutes, 10) : undefined
      const res = createShortUrl({
        longUrl: r.url.trim(),
        minutes,
        preferredCode: r.code.trim() || undefined
      })
      if (!res.ok) {
        errs.push(`Row #${i + 1}: ${res.error}`)
      } else {
        created++
      }
    })
    setErrors(errs)
    reload()
    if (created > 0) Logger.log('BULK_CREATE', { count: created })
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>Shorten URLs</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Add up to 5 URLs. If validity is blank it defaults to 30 minutes.
        </Typography>

        {rows.map((row, i) => (
          <UrlRow key={i} index={i} value={row} onChange={(v) => onChangeRow(i, v)} />
        ))}
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <Button variant="outlined" onClick={onAddRow} disabled={rows.length >= 5}>Add another</Button>
          <Button variant="contained" onClick={onShorten}>Shorten</Button>
        </Box>

        {errors.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {errors.map((e, i) => <Alert key={i} severity="error" sx={{ mb: 1 }}>{e}</Alert>)}
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>Recently created</Typography>
        <Grid container spacing={2}>
          {urls.slice(0,6).map(u => (
            <Grid item xs={12} md={6} key={u.code}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" sx={{ wordBreak: 'break-all' }}>{u.longUrl}</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Short: <MLink href={`/r/${u.code}`}>{location.origin}/r/{u.code}</MLink>
                  </Typography>
                  <Typography variant="body2">
                    Expires: {new Date(u.expiresAt).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}
