import * as React from 'react'
import {
  Box, Card, CardContent, Chip, Link as MLink, Table, TableBody,
  TableCell, TableHead, TableRow, Typography
} from '@mui/material'
import { useStore } from '../store/store'

export default function StatsPage() {
  const urls = useStore(s => s.urls)
  const reload = useStore(s => s.reload)

  React.useEffect(() => { reload() }, [reload])

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>All Short Links</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Short URL</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell>Total Clicks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {urls.map(u => (
              <TableRow key={u.code} hover>
                <TableCell>
                  <MLink href={`/r/${u.code}`}>{location.origin}/r/{u.code}</MLink>
                  <Box sx={{ fontSize: 12, color: 'text.secondary', wordBreak: 'break-all' }}>{u.longUrl}</Box>
                </TableCell>
                <TableCell>{new Date(u.createdAt).toLocaleString()}</TableCell>
                <TableCell>{new Date(u.expiresAt).toLocaleString()}</TableCell>
                <TableCell><Chip label={u.clicks.length} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>Click Details</Typography>
          {urls.map(u => (
            <Box key={u.code} sx={{ mb: 3 }}>
              <Typography variant="subtitle1">{location.origin}/r/{u.code}</Typography>
              {u.clicks.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No clicks yet.</Typography>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Source</TableCell>
                      <TableCell>Geo (coarse)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {u.clicks.map((c, i) => (
                      <TableRow key={i}>
                        <TableCell>{new Date(c.ts).toLocaleString()}</TableCell>
                        <TableCell>{c.source || '-'}</TableCell>
                        <TableCell>{c.geo || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}
