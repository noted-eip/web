import { GoogleOAuthProvider } from '@react-oauth/google'
import React from 'react'
import { QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'

import { AuthContext, AuthContextManager } from './contexts/auth'
import { DevelopmentContext, TAccountsMap } from './contexts/dev'
import { LangageContext } from './contexts/langage'
import { NoAuthContext, NoAuthContextManager } from './contexts/noauth'
import LocaleManager from './i18n/LocaleManager'
import { apiQueryClient } from './lib/api'
import { LS_DEVELOPMENT_DATA_KEY, LS_LANGAGE } from './lib/constants'
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
  const [currentLangage, setCurrentLangage] = React.useState<string | null>(
    window.localStorage.getItem(LS_LANGAGE)
  )
  React.useEffect(() => {
    noAuthContext.attemptSigninFromLocalStorage()
    setHasLoaded(true)
  }, [])

  const changeLangage = (val) => {
    setCurrentLangage(val)
    if (val === null) {
      window.localStorage.removeItem(LS_LANGAGE)
    } else {
      window.localStorage.setItem(LS_LANGAGE, val)
    }
  }

  return (
    <LangageContext.Provider value={{langage: currentLangage, changeLangage}}>
      <LocaleManager>
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
      </LocaleManager>
    </LangageContext.Provider>
  )
}

export default App
