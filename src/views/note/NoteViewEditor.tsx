import React from 'react'

import { useNoteContext } from '../../contexts/note'
import {noteAPIToContextBlocks} from '../../lib/editor'
import { V1Note } from '../../protorepo/openapi/typescript-axios'
import { BlockEditorItem } from './BlockEditorItem'


const NoteViewEditor: React.FC<{ note: V1Note }> = ({ note }) => {
  
  const { blocks, setBlocks } = useNoteContext()

  React.useEffect(() => {
    setBlocks(noteAPIToContextBlocks(note ?? []))
  }, [note?.blocks])

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
