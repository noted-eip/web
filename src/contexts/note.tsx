import React from 'react'

import { SlateText } from '../lib/editor'

export type BlockContext = {
  id: string
  type: string
  children: SlateText[]
  index: number
  isFocused: boolean
}

interface TNoteContext {
  blocks: BlockContext[]
  setBlocks: React.Dispatch<BlockContext[]>
  clearBlocksContext: () => void
}

const NoteContext = React.createContext<TNoteContext | undefined>(undefined)

export const useNoteContext = () => {
  const context = React.useContext(NoteContext)
  if (context === undefined) {
    throw new Error('NoteContext used outside of provider')
  }
  return context
}

const TNoteContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
    
  const [blocks, setBlocks] =  React.useState<BlockContext[]>([])

  const clearBlocksContext = () =>
  {
    setBlocks([])
  }

  return (
    <NoteContext.Provider
      value={{
        blocks,
        clearBlocksContext,
        setBlocks
      }}
    >
      {children}
    </NoteContext.Provider>
  )
}

export default TNoteContextProvider
