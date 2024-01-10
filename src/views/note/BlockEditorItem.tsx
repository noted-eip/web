/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect } from 'react'
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
  if (block == undefined) return <div />
  
  const blockContext = useBlockContext()
  const updateBlockMutation = useUpdateBlockInCurrentGroup()
  const { blocks, setBlocks, updateBlock } = useNoteContext()
  
  const initialEditorState = noteBlocksContextToSlateElements([blocks[block.index]])
  const editorState = React.useRef<Descendant[]>(initialEditorState)
  editorState.current = initialEditorState
  const editor = React.useMemo(() => withShortcuts(withReact(withHistory(createEditor()))), [])


  if (!Editor.hasPath(editor, [0, 0])) {
    Transforms.insertNodes (
      editor,
      { type: 'TYPE_PARAGRAPH', children: [{ text: 'error on block id ' + block.index }] },
      { at: [editor.children.length] }
    )
    editor.history = { undos: [], redos: [] }
  }

  useEffect(() => {
    blocks.forEach((currentBlock) => {
      if (currentBlock != undefined)
      {
        if (currentBlock.isFocused && block?.index == currentBlock.index)
        {
          //console.log('==================SWITCH FOCUS====================')
          ReactEditor.focus(editor)
          Transforms.select(editor, Editor.end(editor, []))
        }
      }
    })
    // peut être enlever blocks de [] pour la perf
  }, [editor, blocks])

  /*useEffect(() => {
    console.log(blocks)
  }, [blocks])*/

  // Problème - quand on update dans cette fonction, blocks sont pas a jour
  const updateBlockFromSlateValue = useCallback((value: Descendant[]) => {
    console.log('=====>2-BlockEditorItem : block at the start of updateBlockFromSlateValue', blocks)

    const updatedContent = slateElementsToString(value)
    const newBlock: BlockContext = {
      id: block.id,
      type: 'TYPE_PARAGRAPH',
      content: updatedContent,
      index: block.index,
      isFocused: block.isFocused
    }

    updateBlockBackend(note.id, block?.id, blockContextToNoteBlock(newBlock))
    blocks[blockIndex].content = updatedContent
    updateBlock(block.index, newBlock)

    // @WARNING - Y a un monde cette ligne fait tout crash pdnt le hot reload ou des fois comme ca pour le kiff
    // @TODO : push tout 1 par 1 OU blc
    editorState.current = [{ type: 'TYPE_PARAGRAPH', children: [{ text: updatedContent ?? '' }] }]
  
    //setBlocks(newBlocks)
    console.log('=====>2-BlockEditorItem : set context in updateBlockFromSlateValue', blocks)
  }, [blocks])
  
  const updateBlockBackend = (
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