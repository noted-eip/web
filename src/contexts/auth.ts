import React from 'react'
import { LS_AUTH_TOKEN_KEY } from '../lib/constants'

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

export class AuthContextManager {
  constructor(private _token: string | null, private _setToken: React.Dispatch<React.SetStateAction<null | string>>) {}

  public logout() {
    localStorage.removeItem(LS_AUTH_TOKEN_KEY)
    this._setToken(null)
  }

  public async token() {
    return new Promise<string>((resolve, reject) => {
      if (this._token !== null) {
        resolve(this._token)
      }
      reject(new Error('token is null, app should be in unauthenticated state'))
    })
  }
}
