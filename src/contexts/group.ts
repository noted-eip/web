import React from 'react'

type TGroupContext = {
  groupID: string | null,
  changeGroup: React.Dispatch<string | null>
};

export const GroupContext = React.createContext<TGroupContext | undefined>(undefined)

// Manage unauthenticated user sessions. This context is only available whithin
// unauthenticated views.
export const useGroupContext = () => {
  const context = React.useContext(GroupContext)
  if (context === undefined) {
    throw new Error('GroupContext used outside of provider')
  }
  return context
}
