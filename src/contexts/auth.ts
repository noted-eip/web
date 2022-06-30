import React from 'react'

type TAuthContext = {
  logout: () => void
  token: () => Promise<string>
};

export const AuthContext = React.createContext<TAuthContext | undefined>(undefined)

// Manage the active user session. This context is only accessible in
// authenticated views.
export const useAuthContext = () => {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('AuthContext used outside of provider')
  }
  return context
}
