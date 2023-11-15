import React from 'react'
import { createEditor,Descendant } from 'slate'
import { withHistory } from 'slate-history'
import { Editable, RenderElementProps, Slate, withReact } from 'slate-react'

import { useAuthContext } from '../../contexts/auth'
import { useBlockContext } from '../../contexts/block'
import { useDeleteBlockInCurrentGroup, useInsertBlockInCurrentGroup, useUpdateBlockInCurrentGroup } from '../../hooks/api/notes'
import { noteBlocksToSlateElements,stringToNoteBlock,withShortcuts } from '../../lib/editor'
import { NotesAPIInsertBlockRequest, V1Block, V1Note } from '../../protorepo/openapi/typescript-axios'


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

const BlockEditorItem: React.FC<{ note: V1Note, block?: V1Block, blockIndex?: number, localBlocks: V1Block[], localSetBlocks: any }> = props => {
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
  const deleteBlockMutation = useDeleteBlockInCurrentGroup()

  const updateBlockFromSlateValue = (value: Descendant[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lines = value as any
    editorState.current = value

    updateBlock(props.note.id, props.block == undefined ? '' : props.block.id,  stringToNoteBlock(lines[0].children[0].text))

    if (lines[1] != null || lines[1] != undefined || lines[1].children[0].text.length > 1) {
      insertBlock(props.note.id, props.blockIndex == undefined ? 1000 : props.blockIndex + 1,  stringToNoteBlock(lines[1].children[0].text))
    }

    editorState.current = {} as Descendant[]

    //concat line[0] & line[1] avec des \n
    //suprimer line[1] ou juste mettre line[0] dans editorState.current
    // comme ca on a plus de line[1] & on insert plus
  }

  const insertBlock = (notedId: string, index: number | undefined, block: V1Block) => {
    console.log('--INSERT')
    insertBlockMutation.mutate({
      noteId: notedId,
      body: { 
        index: index, 
        block: block 
      } as NotesAPIInsertBlockRequest
    })
  }

  const updateBlock = (notedId: string, blockId: string | undefined, block: V1Block) => {
    console.log('--UPDATE')
    updateBlockMutation.mutate({
      noteId:  notedId,
      blockId: blockId == undefined ? '' : blockId,
      body: block
    })
  }

  const deleteBlock = () => {
    if (props.block == undefined)
      return
    console.log('--DELETE')
    deleteBlockMutation.mutate({
      noteId: props.note.id,
      blockId: props.block.id,
    })
  }

  //const debouncedFunction = React.useMemo(() => debounce(props.hasBlocks ? updateBlockFromSlateValue : insertBlockFromSlateValue, 5), [])

  /*
  const handleEnter = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lines = editorState.current as any
    const { selection } = editor

    if (selection == null)
      return

    const cursorRowPosition = selection.focus.path[0]
    const cursorColumnPosition = selection.focus.offset.toString()

    let contentBeforeEnter = ''
    let contentAfterEnter = ''

    for (let i = 0; i < lines.length;++i) {
      for (let j = 0; j < lines[i].children[0].text.length; ++j) {
        if (cursorRowPosition <= i && cursorColumnPosition <= j)
          contentAfterEnter += lines[i].children[0].text[j]
        else
          contentBeforeEnter += lines[i].children[0].text[j]
      }
    }

    updateBlock(props.note.id, props.block == undefined ? '' : props.block.id,  stringToNoteBlock(contentBeforeEnter))
    insertBlock(props.note.id, props.blockIndex == undefined ? 1000 : props.blockIndex + 1,  stringToNoteBlock(contentAfterEnter))
  }
  */

  const handleEditorChange = (value: Descendant[]) => {
    editorState.current = value
    console.log(editorState.current)
    
    //Gerer plus tard
    // si Shift & Enter sont pressé, editor.current = "1234\n5678"

    if (editor.operations.some(op => 'set_selection' !== op.type)) {
      updateBlockFromSlateValue(value)
    }
  }

  const handleBackspace = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const element = editorState.current[0] as any

    //console.log(editorState.current)
    console.log(element.children[0].text.length)
    if (element.children[0].text.length < 1) {
      deleteBlock()
      //return (<div>No block here<div/>)
    }
  }

  const handleHover = () => {
    if (props.block != undefined) {
      blockContext.changeBlock(props.block.id)
    }
  }

  return (
    <div 
      //className='rounded-md bg-transparent bg-gradient-to-br p-4' // none hover
      //className='rounded-md bg-transparent bg-gradient-to-br p-4 hover:border-gray-100 hover:bg-gray-100 hover:shadow-inner' // block on hover
      className='rounded-md border-gray-100 bg-gray-100 bg-gradient-to-br p-4 shadow-inner' // just blocks
      onMouseEnter={handleHover}>
      <Slate
        // onChange={props.block == undefined ? insertBlock : updateBlockFromSlateValue}
        onChange={handleEditorChange}
        editor={editor}
        value={initialEditorState}>
        <Editable
          onKeyDown= { event => { 
            if (event.key == 'Backspace') handleBackspace() 
            //if (event.key == 'Enter') handleEnter() 
          }}
          readOnly={authContext.accountId !== props.note.authorAccountId}
          renderElement={renderElement} />
      </Slate>
    </div>
  )
}

const NoteViewEditor: React.FC<{ note: V1Note }> = props => {

  //const [blocks, setBlocks] = React.useState<string[]>(noteBlockstoStringArray(props.note?.blocks))
  const [blocks, setBlocks] = React.useState<V1Block[]>( props.note?.blocks ?? [])

  console.log(blocks)

  return (
    <div>
      {
        props.note.blocks?.length == 0 ?
        
          <BlockEditorItem key={`block-item-${0}`}
            note={props.note}
            block={undefined}
            blockIndex={undefined}
            localBlocks={blocks}
            localSetBlocks={setBlocks}
          />

          :
          props.note.blocks?.map((block, index) => (
            <BlockEditorItem key={`block-item-${index}`}
              note={props.note}
              block={block}
              blockIndex={index}
              localBlocks={blocks}
              localSetBlocks={setBlocks}
            />
          ))
      }
    </div>
  )
}

export default NoteViewEditor