/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
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
import {stringToNoteBlock, withShortcuts } from '../../lib/editor'
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
  if (block == undefined) return <div />
  
  const blockContext = useBlockContext()
  const updateBlockMutation = useUpdateBlockInCurrentGroup()
  const { blocks, setBlocks } = useNoteContext()

  const initialEditorState = [
    {
      type: 'TYPE_PARAGRAPH',
      children: [{ text: 'lol-' + block.index }]
    } as Descendant
  ]
  
  /*noteBlocksToSlateElements(
    [
      {
        id: block.id,
        type: block.type,
        paragraph: block.content
      }
    ] as V1Block[]
  )*/
  
  const editorState = React.useRef<Descendant[]>(initialEditorState)
  editorState.current = initialEditorState

  const editor = React.useMemo(() => withShortcuts(withReact(withHistory(createEditor()))), [])
 
  //prevent null editor
  if (!Editor.hasPath(editor, [0, 0])) {
    Transforms.insertNodes (
      editor,
      { type: 'TYPE_PARAGRAPH', children: [{ text: 'lol-' + block.index }] },
      { at: [editor.children.length] }
    )
    editor.history = { undos: [], redos: [] }
  }

  //Set the focus on the isFocused block by useState
  React.useEffect(() => {
    blocks.forEach((currentBlock) => {
      if (currentBlock.isFocused && block?.index == currentBlock.index)
      {
        console.log('=====================>', block?.index)
        ReactEditor.focus(editor)
        Transforms.select(editor, Editor.end(editor, []))
      }
    })
  }, [editor, blocks])

  console.log('2-BlockEditorItem : normal flow', blocks)
  
  const updateBlockFromSlateValue = 
     (value: Descendant[]) => {
       const lines = value as any
       console.log('2-BlockEditorItem : block at the start of updateBlockFromSlateValue', blocks)
       const newBlocks = [...blocks]
  
       newBlocks[blockIndex].content = lines[0]?.children[0]?.text ?? ''
       updateBlock(
         note.id,
         block?.id,
         stringToNoteBlock(lines[0].children[0].text)
       )
  
       editorState.current = [
         {
           type: 'TYPE_PARAGRAPH',
           children: [{ text: lines[0]?.children[0]?.text ?? '' }]
         }
       ]
  
       const firstBlockPath = [0, 0]
       if (Editor.hasPath(editor, firstBlockPath)) {
         Transforms.setNodes(
           editor,
           { text: block?.content ?? '' },
           { at: [0, 0] }
         )
       }
       console.log('2-BlockEditorItem : set context in updateBlockFromSlateValue', newBlocks)
       //setBlocks(newBlocks)
     }
  
  const updateBlock = (
    notedId: string,
    blockId: string | undefined,
    block: V1Block
  ) => {
    console.log('----UPDATE')
    updateBlockMutation.mutate({
      noteId: notedId,
      blockId: blockId == undefined ? '' : blockId,
      body: block
    })
  }
  
  //const debouncedFunction = React.useMemo(() => debounce(hasBlocks ? updateBlockFromSlateValue : insertBlockFromSlateValue, 5), [])
  
  const handleEditorChange = (value: Descendant[]) => {
    if (editor.operations.some(op => 'set_selection' !== op.type)) {
      updateBlockFromSlateValue(value)
    }
  }
  
  const handleHover = () => {
    if (block != undefined) {
      blockContext.changeBlock(block.id)
    }
  }
  
  return (
    <div
      className='rounded-md border-gray-100 bg-gray-100 bg-gradient-to-br p-4 shadow-inner'
      onMouseEnter={handleHover}
    >
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
  )
}