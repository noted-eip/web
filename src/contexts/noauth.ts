import React from 'react'

type TNoAuthContext = {
  signin: (email: string, password: string) => void;
  signup: (name: string, email: string, password: string) => void;
};

export const NoAuthContext = React.createContext<TNoAuthContext | undefined>(
  undefined
)

// Perform signin and signup operations on a unauthenticated session. This
// context is only available whithin unauthenticated views.
export const useNoAuthContext = () => {
  const context = React.useContext(NoAuthContext)
  if (context === undefined) {
    throw new Error('NoAuthContext used outside of provider')
  }
  return context
}
