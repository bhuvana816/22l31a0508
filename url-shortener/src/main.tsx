import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import ShortenerPage from './routes/ShortenerPage'
import StatsPage from './routes/StatsPage'
import RedirectPage from './routes/RedirectPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <ShortenerPage /> },
      { path: 'stats', element: <StatsPage /> },
    ]
  },
  { path: '/r/:code', element: <RedirectPage /> }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
