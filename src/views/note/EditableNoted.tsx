/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { BaseEditor, Descendant } from 'slate'
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
import { stringToNoteBlock } from '../../lib/editor'
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


  //blocks.forEach((currentBlock) => {
  //  if (currentBlock.isFocused && block?.index == currentBlock.index)
  //  {
  //console.log('==================> SELECTED')
      
  //const point = { path: [0, 0], offset: 0 }
  //editor.selection = { anchor: point, focus: point }
  //Transforms.select(editor, [0, 0])

  //Transforms.move(editor)
  //Transforms.select(editor, Editor.end(editor, []))

  //if (!ReactEditor.isReadOnly(editor) && Editor.hasPath(editor, [0, 0])) {
  //  console.log('===================> FOCUS <=======================')
  //  ReactEditor.focus(editor)
  //}
  //  }
  //})

  //const slate = useSlate()
  //console.log(slate.selection?.focus)

  
  const insertBlock = async (
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
  
  const deleteBlock = (
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
      deleteBlock(note.id, block?.id)
    }
  }
  
  const handleEnter = () => {
    const lines = editorState as any
    const { selection } = editor
  
    if (selection == null) return
  
    const cursorRowPosition = selection.focus.path[0]
    const cursorColumnPosition = selection.focus.offset
  
    let contentBeforeEnter = ''
    let contentAfterEnter = ''
  
    for (let i = 0; i < lines.length; ++i) {
      for (let j = 0; j < lines[i].children[0].text.length; ++j) {
        if (cursorRowPosition <= i && cursorColumnPosition <= j)
          contentAfterEnter += lines[i].children[0].text[j]
        else contentBeforeEnter += lines[i].children[0].text[j]
      }
    }
  
    updateBlock(note.id, block?.id ?? '', stringToNoteBlock(contentBeforeEnter))
    insertBlock(note.id, blockIndex + 1 ?? 1000, stringToNoteBlock(contentAfterEnter))
  
    const newBlockContent = contentAfterEnter
    //const newBlockId = await insertBlock(note.id, blockIndex == undefined ? 1000 : blockIndex + 1, stringToNoteBlock(newBlockContent))
    const newLocalBlock = {
      id: 'fake-id',
      type: 'TYPE_PARAGRAPH',
      content: newBlockContent,
      index: blockIndex + 1,
      isFocused: true
    } as BlockContext

    const newBlocks = [...blocks]
    newBlocks[blockIndex].isFocused = false
    newBlocks.splice(blockIndex + 1, 0, newLocalBlock)
    setBlocks(newBlocks)
    console.log('3-EditableNoted : set les new block dans le contexte', newBlocks)
  }
  
  return (
    <Editable
      onKeyDown={event => {
        if (event.key == 'Backspace') {
          event.preventDefault()
          handleBackspace()
        }

        if (event.key == 'Enter') {
          event.preventDefault()
          handleEnter()
        }

        if (event.key == 'ArrowUp') {
          event.preventDefault()
          const newBlocks = [...blocks]
          newBlocks[blockIndex].isFocused = false
          newBlocks[blockIndex - 1].isFocused = true
          setBlocks(newBlocks)
        }
        if (event.key == 'ArrowDown') {
          event.preventDefault()
          const newBlocks = [...blocks]
          newBlocks[blockIndex].isFocused = false
          newBlocks[blockIndex + 1].isFocused = true
          setBlocks(newBlocks)
        }
        
        /*if (event.key == 'ArrowLeft') {
          //if last character & last line
          event.preventDefault()
          console.log('==========================================UPPPPP')
        }
        if (event.key == 'ArrowRight') {
          //if first character & first line
          event.preventDefault()
          console.log('==========================================UPPPPP')
        }*/
      }}
      readOnly={authContext.accountId !== note.authorAccountId}
      renderElement={renderElement}
    />
  )
}