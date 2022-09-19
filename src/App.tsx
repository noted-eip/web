import React from 'react'
import { QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import ViewSkeleton from './components/layout/ViewSkeleton'
import { AuthContext, AuthContextManager } from './contexts/auth'
import { NoAuthContext, NoAuthContextManager } from './contexts/noauth'
import { apiQueryClient } from './lib/api'
import AuthenticatedRouter from './views/AuthenticatedRouter'
import UnauthenticatedRouter from './views/UnauthenticatedRouter'

const App: React.FC = () => {
  const [token, setToken] = React.useState<null | string>(null)
  const noAuthContext = new NoAuthContextManager(setToken)
  const authContext = new AuthContextManager(token, setToken)

  React.useEffect(() => {
    noAuthContext.attemptSigninFromLocalStorage()
  }, [])

  return <div>
    <BrowserRouter>
      <QueryClientProvider client={apiQueryClient}>
        <ViewSkeleton>
          {
            token !== null ?
              <AuthContext.Provider value={authContext}>
                <AuthenticatedRouter />
              </AuthContext.Provider>
              : 
              <NoAuthContext.Provider value={noAuthContext}>
                <UnauthenticatedRouter />
              </NoAuthContext.Provider>
          }
        </ViewSkeleton>
      </QueryClientProvider>
    </BrowserRouter>
  </div>
}

export default App
