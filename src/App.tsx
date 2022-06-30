import React from 'react'
import Router from './views/Router'

const App: React.FC = () => {
  return <div>
    <Router isAuthenticated={true} />
  </div>
}

export default App
