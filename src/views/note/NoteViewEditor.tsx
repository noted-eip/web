import React from 'react'
import { createEditor,Descendant } from 'slate'
import { withHistory } from 'slate-history'
import { Editable, RenderElementProps, Slate, withReact } from 'slate-react'

import { useAuthContext } from '../../contexts/auth'
import { useBlockContext } from '../../contexts/block'
import { useInsertBlockInCurrentGroup,useUpdateBlockInCurrentGroup } from '../../hooks/api/notes'
import { noteBlocksToSlateElements, slateElementsToNoteBlock, withShortcuts } from '../../lib/editor'
import { blocksAreEqual } from '../../lib/editor'
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

const BlockEditorItem: React.FC<{ note: V1Note, block: V1Block, blockIndex?: number }> = props => {
  const authContext = useAuthContext()
  const blockContext = useBlockContext()
  const initialEditorState = noteBlocksToSlateElements(
    props.note?.blocks === undefined || props.blockIndex === undefined ?
      [{ type: 'TYPE_PARAGRAPH', paragraph: '' } as V1Block] :
      [props.note?.blocks[props.blockIndex]])
  const editorState = React.useRef<Descendant[]>(initialEditorState)
  const renderElement = React.useCallback(props => <EditorElement {...props} />, [])
  const editor = React.useMemo(() => withShortcuts(withReact(withHistory(createEditor()))), [])
  const insertBlockMutation = useInsertBlockInCurrentGroup()
  const updateBlockMutation = useUpdateBlockInCurrentGroup()
  
  const insertBlock = () => {
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
    const latestState = slateElementsToNoteBlock(editorState.current)
    // @note: No changes on lastest blocks and actuals
    const palceholderBlock: V1Block = {id: '', type: 'TYPE_PARAGRAPH'}
    if (blocksAreEqual(props.note.blocks === undefined ? palceholderBlock : props.note?.blocks[props.blockIndex === undefined ? 0 : props.blockIndex], latestState)) return
    updateBlockMutation.mutate({
      noteId:  props.note.id,
      blockId: props.note?.blocks == undefined ? '' : props.note.blocks[props.blockIndex == undefined ? 0 : props.blockIndex].id,
      body: latestState as V1Block
    })
  }

  //const debouncedFunction = React.useMemo(() => debounce(props.hasBlocks ? updateBlock : insertBlock, 5), [])

  const handleEditorChange = (value: Descendant[]) => {
    if (editor.operations.some(op => 'set_selection' !== op.type)) {
      editorState.current = value
      
      if (value.length == -1) {
        insertBlock()
      } else {
        updateBlock()
      }
    }
  }

  const handleHover = () => {
    blockContext.changeBlock(props.block.id)
  }

  return (
    <div 
      className='rounded-md bg-transparent bg-gradient-to-br p-4' //hover:border-gray-100 hover:bg-gray-100 hover:shadow-inner
      onMouseEnter={handleHover}>
      <Slate
      //ternaire ici avec 2 handle different pour insert & update
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
  return (
    <div>
      {
        props.note.blocks?.map((block, index) => (
          <BlockEditorItem key={`block-item-${index}`}
            note={props.note}
            block={block}
            blockIndex={index}
          />
        ))
      }
    </div>
  )
}

export default NoteViewEditor

//https://stackoverflow.com/questions/69353903/how-to-color-specific-keywords-in-slate-js
