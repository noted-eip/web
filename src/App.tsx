import React from 'react'
import { QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'

import { AuthContext, AuthContextManager } from './contexts/auth'
import { DevelopmentContext, TAccountsMap } from './contexts/dev'
import { NoAuthContext, NoAuthContextManager } from './contexts/noauth'
import { apiQueryClient } from './lib/api'
import { LS_DEVELOPMENT_DATA_KEY } from './lib/constants'
import { TOGGLE_DEV_FEATURES } from './lib/env'
import AuthenticatedRouter from './views/AuthenticatedRouter'
import UnauthenticatedRouter from './views/UnauthenticatedRouter'

import { GoogleOAuthProvider } from '@react-oauth/google'

const App: React.FC = () => {
  const [token, setToken] = React.useState<null | string>(null)
  const [hasLoaded, setHasLoaded] = React.useState(false)
  const [accounts, setAccounts] = React.useState<TAccountsMap>(
    JSON.parse(window.localStorage.getItem(LS_DEVELOPMENT_DATA_KEY) || '{}')
  )
  const noAuthContext = new NoAuthContextManager(setToken)
  const authContext = new AuthContextManager(token, setToken)

  React.useEffect(() => {
    noAuthContext.attemptSigninFromLocalStorage()
    setHasLoaded(true)
  }, [])

  return (
    <GoogleOAuthProvider clientId='993773231288-d55u37mlmnkrj1fh6fs2gf52hg0d8llk.apps.googleusercontent.com'>
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
