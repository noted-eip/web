import React from 'react'

import { decodeToken } from '../lib/api'
import { LS_AUTH_TOKEN_KEY, LS_GROUP_ID_KEY } from '../lib/constants'

export type TAuthContext = {
  accountId: string
  logout: () => void
  token: () => Promise<string>
}

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
  constructor(
    private _token: string | null,
    private _setToken: React.Dispatch<React.SetStateAction<null | string>>
  ) {
    this.accountId = this._token ? decodeToken(this._token).aid : ''
  }

  public accountId: string

  public logout() {
    localStorage.removeItem(LS_AUTH_TOKEN_KEY)
    localStorage.removeItem(LS_GROUP_ID_KEY)
    this.accountId = ''
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
