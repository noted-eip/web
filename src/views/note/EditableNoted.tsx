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
  blockContextToNoteBlockAPI,
  getSplitContentByCursorFromEditor,
  HOTKEYS} from '../../lib/editor'
import {
  BlockTextStyle,
  NotesAPIInsertBlockRequest,
  TextStylePosition,
  TextStyleStyle,
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
    //console.log('3-EditableNoted : Blocks insert backend', block)
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
    //console.log('3-EditableNoted : Blocks update backend', block)
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
    deleteBlockMutation.mutate({
      noteId: notedId,
      blockId: blockId == undefined ? '' : blockId,
    })
  }

  // @Todo : merge content before cursor
  const handleBackspace = () => {
    const childrens = editor.children[0] as any
    if (childrens === undefined) return
    const firstLine = childrens?.children[0]
    if (firstLine === undefined) return
    const firstLineContent = firstLine?.text ?? 'error'

    if (firstLineContent.length < 1 && blockIndex != 0) {
      //console.log('3-EditableNoted : handleBackspace ok')
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

    const oldLocalBlock = { 
      id: block?.id, 
      type: blocks[blockIndex].type,
      children: contentBeforeEnter,
      index: blockIndex,
      isFocused: false
    } as BlockContext

    const newLocalBlock = { 
      id: 'tmp-id', 
      type: 'TYPE_PARAGRAPH',
      children: contentAfterEnter,
      index: blockIndex + 1,
      isFocused: true
    } as BlockContext

    updateBlockBackend(note.id, block?.id ?? '', blockContextToNoteBlockAPI(oldLocalBlock))
    newLocalBlock.id = await insertBlockBackend(note.id, blockIndex + 1 ?? 1000, blockContextToNoteBlockAPI(newLocalBlock))

    //console.log('3-EditableNoted : blocks begin handle enter ', blocks)
    
    const newBlocks = [...blocks]
    newBlocks[blockIndex] = oldLocalBlock
    newBlocks.splice(blockIndex + 1, 0, newLocalBlock)
    setBlocks(newBlocks)
    
    //console.log('3-EditableNoted : newBlocks after handle enter ', newBlocks)

    // @note: replacing the current block with updated content
    if (contentAfterEnter.length > 0) {
      Transforms.removeNodes(editor, { at: [0] })
      Transforms.insertNodes(editor, { type: 'TYPE_PARAGRAPH', children: contentBeforeEnter }, { at: [0] })
    }
  }

  // TEST rich text
  const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor)
    
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

      // TEST Backend
      const { selection } = editor
      if (selection == null) return
      const cursorRowPosition = selection.focus.path[0]
      const cursorColumnPosition = selection.focus.offset
      
      const oldLocalBlock = { 
        id: blocks[blockIndex].id, 
        type: blocks[blockIndex].type,
        children: blocks[blockIndex].children,
        //content: blocks[blockIndex].content, 
        index: blockIndex,
        isFocused: blocks[blockIndex].isFocused
      } as BlockContext

      const apiBlock = blockContextToNoteBlockAPI(oldLocalBlock)
      const marks = Editor.marks(editor)

      console.log('Marks : ', marks)
      apiBlock.styles?.push(
        {
          style: 'STYLE_BOLD' as TextStyleStyle,
          pos: { start: cursorRowPosition, length: cursorColumnPosition } as TextStylePosition,
          //color: { r: marks?.color.color.r, g: marks?.color.color.g, b: marks?.color.color.b } as TextStyleColor
        } as BlockTextStyle
      )
      
      console.log('apiBlock : ', apiBlock)
      console.log('apiBlock id: ', apiBlock.id)
      console.log('apiBlock styles : ', apiBlock.styles)
      updateBlockBackend(note.id, apiBlock.id, apiBlock)
      //!TEST Backend
    }
  }
  // !TEST rich text
  
  
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