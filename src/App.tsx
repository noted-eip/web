import { GoogleOAuthProvider } from '@react-oauth/google'
import { initializeApp } from 'firebase/app'
import React from 'react'
import { QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'

import { AuthContext, AuthContextManager } from './contexts/auth'
import { DevelopmentContext, TAccountsMap } from './contexts/dev'
import { NoAuthContext, NoAuthContextManager } from './contexts/noauth'
import { apiQueryClient } from './lib/api'
import { LS_DEVELOPMENT_DATA_KEY } from './lib/constants'
import { GOOGLE_CLIENT_ID, TOGGLE_DEV_FEATURES } from './lib/env'
import AuthenticatedRouter from './views/AuthenticatedRouter'
import UnauthenticatedRouter from './views/UnauthenticatedRouter'

const App: React.FC = () => {
  const [token, setToken] = React.useState<null | string>(null)
  const [hasLoaded, setHasLoaded] = React.useState(false)
  const [accounts, setAccounts] = React.useState<TAccountsMap>(
    JSON.parse(window.localStorage.getItem(LS_DEVELOPMENT_DATA_KEY) || '{}')
  )
  const noAuthContext = new NoAuthContextManager(setToken)
  const authContext = new AuthContextManager(token, setToken)
  const firebaseConfig = {
    apiKey: 'AIzaSyBAYMc_6XiZYQyHsCkwRXVXd7UofXF6YiQ',
    authDomain: 'noted-354512.firebaseapp.com',
    projectId: 'noted-354512',
    storageBucket: 'noted-354512.appspot.com',
    messagingSenderId: '871625340195',
    appId: '1:871625340195:web:aa69f8236ad0da4e2fc896',
    measurementId: 'G-XFC30W00DZ'
  }

  initializeApp(firebaseConfig)
  React.useEffect(() => {
    noAuthContext.attemptSigninFromLocalStorage()
    setHasLoaded(true)
  }, [])

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <DevelopmentContext.Provider
          value={TOGGLE_DEV_FEATURES ? { accounts, setAccounts } : undefined}
        >
          <QueryClientProvider client={apiQueryClient}>
            {!hasLoaded ? null : token !== null ? (
              <AuthContext.Provider value={authContext}>
                <AuthenticatedRouter />
              </AuthContext.Provider>
            ) : (
              <NoAuthContext.Provider value={noAuthContext}>
                <UnauthenticatedRouter />
              </NoAuthContext.Provider>
            )}
          </QueryClientProvider>
        </DevelopmentContext.Provider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  )
}

export default App
