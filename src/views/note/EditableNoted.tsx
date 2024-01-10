/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { BaseEditor, Descendant, Editor } from 'slate'
import {
  Editable,
  ReactEditor} from 'slate-react'

import { useAuthContext } from '../../contexts/auth'
import { BlockContext } from '../../contexts/note'
import { useNoteContext } from '../../contexts/note'
import {
  useDeleteBlockInCurrentGroup,
  useInsertBlockInCurrentGroup,
  useUpdateBlockInCurrentGroup
} from '../../hooks/api/notes'
import { getSplitContentByCursorFromEditor,stringToNoteBlock } from '../../lib/editor'
import {
  NotesAPIInsertBlockRequest,
  V1Block,
  V1Note
} from '../../protorepo/openapi/typescript-axios'
import { EditorElement } from './EditorElement'

export const EditableNoted: React.FC<{
  note: V1Note
  block?: BlockContext
  blockIndex: number
  editorState: Descendant[]
  editor: BaseEditor & ReactEditor
}> = ({ editor, block, note, editorState, blockIndex }) => {
  
  const authContext = useAuthContext()
  const { blocks, setBlocks } = useNoteContext()

  const insertBlockMutation = useInsertBlockInCurrentGroup()
  const updateBlockMutation = useUpdateBlockInCurrentGroup()
  const deleteBlockMutation = useDeleteBlockInCurrentGroup()

  const renderElement = React.useCallback(
    props => <EditorElement {...props} />,
    []
  )
  
  const insertBlockBackend = async (
    notedId: string,
    index: number | undefined,
    block: V1Block
  ) => {
    console.log('----INSERT')
    const res = await insertBlockMutation.mutateAsync({
      noteId: notedId,
      body: {
        index: index,
        block: block
      } as NotesAPIInsertBlockRequest
    })
    return res.block.id
  }
  
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
  
  const deleteBlockBackend = (
    notedId: string,
    blockId: string | undefined
  ) => {
    console.log('----DELETE')
    if (block == undefined) return
    deleteBlockMutation.mutate({
      noteId: notedId,
      blockId: blockId == undefined ? '' : blockId,
    })
  }

  const handleBackspace = () => {
    const element = editorState[0] as any

    console.log('handleBackspace')
    if (element.children[0].text.length < 1 && blockIndex != 0) {
      const newBlocks = [...blocks]
      newBlocks[blockIndex - 1].isFocused = true
      newBlocks[blockIndex].isFocused = false
      delete newBlocks[blockIndex]
      setBlocks(newBlocks)
      deleteBlockBackend(note.id, block?.id)
    }
  }
  
  const handleEnter = () => {
    const { selection } = editor
  
    if (selection == null)
      return

    const [contentBeforeEnter, contentAfterEnter] = getSplitContentByCursorFromEditor(editorState, selection)
    
    updateBlockBackend(note.id, block?.id ?? '', stringToNoteBlock(contentBeforeEnter))
    insertBlockBackend(note.id, blockIndex + 1 ?? 1000, stringToNoteBlock(contentAfterEnter))
    //const newBlockId = await insertBlock(note.id, blockIndex == undefined ? 1000 : blockIndex + 1, stringToNoteBlock(newBlockContent))

    const oldLocalBlock = { id: block?.id, type: block?.type,
      content: contentBeforeEnter, index: blockIndex,
      isFocused: false
    } as BlockContext
    
    const newLocalBlock = { id: 'fake-id', type: 'TYPE_PARAGRAPH',
      content: contentAfterEnter, index: blockIndex + 1,
      isFocused: true
    } as BlockContext


    const newBlocks = [...blocks]
    console.log('3-EditableNoted : newBlocks begin handle enter ', newBlocks)

    newBlocks[blockIndex] = oldLocalBlock
    if (newBlocks[0] != undefined) console.log('3-EditableNoted : newBlocks[0] middle handle enter ', newBlocks[0].content)
    if (newBlocks[1] != undefined) console.log('3-EditableNoted : newBlocks[1] middle handle enter ', newBlocks[1].content)
    if (newBlocks[2] != undefined) console.log('3-EditableNoted : newBlocks[2] middle handle enter ', newBlocks[2].content)

    // EN FONCTION DE SI (blockIndex + 1 == undefined) push un block OU insert un block
    newBlocks.push(newLocalBlock)
    //newBlocks.splice(blockIndex + 1, 0, newLocalBlock)

    setBlocks(newBlocks)

    console.log('3-EditableNoted : newBlocks after handle enter ', newBlocks)
    console.log('3-EditableNoted : blocks after handle enter ', blocks)

    // test de set l'editeur
    //Transforms.setNodes(editor, { type: 'TYPE_PARAGRAPH', children: [{ text: contentBeforeEnter }] })
    //editorState.current = noteBlocksContextToSlateElements([oldLocalBlock])
    //editor.children = noteBlocksContextToSlateElements([oldLocalBlock])
  }
  
  return (
    <Editable
      onKeyDown={event => {
        const {selection} = editor

        if (event.key == 'Backspace' && block?.index != 0) {
          if (selection?.focus.path[0] === Editor.start(editor, []).path[0]
            && selection?.focus.offset === Editor.start(editor, []).offset) 
          {
            event.preventDefault()
            // @TODO : merge ce qu'il y a dans ce bloc avec celui d'avant
            handleBackspace()
          }
        }

        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault()
          // @TODO BUG : split le contenu d'avant le curseur
          handleEnter()
        }

        if (event.key == 'ArrowUp' && !event.shiftKey) {
          if (selection?.focus.path[0] === Editor.start(editor, []).path[0])
          {
            const newBlocks = [...blocks]
            newBlocks[blockIndex].isFocused = false
            newBlocks[blockIndex - 1].isFocused = true
            setBlocks(newBlocks)
          }
        }

        if (event.key == 'ArrowDown' && !event.shiftKey) {
          if (selection?.focus.path[0] == Editor.end(editor, []).path[0])
          {
            const newBlocks = [...blocks]
            newBlocks[blockIndex].isFocused = false
            newBlocks[blockIndex + 1].isFocused = true
            setBlocks(newBlocks)
          }
        }
        
        if (event.key == 'ArrowLeft' && !event.shiftKey) {
          if (selection?.focus.path[0] === Editor.start(editor, []).path[0] 
            && selection?.focus.offset === Editor.start(editor, []).offset)
          {
            const newBlocks = [...blocks]
            newBlocks[blockIndex].isFocused = false
            newBlocks[blockIndex - 1].isFocused = true
            setBlocks(newBlocks)
          }
        }
        if (event.key == 'ArrowRight' && !event.shiftKey) {
          if (selection?.focus.path[0] === Editor.end(editor, []).path[0] 
            && selection?.focus.offset === Editor.end(editor, []).offset)
          {
            const newBlocks = [...blocks]
            newBlocks[blockIndex].isFocused = false
            newBlocks[blockIndex + 1].isFocused = true
            setBlocks(newBlocks)
          }
        }
      }}
      readOnly={authContext.accountId !== note.authorAccountId}
      renderElement={renderElement}
    />
  )
}