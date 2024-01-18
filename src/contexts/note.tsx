import React from 'react'

import {
  V1Block,
} from '../protorepo/openapi/typescript-axios'


export type BlockContext = {
  id: string
  type: string
  content: string
  index: number
  isFocused: boolean
}

interface TNoteContext {
  blocks: BlockContext[]
  setBlocks: React.Dispatch<BlockContext[]>
  clearBlocksContext: () => void
  insertBlock: (notedId: string, index: number | undefined, block: V1Block) => void
  updateBlock: (index: number, block: BlockContext) => void
  deleteBlock: (notedId: string, blockId: string) => void
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
      
  const insertBlock = () => 
  {
    return null
  }
  
  const updateBlock = (index: number, block: BlockContext) => 
  {
    const newBlocks = [...blocks]
    newBlocks.splice(index, 1, block)
    setBlocks(newBlocks)
  }

  const deleteBlock = () => 
  {
    return null
  }

  return (
    <NoteContext.Provider
      value={{
        blocks,
        clearBlocksContext,
        setBlocks,
        insertBlock,
        updateBlock,
        deleteBlock, 
      }}
    >
      {children}
    </NoteContext.Provider>
  )
}

export default TNoteContextProvider
