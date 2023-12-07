import React, { useCallback } from 'react'
import { createEditor,Descendant,Editor } from 'slate'
import { withHistory } from 'slate-history'
import { Editable, RenderElementProps, Slate,withReact } from 'slate-react'

import { useAuthContext } from '../../contexts/auth'
import {useInsertBlockInCurrentGroup,useUpdateBlockInCurrentGroup } from '../../hooks/api/notes'
import {noteBlocksToSlateElements,stringToNoteBlock,withShortcuts } from '../../lib/editor'
import {NotesAPIInsertBlockRequest,V1Block, V1Note } from '../../protorepo/openapi/typescript-axios'


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

const NoteViewEditor: React.FC<{ note: V1Note }> = props => {
  const authContext = useAuthContext()

  const initialEditorState = noteBlocksToSlateElements(props.note?.blocks ?? [] as V1Block[])
  const editorState = React.useRef<Descendant[]>(initialEditorState)
  const renderElement = React.useCallback(props => <EditorElement {...props} />, [])
  const editor = React.useMemo(() => withShortcuts(withReact(withHistory(createEditor()))), [])

  const insertBlockMutation = useInsertBlockInCurrentGroup()
  const updateBlockMutation = useUpdateBlockInCurrentGroup()
  //const deleteBlockMutation = useDeleteBlockInCurrentGroup()

  //console.log('OUT FUNCTION LOCALBLOCKS = ');console.log(localBlocks)

  const insertBlock = async (notedId: string, index: number | undefined, block: V1Block) => {
    //console.log('----INSERT')
    const res = await insertBlockMutation.mutateAsync({
      noteId: notedId,
      body: { 
        index: index, 
        block: block 
      } as NotesAPIInsertBlockRequest
    })
    return res.block.id
  }

  const updateBlock = (notedId: string, blockId: string | undefined, block: V1Block) => {
    //console.log('----UPDATE')
    updateBlockMutation.mutate({
      noteId:  notedId,
      blockId: blockId == undefined ? '' : blockId,
      body: block
    })
  }

  const getCurrentCursorPath = (editor) => {
    const { selection } = editor
  
    if (selection) {
      const [start] = Editor.edges(editor, selection)
      const path = start.path
      return path
    }
    return null
  }

  const getLineFromCursorPath = (cursorPath) => {
    if (cursorPath && cursorPath.length > 0) {
      const firstValue = cursorPath[0]
      return firstValue
    }
  
    return null
  }

  const [localBlocks, setLocalBlocks] = React.useState<V1Block[]>( props.note?.blocks ?? [])
  React.useEffect(() => { setLocalBlocks((prevLocalBlocks) => prevLocalBlocks ?? [])}, [localBlocks])

  const updateNoteBlocksFromSlateValue = useCallback(
    async (value: Descendant[]) => {
      const lines = value as any
      const cursorLine = getLineFromCursorPath(getCurrentCursorPath(editor))

      //const insertedBlockId = await insertBlock(props.note.id, cursorLine, stringToNoteBlock(contentInsertBlock))
      setLocalBlocks((prevLocalBlocks) => {
        if (prevLocalBlocks.length < lines.length) {
          console.log('--->Insert New Line & Update Block')
  
          const contentUpdateBlock = lines[cursorLine - 1].children[0].text
          const contentInsertBlock = lines[cursorLine].children[0].text
          const insertedBlockId = await insertBlock(props.note.id, cursorLine, stringToNoteBlock(contentInsertBlock))
          const insertedLocalBlock = { id: insertedBlockId, type: 'TYPE_PARAGRAPH', paragraph: contentInsertBlock } as V1Block
          
          // LOCALBLOCKS doesn't upatde ...
          //setLocalBlocks((prevLocalBlocks) => {
          console.log('LocalBlocks in SetLocalBlocks 1 = '); console.log(prevLocalBlocks)
          const newBlocks = [...prevLocalBlocks]
          newBlocks[cursorLine - 1].paragraph = contentUpdateBlock
          newBlocks.splice(cursorLine, 0, insertedLocalBlock)
          return newBlocks
          //})
  
        } else {
          console.log('--->Update Block')
        
          const updateBlockContent = lines[cursorLine].children[0].text
          //setLocalBlocks((prevLocalBlocks) => {
          console.log('LocalBlocks in SetLocalBlocks 2 = '); console.log(prevLocalBlocks)
          const newBlocks = [...prevLocalBlocks]
          if (newBlocks[cursorLine] != undefined) {
            newBlocks[cursorLine].paragraph = updateBlockContent
            updateBlock(props.note.id, newBlocks[cursorLine].id, stringToNoteBlock(updateBlockContent))
          }
          return newBlocks
          //})
  
        }
      })

      /*if (localBlocks.length < lines.length) {
        console.log('--->Insert New Line & Update Block')

        const contentUpdateBlock = lines[cursorLine - 1].children[0].text
        const contentInsertBlock = lines[cursorLine].children[0].text
        const insertedBlockId = await insertBlock(props.note.id, cursorLine, stringToNoteBlock(contentInsertBlock))
        const insertedLocalBlock = { id: insertedBlockId, type: 'TYPE_PARAGRAPH', paragraph: contentInsertBlock } as V1Block
        
        // LOCALBLOCKS doesn't upatde ...
        setLocalBlocks((prevLocalBlocks) => {
          console.log('LocalBlocks in SetLocalBlocks 1 = '); console.log(prevLocalBlocks)
          const newBlocks = [...prevLocalBlocks]
          newBlocks[cursorLine - 1].paragraph = contentUpdateBlock
          newBlocks.splice(cursorLine, 0, insertedLocalBlock)
          return newBlocks
        })

      } else {
        console.log('--->Update Block')
      
        const updateBlockContent = lines[cursorLine].children[0].text
        setLocalBlocks((prevLocalBlocks) => {
          console.log('LocalBlocks in SetLocalBlocks 2 = '); console.log(prevLocalBlocks)
          const newBlocks = [...prevLocalBlocks]
          if (newBlocks[cursorLine] != undefined) {
            newBlocks[cursorLine].paragraph = updateBlockContent
            updateBlock(props.note.id, newBlocks[cursorLine].id, stringToNoteBlock(updateBlockContent))
          }
          return newBlocks
        })

      }
      */

    },
    [localBlocks, setLocalBlocks]
  )

  const handleEditorChange = (value: Descendant[]) => {
    editorState.current = value
    if (editor.operations.some(op => 'set_selection' !== op.type)) {
      updateNoteBlocksFromSlateValue(value)
    }
  }

  /*const handleEnter = async () => {
    const { selection } = editor
    if (selection == null)
      return
    
    const lines = editorState.current as any
    const cursorLine = getLineFromCursorPath(getCurrentCursorPath(editor))
    
    const contentBeforeEnter = lines[cursorLine].children[0].text.slice(0, selection.focus.offset)
    const contentAfterEnter = lines[cursorLine].children[0].text.slice(selection.focus.offset)
    
    console.log('(2)========LINES = '); console.log(lines)
    console.log('contentBeforeEnter : ', contentBeforeEnter)
    console.log('contentAfterEnter : ', contentAfterEnter)
    console.log('BEFORE LocalBlocks'); console.log(localBlocks)
    
    // @note: BACK - UPDATE BLOCK
    const updatedBlockId = localBlocks[cursorLine].id
    const updatedLocalBlock = { id: updatedBlockId, type: 'TYPE_PARAGRAPH', paragraph: contentBeforeEnter } as V1Block
    updateBlock(props.note.id, updatedBlockId, updatedLocalBlock)
    // @note: BACK - INSERT NEW BLOCK
    const insertedBlockId = await insertBlock(props.note.id, cursorLine + 1,  stringToNoteBlock(contentAfterEnter))
    const insertedLocalBlock = { id: await insertedBlockId, type: 'TYPE_PARAGRAPH', paragraph: contentAfterEnter } as V1Block
    // @note: LOCAL
    
    //fill localBlocks content with lines

    setLocalBlocks((prevLocalBlocks) => {
      const newBlocks = [...prevLocalBlocks]
      console.log('AFTER LocalBlocks'); console.log(newBlocks)
      newBlocks[cursorLine].paragraph = contentBeforeEnter
      newBlocks.splice(cursorLine + 1, 0, insertedLocalBlock)
      console.log('AFTER LocalBlocks'); console.log(newBlocks)
      
      return newBlocks
    })
  }*/

  return (
    <div className='rounded-md bg-transparent bg-gradient-to-br p-4'>
      <Slate
        onChange={handleEditorChange}
        editor={editor}
        value={initialEditorState}>
        <Editable
          /*onKeyDown= { event => { 
            if (event.key == 'Enter') {
              handleEnter()
            }
          }}*/
          readOnly={authContext.accountId !== props.note.authorAccountId}
          renderElement={renderElement} />
      </Slate>
    </div>
  )
}

export default NoteViewEditor