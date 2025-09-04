import * as React from 'react'
import { Grid, TextField } from '@mui/material'

type Props = {
  index: number
  value: { url: string; minutes: string; code: string }
  onChange: (v: { url: string; minutes: string; code: string }) => void
}

export default function UrlRow({ index, value, onChange }: Props) {
  return (
    <Grid container spacing={2} sx={{ mb: 1 }}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label={`Long URL #${index + 1}`}
          placeholder="https://example.com/some/long/path"
          value={value.url}
          onChange={(e) => onChange({ ...value, url: e.target.value })}
        />
      </Grid>
      <Grid item xs={6} md={3}>
        <TextField
          fullWidth
          label="Validity (min)"
          placeholder="30"
          type="number"
          value={value.minutes}
          onChange={(e) => onChange({ ...value, minutes: e.target.value })}
        />
      </Grid>
      <Grid item xs={6} md={3}>
        <TextField
          fullWidth
          label="Preferred Shortcode (optional)"
          placeholder="my-code"
          value={value.code}
          onChange={(e) => onChange({ ...value, code: e.target.value })}
        />
      </Grid>
    </Grid>
  )
}
