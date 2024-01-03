import React from 'react'

import {
  V1Block,
} from '../protorepo/openapi/typescript-axios'


type BlockContext = {
  id: string
  type: string
  content: string
  index: number
  isFocused: boolean
}

interface TNoteContext {
  //noteId: string
  //changeNote: React.Dispatch<string | null>
  blocks: BlockContext[]
  setBlocks: React.Dispatch<BlockContext[]>
  insertBlock: (notedId: string, index: number | undefined, block: V1Block) => void
  updateBlock: (notedId: string, blockId: string, block: V1Block) => void
  deleteBlock: (notedId: string, blockId: string) => void
}

const NoteContext = React.createContext<TNoteContext | undefined>(undefined)

const useNoteContext = () => {
  const context = React.useContext(NoteContext)
  if (context === undefined) {
    throw new Error('NoteContext used outside of provider')
  }
  return context
}

const TNoteContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
    
  const [blocks, setBlocks] = React.useState<BlockContext[]>([])
      
  const insertBlock = (notedId: string, index: number | undefined, block: V1Block) => 
  {
    console.log(`insert ${notedId} ${index} ${block}`)
    return null
  }
  const updateBlock = (notedId: string, blockId: string, block: V1Block) => 
  {
    console.log(`udpate ${notedId} ${blockId} ${block}`)
    return null
  }
  const deleteBlock = (notedId: string, blockId: string) => 
  {
    console.log(`udpate ${notedId} ${blockId}`)
    return null
  }

  console.log('0-Context : ', blocks)

  return (
    <NoteContext.Provider
      value={{
        blocks,
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
  
export type { BlockContext }
export { useNoteContext }
export default TNoteContextProvider