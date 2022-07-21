import React from 'react'
import { LS_AUTH_TOKEN_KEY } from '../lib/constants'

type TNoAuthContext = {
  signin: (token: string) => void;
};

export const NoAuthContext = React.createContext<TNoAuthContext | undefined>(
  undefined
)

// Manage unauthenticated user sessions. This context is only available whithin
// unauthenticated views.
export const useNoAuthContext = () => {
  const context = React.useContext(NoAuthContext)
  if (context === undefined) {
    throw new Error('NoAuthContext used outside of provider')
  }
  return context
}

export class NoAuthContextManager {
  constructor(private setToken: React.Dispatch<React.SetStateAction<null | string>>) {}

  public signin(token: string) {
    localStorage.setItem(LS_AUTH_TOKEN_KEY, token)
    this.setToken(token)
  }

  public attemptSigninFromLocalStorage() {
    const lsToken = localStorage.getItem(LS_AUTH_TOKEN_KEY)
    if (lsToken !== null) {
      this.setToken(lsToken)
    }
  }
}
