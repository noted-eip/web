import React from 'react'

type TBlockContext = {
  blockId: string | null
  changeBlock: React.Dispatch<string | null>
}

export const BlockContext = React.createContext<TBlockContext | undefined>(undefined)

// Manage unauthenticated user sessions. This context is only available whithin
// unauthenticated views.
export const useBlockContext = () => {
  const context = React.useContext(BlockContext)
  if (context === undefined) {
    throw new Error('BlockContextContext used outside of provider')
  }
  return context
}