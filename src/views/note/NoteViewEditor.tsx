import React from 'react'

import { useNoteContext } from '../../contexts/note'
import {noteBlocksToContextBlocks} from '../../lib/editor'
import { V1Note } from '../../protorepo/openapi/typescript-axios'
import { BlockEditorItem } from './BlockEditorItem'

const NoteViewEditor: React.FC<{ note: V1Note }> = ({ note }) => {
  
  const { blocks, setBlocks } = useNoteContext()

  React.useEffect(() => {
    console.log('1-NoteViewEditor : Init context with Backend', console.log(note?.blocks))
    setBlocks(noteBlocksToContextBlocks(note?.blocks ?? []))
  }, [])

  React.useEffect(() => {
    console.log('1-NoteViewEditor : update dans useEffect', blocks)
  }, [blocks])

  console.log('1-NoteViewEditor : normal flow'); console.log(blocks)

  return (
    <div>
      {blocks?.map((block, index) => (
        <BlockEditorItem
          key={`block-item-${index}`}
          note={note}
          block={block}
          blockIndex={index}
        />
      ))}
    </div>
  )
}

export default NoteViewEditor
