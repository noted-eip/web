import React, { useState } from 'react'
import { createEditor,Descendant } from 'slate'
import { withHistory } from 'slate-history'
import { Editable, RenderElementProps, Slate, withReact } from 'slate-react'

import { useAuthContext } from '../../contexts/auth'
import { useInsertBlockInCurrentGroup,useUpdateBlockInCurrentGroup } from '../../hooks/api/notes'
import { noteBlocksToSlateElements, slateElementsToNoteBlock, withShortcuts } from '../../lib/editor'
import { NotesAPIInsertBlockRequest,V1Block, V1Note } from '../../protorepo/openapi/typescript-axios'


const EditorElement: React.FC<RenderElementProps> = props => {
  switch (props.element.type) {
    case 'TYPE_HEADING_1':
      return <h1 className='pt-4 pb-2 text-2xl font-medium text-gray-800 first:pt-0' {...props.attributes}>{props.children}</h1>
    case 'TYPE_HEADING_2':
      return <h2 className='pt-3 pb-2 text-xl font-medium text-gray-800 first:pt-0' {...props.attributes}>{props.children}</h2>
    case 'TYPE_HEADING_3':
      return <h3 className='py-2 text-lg font-medium normal-case text-gray-800 first:pt-0' {...props.attributes}>{props.children}</h3>
    case 'TYPE_BULLET_LIST':
      return <ul className='list-inside list-disc py-1 text-sm first:pt-0' {...props.attributes}>{props.children}</ul>
    case 'TYPE_NUMBER_LIST':
      return <ul className='list-inside list-decimal py-1 text-sm first:pt-0' {...props.attributes}>{props.children}</ul>
    case 'TYPE_LIST_ITEM':
      return <li className='py-1 px-2 text-sm first:pt-0' {...props.attributes}>{props.children}</li>
    case 'TYPE_PARAGRAPH':
      return <p className='py-1 text-sm text-slate-800 first:pt-0' {...props.attributes}>{props.children}</p>
    default:
      return <p className='py-1 text-sm text-slate-800 first:pt-0' {...props.attributes}>{props.children}</p>
  }
}
/*
const BlockListItem: React.FC<{ block: V1Block, noteId: string, authorAccountId: string, blockIndex: number}> = (props) => {
  console.log('UPDATE BLOCK')
  const authContext = useAuthContext()
  const initialEditorState = noteBlocksToSlateElements([props.block])
  const editorState = React.useRef<Descendant[]>(initialEditorState)
  const renderElement = React.useCallback(block => <EditorElement {...block} />, [])
  const editor = React.useMemo(() => withShortcuts(withReact(withHistory(createEditor()))), [])
  const updateBlockMutation = useUpdateBlockInCurrentGroup()

  const handleEditorChange = (value: Descendant[]) => {
    if (editor.operations.some(op => 'set_selection' !== op.type)) {
      editorState.current = value
      debouncedUpdateBlock()
    }
  }

  const updateBlock = () => {
    const latestState = slateElementsToNoteBlocks(editorState.current)[0]
    // @note: No changes on lastest blocks and actuals
    //if (blockArraysAreEqual(latestState, props.note.blocks || [])) return
    updateBlockMutation.mutate({
      noteId: props.noteId,
      blockId: props.block.id,
      body: latestState as V1Block
    })
  }

  const debouncedUpdateBlock = React.useMemo(() => debounce(updateBlock, 5), [])

  return (
    <div className='rounded-md bg-transparent bg-gradient-to-br p-1 hover:border-gray-100 hover:bg-gray-100 hover:shadow-inner'>
      <Slate
        onChange={handleEditorChange}
        editor={editor}
        value={initialEditorState}>
        <Editable
          readOnly={authContext.accountId !== props.authorAccountId}
          //className='m-lg min-h-[0.5px] px-1 xl:mx-xl'
          renderElement={renderElement} />
      </Slate>
    </div>
  )
}


const NewBlockListItem: React.FC<{ note: V1Note, toggle }> = props => {
  console.log('INSERT BLOCK')
  const authContext = useAuthContext()
  const initialEditorState = noteBlocksToSlateElements([{ type: 'TYPE_PARAGRAPH', paragraph: '' } as V1Block])
  const editorState = React.useRef<Descendant[]>(initialEditorState)
  const renderElement = React.useCallback(props => <EditorElement {...props} />, [])
  const editor = React.useMemo(() => withShortcuts(withReact(withHistory(createEditor()))), [])
  const insertBlockMutation = useInsertBlockInCurrentGroup()


  const handleEditorChange = (value: Descendant[]) => {
    if (editor.operations.some(op => 'set_selection' !== op.type)) {
      editorState.current = value
      debouncedUpdateBlock()
      props.toggle(prev => !prev)
      //debouncedUpdateBlock = React.useMemo(() => debounce(updateBlock, 5), [])
    }
  }

  const insertBlock = () => {
    const latestState = slateElementsToNoteBlocks(editorState.current)[0]
    insertBlockMutation.mutate({
      noteId: props.note.id,
      body: {
        index: 0,
        block: latestState as V1Block
      } as NotesAPIInsertBlockRequest
    })
  }

  const debouncedUpdateBlock = React.useMemo(() => debounce(insertBlock, 5), [])

  return (
    <div 
      className='cursor-pointer rounded-md bg-transparent bg-gradient-to-br p-4 hover:border-gray-100 hover:bg-gray-100 hover:shadow-inner'>
      <Slate
        onChange={handleEditorChange}
        editor={editor}
        value={initialEditorState}>
        <Editable
          readOnly={authContext.accountId !== props.note.authorAccountId}
          //className='m-lg min-h-[256px] px-1 xl:mx-xl'
          renderElement={renderElement} />
      </Slate>
    </div>
  )
}
*/

const BlockEditorItem: React.FC<{ note: V1Note, setToggleRefresh: React.Dispatch<React.SetStateAction<boolean>>, shouldUseInsertBlock: boolean, shouldUseUpdateBlock: boolean, blockIndex?: number }> = props => {
  const authContext = useAuthContext()
  const initialEditorState = noteBlocksToSlateElements(
    props.note?.blocks === undefined || props.blockIndex === undefined ?
      [{ type: 'TYPE_PARAGRAPH', paragraph: '' } as V1Block] :
      [props.note?.blocks[props.blockIndex]])
  const editorState = React.useRef<Descendant[]>(initialEditorState)
  const renderElement = React.useCallback(props => <EditorElement {...props} />, [])
  const editor = React.useMemo(() => withShortcuts(withReact(withHistory(createEditor()))), [])
  const insertBlockMutation = useInsertBlockInCurrentGroup()
  const updateBlockMutation = useUpdateBlockInCurrentGroup()


  console.log(`OUT : ${props.shouldUseInsertBlock}`)
  
  const handleEditorChange = (value: Descendant[]) => {
    if (editor.operations.some(op => 'set_selection' !== op.type)) {
      editorState.current = value

      console.log(`IN : ${props.shouldUseInsertBlock}`)

      // quand je CreateNote -> back -> faire un insertBlock
      // check les value pour le reste (update ou insert)

      value. = ''
      value. = '...'
      
      if (props.shouldUseInsertBlock) {
        insertBlock()
        props.setToggleRefresh(true)
      } else {
        updateBlock()
      }
    }
  }

  const insertBlock = () => {
    console.log('>USE INSERT BLOCK<')
    const latestState = slateElementsToNoteBlock(editorState.current)
    insertBlockMutation.mutate({
      noteId: props.note.id,
      body: {
        index: 0,
        block: latestState as V1Block
      } as NotesAPIInsertBlockRequest
    })
  }

  const updateBlock = () => {
    console.log('>USE UPDATE BLOCK<')
    const latestState = slateElementsToNoteBlock(editorState.current)
    // @note: No changes on lastest blocks and actuals
    //const palceholderBlock: V1Block = {id: '', type: 'TYPE_PARAGRAPH'}
    //if (blocksAreEqual(props.note.blocks === undefined ? palceholderBlock : props.note?.blocks[props.blockIndex === undefined ? 0 : props.blockIndex], latestState)) return
    updateBlockMutation.mutate({
      noteId:  props.note.id,
      blockId: props.note?.blocks == undefined ? '' : props.note.blocks[props.blockIndex == undefined ? 0 : props.blockIndex].id,
      body: latestState as V1Block
    })
  }

  //const debouncedFunction = React.useCallback(debounce(props.shouldUseInsertBlock ? insertBlock : updateBlock, 5), [props.shouldUseInsertBlock])
  //const debouncedFunction = React.useMemo(() => debounce(props.hasBlocks ? updateBlock : insertBlock, 5), [])

  return (
    <div 
      className='rounded-md bg-transparent bg-gradient-to-br p-4 hover:border-gray-100 hover:bg-gray-100 hover:shadow-inner'>
      <Slate
        onChange={handleEditorChange}
        editor={editor}
        value={initialEditorState}>
        <Editable
          readOnly={authContext.accountId !== props.note.authorAccountId}
          renderElement={renderElement} />
      </Slate>
    </div>
  )
}

const NoteViewEditor: React.FC<{ note: V1Note }> = props => {

  const [noteHasBlocks, setToggleRefresh] = useState(props.note.blocks?.length ? true : false)

  const useCurrentData: boolean = (props.note.blocks === undefined ? false : props.note.blocks.length <= 0)

  //console.log('Blocks in note = ', props.note.blocks?.length)
  //console.log(`NoteHasBlocks => ${noteHasBlocks}`)
  //console.log(`UseCurrentData => ${useCurrentData}`)
  
  return (
    <div>
      { noteHasBlocks && !useCurrentData ?
        props.note.blocks?.map((block, index) => (
          // essayer de mettre tout le React.FC block ici
          <BlockEditorItem key={`block-item-${index}`}
            note={props.note}
            setToggleRefresh={setToggleRefresh}
            shouldUseInsertBlock={false}
            shouldUseUpdateBlock={true}
            blockIndex={index}
          />
        )) :

        <BlockEditorItem key={'block-item'} 
          note={props.note}
          setToggleRefresh={setToggleRefresh}
          // esssayer de faire le setToggleRefresh ici
          shouldUseInsertBlock={!noteHasBlocks && useCurrentData}
          shouldUseUpdateBlock={noteHasBlocks && useCurrentData}
          blockIndex={undefined}
        />
        
      }
    </div>
  )
}

export default NoteViewEditor