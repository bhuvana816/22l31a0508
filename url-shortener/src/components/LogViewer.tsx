import * as React from 'react'
import { Box, Drawer, IconButton, Typography } from '@mui/material'
import BugReportIcon from '@mui/icons-material/BugReport'
import { loadLogs } from '../lib/storage'

export default function LogViewer() {
  const [open, setOpen] = React.useState(false)
  const [lines, setLines] = React.useState<string[]>([])

  React.useEffect(() => {
    setLines(loadLogs())
    const onLog = (e: Event) => {
      setLines(prev => [...prev, (e as CustomEvent).detail as string].slice(-1000))
    }
    document.addEventListener('app:log', onLog as EventListener)
    return () => document.removeEventListener('app:log', onLog as EventListener)
  }, [])

  return (
    <>
      <IconButton
        aria-label="logs"
        onClick={() => setOpen(true)}
        sx={{ position: 'fixed', right: 16, bottom: 16 }}
      >
        <BugReportIcon />
      </IconButton>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 420, p: 2 }}>
          <Typography variant="h6" gutterBottom>App Logs (Custom Middleware)</Typography>
          <Box component="pre" sx={{ m: 0, whiteSpace: 'pre-wrap', fontSize: 12, lineHeight: 1.4 }}>
            {lines.map((l, i) => <div key={i}>{l}</div>)}
          </Box>
        </Box>
      </Drawer>
    </>
  )
}
