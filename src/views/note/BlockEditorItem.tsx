/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline'
import { Bars3Icon } from '@heroicons/react/24/outline'
import React, { useCallback } from 'react'
import { createEditor, Descendant, Editor, Transforms } from 'slate'
import { withHistory } from 'slate-history'
import {
  ReactEditor,
  Slate,
  withReact} from 'slate-react'

import { useBlockContext } from '../../contexts/block'
import { useNoteContext } from '../../contexts/note'
import { BlockContext } from '../../contexts/note'
import {
  useUpdateBlockInCurrentGroup
} from '../../hooks/api/notes'
import { 
  blockContextToNoteBlock,
  defaultBgColor,
  noteBlocksContextToSlateElements,
  slateElementsToString, 
  withShortcuts 
} from '../../lib/editor'
import {
  V1Block,
  V1Note
} from '../../protorepo/openapi/typescript-axios'
import {EditableNoted} from './EditableNoted'

export const BlockEditorItem: React.FC<{
  note: V1Note
  block: BlockContext
  blockIndex: number
}> = ({ note, block, blockIndex }) => {
  if (block == undefined) return <div/>

  const [isHovered, setIsHovered] = React.useState(false)

  const blockContext = useBlockContext()
  const updateBlockMutation = useUpdateBlockInCurrentGroup()
  const { blocks } = useNoteContext()

  const initialEditorState = noteBlocksContextToSlateElements([blocks[block.index]])
  const editorState = React.useRef<Descendant[]>(initialEditorState)
  editorState.current = initialEditorState
  const editor = React.useMemo(() => withShortcuts(withReact(withHistory(createEditor()))), [])


  if (!Editor.hasPath(editor, [0, 0])) {
    Transforms.insertNodes (
      editor,
      { type: 'TYPE_PARAGRAPH', children: [{ text: '', bold: false, italic: false, code: false, underline: false, color: defaultBgColor }] },
      { at: [editor.children.length] }
    )
    editor.history = { undos: [], redos: [] }
  }

  React.useEffect(() => 
  {
    blocks.forEach((currentBlock) => {
      if (currentBlock != undefined)
      {
        if (currentBlock.isFocused && block?.index == currentBlock.index)
        {
          ReactEditor.focus(editor)
          Transforms.select(editor, Editor.end(editor, []))
        }
      }
    })
    // @todo: peut être enlever blocks de [] pour la perf
  }, [editor, blocks])


  const updateBlockFromSlateValue = useCallback((value: Descendant[]) => 
  {
    editorState.current = value

    const updatedContent = slateElementsToString(value)

    const newBlock: BlockContext = {
      id: block.id, 
      type: (editorState.current[0] as any).type,
      content: updatedContent,
      index: block.index, 
      isFocused: block.isFocused
    }

    //console.log('2-BlockEditorItem : in callback ', blocks)

    updateBlockBackend(note.id, block?.id, blockContextToNoteBlock(newBlock))
    blocks[blockIndex] = newBlock
  
  }, [blocks])
  
  const updateBlockBackend = (
    noteId: string,
    blockId: string | undefined,
    block: V1Block
  ) => {
    updateBlockMutation.mutate({
      noteId: noteId,
      blockId: blockId == undefined ? '' : blockId,
      body: block
    })
  }
  
  const handleEditorChange = (value: Descendant[]) => {
    if (editor.operations.some(op => 'set_selection' !== op.type)) {
      updateBlockFromSlateValue(value)
      setIsHovered(false)
    }
  }
  
  const handleHover = () => {
    setIsHovered(true)
    if (block != undefined) {
      blockContext.changeBlock(block.id)
    }
  }

  const handleLeave = () => {
    setIsHovered(false)
  }


  return (

    <div
      className={`mx-xl flex max-w-screen-xl items-center justify-between rounded-md ${isHovered ? 'border-gray-50 bg-gray-50 bg-gradient-to-br shadow-inner' : ''} overflow-x-hidden`}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
    >
      <div className='h-6 w-8 px-2'>
        {isHovered ? (
          <Bars3Icon className='h-6 w-6 text-gray-400' />
        ) : (
          <div className='flex h-6 w-6 items-center justify-center'></div>
        )}
      </div>

      <div className='grow rounded-md bg-transparent p-4' style={{ maxWidth: 'full', overflowX: 'hidden' }}>
        <Slate
          onChange={handleEditorChange}
          editor={editor}
          value={editorState.current}
        >
          <EditableNoted
            block={block}
            note={note}
            editor={editor}
            blockIndex={blockIndex}
            editorState={editorState.current}
          />
        </Slate>
      </div>

      <div className='h-6 w-8'>
        {isHovered ? (
          <ChatBubbleOvalLeftEllipsisIcon className='h-6 w-6 text-gray-400' />
        ) : (
          <div className='flex h-6 w-6 items-center justify-center'></div>
        )}
        <div className='h-2 w-8 px-2'/>
      </div>
    </div>
    
  )
}
