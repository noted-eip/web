import React from 'react'
import { QueryClientProvider } from 'react-query'
import { apiQueryClient } from './lib/api'
import Router from './views/Router'

const App: React.FC = () => {
  return <div>
    <QueryClientProvider client={apiQueryClient}>
      <Router isAuthenticated={true} />
    </QueryClientProvider>
  </div>
}

export default App
