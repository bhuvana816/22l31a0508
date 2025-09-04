import * as React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { AppBar, Box, Container, CssBaseline, Toolbar, Typography, Button } from '@mui/material'
import LogViewer from './components/LogViewer'
import { Logger } from './lib/logger'

export default function App() {
  const location = useLocation()
  React.useEffect(() => {
    Logger.log('NAVIGATE', { path: location.pathname })
  }, [location.pathname])

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>URL Shortener</Typography>
          <Button color="inherit" component={Link} to="/">Shorten</Button>
          <Button color="inherit" component={Link} to="/stats">Stats</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <Box sx={{ mt: 3, mb: 8 }}>
          <Outlet />
        </Box>
      </Container>
      <LogViewer />
    </>
  )
}
