import React from 'react'

type TRecoModeContext = {
  recoMode: string | null
  changeRecoMode: React.Dispatch<string | null>
}

export const RecoModeContext = React.createContext<TRecoModeContext | undefined>(undefined)

// Manage unauthenticated user sessions. This context is only available whithin
// unauthenticated views.
export const useRecoModeContext = () => {
  const context = React.useContext(RecoModeContext)
  if (context === undefined) {
    throw new Error('RecoModeContextContext used outside of provider')
  }
  return context
}