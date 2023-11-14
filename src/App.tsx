import { createTheme, ThemeProvider } from '@mui/material/styles'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { initializeApp } from 'firebase/app'
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
  const firebaseConfig = {
    apiKey: 'AIzaSyBAYMc_6XiZYQyHsCkwRXVXd7UofXF6YiQ',
    authDomain: 'noted-354512.firebaseapp.com',
    projectId: 'noted-354512',
    storageBucket: 'noted-354512.appspot.com',
    messagingSenderId: '871625340195',
    appId: '1:871625340195:web:aa69f8236ad0da4e2fc896',
    measurementId: 'G-XFC30W0DZ'
  }
  const theme = createTheme({
    components: {
      MuiButton: {
        variants: [
          {
            props: { variant: 'outlined' },
            style: {
              textTransform: 'none',
            },
          },
        ],
      },
    },
  })

  
  initializeApp(firebaseConfig)
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
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  )
}

export default App
