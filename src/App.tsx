import React from 'react'
import { QueryClientProvider } from 'react-query'
import { apiQueryClient } from './lib/api'
import AuthenticatedRouter from './views/AuthenticatedRouter'
import { BrowserRouter } from 'react-router-dom'
import UnauthenticatedRouter from './views/UnauthenticatedRouter'

const App: React.FC = () => {
  const [isAuthenticated, setAuthenticated] = React.useState(false)

  return <BrowserRouter>
    <QueryClientProvider client={apiQueryClient}>
      {
        isAuthenticated ? <AuthenticatedRouter /> : <UnauthenticatedRouter />
      }
    </QueryClientProvider>
  </BrowserRouter>
}

export default App
