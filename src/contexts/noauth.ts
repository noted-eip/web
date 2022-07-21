import React from 'react'

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
