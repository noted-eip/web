/* eslint-disable @typescript-eslint/no-explicit-any */
import isHotkey from 'is-hotkey'
import React from 'react'
import { BaseEditor, Descendant, Editor, Transforms } from 'slate'
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
import { useOurIntl } from '../../i18n/TextComponent'
import { 
  blockContextToNoteBlock,
  defaultBgColor,
  getSplitContentByCursorFromEditor,
  HOTKEYS,
  stringToNoteBlock} from '../../lib/editor'
import {
  NotesAPIInsertBlockRequest,
  V1Block,
  V1Note
} from '../../protorepo/openapi/typescript-axios'
import { EditorElement } from './EditorElement'
import { Leaf } from './Leaf'

export const EditableNoted: React.FC<{
  note: V1Note
  block?: BlockContext
  blockIndex: number
  editorState: Descendant[]
  editor: BaseEditor & ReactEditor
}> = ({ editor, block, note, editorState, blockIndex }) => {
  
  const { formatMessage } = useOurIntl()
  const authContext = useAuthContext()
  const { blocks, setBlocks } = useNoteContext()

  const insertBlockMutation = useInsertBlockInCurrentGroup()
  const updateBlockMutation = useUpdateBlockInCurrentGroup()
  const deleteBlockMutation = useDeleteBlockInCurrentGroup()

  const renderElement = React.useCallback(
    props => <EditorElement {...props} />,
    []
  )

  const renderLeaf = React.useCallback(
    props => <Leaf {...props} />, 
    []
  )

  const insertBlockBackend = async (
    notedId: string,
    index: number | undefined,
    block: V1Block
  ) => {
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
  
  const handleEnter = async () => {
    const { selection } = editor
  
    if (selection == null)
      return

    const [contentBeforeEnter, contentAfterEnter] = getSplitContentByCursorFromEditor(editor, selection)
    const columnPosition = selection.focus.path[0]
    const beforeEnterContentArray = contentBeforeEnter.split('\n') as string[]
    const lastLineContentBeforeEnter = beforeEnterContentArray[beforeEnterContentArray.length - 1]
    
    const oldLocalBlock = { 
      id: block?.id, 
      type: blocks[blockIndex].type,
      content: contentBeforeEnter, 
      index: blockIndex,
      isFocused: false
    } as BlockContext

    updateBlockBackend(note.id, block?.id ?? '', blockContextToNoteBlock(oldLocalBlock))
    
    const newBlockId = await insertBlockBackend(note.id, blockIndex + 1 ?? 1000, stringToNoteBlock(contentAfterEnter))
    
    const newLocalBlock = { 
      id: newBlockId, 
      type: 'TYPE_PARAGRAPH',
      content: contentAfterEnter, 
      index: blockIndex + 1,
      isFocused: true
    } as BlockContext


    //console.log('3-EditableNoted : blocks begin handle enter ', blocks)
    
    const newBlocks = [...blocks]
    newBlocks[blockIndex] = oldLocalBlock
    newBlocks.splice(blockIndex + 1, 0, newLocalBlock)
    setBlocks(newBlocks)
    
    //console.log('3-EditableNoted : newBlocks after handle enter ', newBlocks)

    // @note: replacing the current block with updated content
    if (contentAfterEnter.length > 0) {
      for (let i = Editor.end(editor, []).path[0]; i >= columnPosition; --i) {
        Transforms.removeNodes(editor, { at: [i] })
      }

      Transforms.insertNodes(
        editor,
        { type: 'TYPE_PARAGRAPH', children: [
          {
            text: lastLineContentBeforeEnter, 
            bold: false, italic: false, code: false, underline: false,
            color: defaultBgColor
          }]
        },
        { at: [columnPosition] }
      )
    }
  }

  // TEST
  const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor)
    
    console.log('Marks : ', marks)
    return marks ? marks[format] === true : false
  }

  const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format)
  
    if (isActive) {
      console.log('removeMark ', format)
      Editor.removeMark(editor, format)
    } else {
      console.log('addMarkMark ', format)
      Editor.addMark(editor, format, true)
    }
  }
  // TEST
  
  
  return (
    <Editable
      onKeyDown={event => {
        const {selection} = editor

        for (const hotkey in HOTKEYS) {
          if (isHotkey(hotkey, event as any)) {
            console.log('hotkey = ', hotkey)
            event.preventDefault()
            const mark = HOTKEYS[hotkey]
            toggleMark(editor, mark)
          }
        }

        if (event.key == 'Backspace' && block?.index != 0) {
          if (selection?.focus.path[0] === Editor.start(editor, []).path[0]
            && selection?.focus.offset === Editor.start(editor, []).offset) 
          {
            event.preventDefault()
            // @Todo : merge content before cursor
            handleBackspace()
          }
        }

        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault()
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
      renderLeaf={renderLeaf}
      placeholder={formatMessage({id: 'EDITOR.placeholder'})}
      spellCheck
    />
  )
}