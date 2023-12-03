import React, { useCallback } from 'react'
import { createEditor,Descendant,Editor } from 'slate'
import { withHistory } from 'slate-history'
import { Editable, RenderElementProps, Slate,withReact } from 'slate-react'

import { useAuthContext } from '../../contexts/auth'
import { useInsertBlockInCurrentGroup,useUpdateBlockInCurrentGroup } from '../../hooks/api/notes'
import {noteBlocksToSlateElements,stringToNoteBlock,withShortcuts } from '../../lib/editor'
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


const NoteEditor: React.FC<{ note: V1Note, localBlocks: V1Block[], setLocalBlocks: React.Dispatch<React.SetStateAction<V1Block[]>> }> = props => {
  const authContext = useAuthContext()

  const initialEditorState = noteBlocksToSlateElements(props.note?.blocks ?? [] as V1Block[])
  const editorState = React.useRef<Descendant[]>(initialEditorState)
  const renderElement = React.useCallback(props => <EditorElement {...props} />, [])
  const editor = React.useMemo(() => withShortcuts(withReact(withHistory(createEditor()))), [])

  const insertBlockMutation = useInsertBlockInCurrentGroup()
  const updateBlockMutation = useUpdateBlockInCurrentGroup()
  //const deleteBlockMutation = useDeleteBlockInCurrentGroup()

  const insertBlock = async (notedId: string, index: number | undefined, block: V1Block) => {
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

  const updateBlock = (notedId: string, blockId: string | undefined, block: V1Block) => {
    console.log('----UPDATE')
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

  const updateNoteBlocksFromSlateValue = useCallback(
    async (value: Descendant[]) => {
      const lines = value as any
      const currentBlockIndex = getLineFromCursorPath(getCurrentCursorPath(editor))

      const updateBlockContent = lines[currentBlockIndex].children[0].text
      
      props.setLocalBlocks((prevLocalBlocks) => {
        const newBlocks = [...prevLocalBlocks]
        if (newBlocks[currentBlockIndex] != undefined) {
          console.log('(1)=====LINES = '); console.log(lines)
          console.log('=> Update block idx: ' + currentBlockIndex + '  with : ', updateBlockContent)
          newBlocks[currentBlockIndex].paragraph = updateBlockContent
          updateBlock(props.note.id, newBlocks[currentBlockIndex].id, stringToNoteBlock(updateBlockContent))
        }
        return newBlocks
      })

    },
    [props]
  )

  const handleEditorChange = (value: Descendant[]) => {
    editorState.current = value
    if (editor.operations.some(op => 'set_selection' !== op.type)) {
      updateNoteBlocksFromSlateValue(value)
    }
  }

  const handleEnter = async () => {
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
    console.log('BEFORE LocalBlocks'); console.log(props.localBlocks)
    
    // @note: BACK - UPDATE BLOCK
    const updatedBlockId = props.localBlocks[cursorLine].id
    const updatedLocalBlock = { id: updatedBlockId, type: 'TYPE_PARAGRAPH', paragraph: contentBeforeEnter } as V1Block
    updateBlock(props.note.id, updatedBlockId, updatedLocalBlock)
    // @note: BACK - INSERT NEW BLOCK
    const insertedBlockId = await insertBlock(props.note.id, cursorLine + 1,  stringToNoteBlock(contentAfterEnter))
    const insertedLocalBlock = { id: await insertedBlockId, type: 'TYPE_PARAGRAPH', paragraph: contentAfterEnter } as V1Block
    // @note: LOCAL
    
    //fill localBlocks content with lines

    props.setLocalBlocks((prevLocalBlocks) => {
      const newBlocks = [...prevLocalBlocks]
      console.log('AFTER LocalBlocks'); console.log(newBlocks)
      newBlocks[cursorLine].paragraph = contentBeforeEnter
      newBlocks.splice(cursorLine + 1, 0, insertedLocalBlock)
      console.log('AFTER LocalBlocks'); console.log(newBlocks)
      
      return newBlocks
    })

  }

  return (
    <div className='rounded-md bg-transparent bg-gradient-to-br p-4'>
      <Slate
        onChange={handleEditorChange}
        editor={editor}
        value={initialEditorState}>
        <Editable
          onKeyDown= { event => { 
            if (event.key == 'Enter') {
              handleEnter()
            }
          }}
          readOnly={authContext.accountId !== props.note.authorAccountId}
          renderElement={renderElement} />
      </Slate>
    </div>
  )
}

/*
const BlockEditorItem: React.FC<{ note: V1Note, block?: V1Block, blockIndex: number, localBlocks: V1Block[], setLocalBlocks: React.Dispatch<React.SetStateAction<V1Block[]>> }> = props => {
  const authContext = useAuthContext()
  const blockContext = useBlockContext()

  const initialEditorState = [{ type: 'TYPE_PARAGRAPH', children: [{ text: props.localBlocks[props.blockIndex].paragraph ?? '' }] } as Descendant]
  const editorState = React.useRef<Descendant[]>(initialEditorState)
  const renderElement = React.useCallback(props => <EditorElement {...props} />, [])
  const editor = React.useMemo(() => withShortcuts(withReact(withHistory(createEditor()))), [])
  
  const insertBlockMutation = useInsertBlockInCurrentGroup()
  const updateBlockMutation = useUpdateBlockInCurrentGroup()
  const deleteBlockMutation = useDeleteBlockInCurrentGroup()
  
  editor.children = [{ type: 'TYPE_PARAGRAPH', children: [{ text: props.localBlocks[props.blockIndex]?.paragraph ?? '' }] }]

  
  const updateBlockFromSlateValue = useCallback(
    async (value: Descendant[]) => {
      const lines = value as any

      const newLocalBlocks = [...props.localBlocks]

      newLocalBlocks[props.blockIndex].paragraph = lines[0]?.children[0]?.text ?? ''
      updateBlock(props.note.id, props.block?.id, stringToNoteBlock(lines[0].children[0].text))

      if (lines[1] != null || lines[1] != undefined) {
        const newBlockContent = lines[1]?.children[0]?.text ?? ''
        const newBlockId = await insertBlock(props.note.id, props.blockIndex == undefined ? 1000 : props.blockIndex + 1, stringToNoteBlock(newBlockContent))
        const newLocalBlock = { id: await newBlockId, type: 'TYPE_PARAGRAPH', paragraph: newBlockContent } as V1Block

        props.setLocalBlocks((prevLocalBlocks) => {
          const newBlocks = [...prevLocalBlocks]
          newBlocks.splice(props.blockIndex + 1, 0, newLocalBlock)
          return newBlocks
        })
        
        editor.children = [{ type: 'TYPE_PARAGRAPH', children: [{ text: lines[0]?.children[0]?.text ?? '' }] }]
      } else {
        props.setLocalBlocks((prevLocalBlocks) => [...prevLocalBlocks])
        editor.children = [{ type: 'TYPE_PARAGRAPH', children: [{ text: lines[0]?.children[0]?.text ?? '' }] }]
      }
    },
    [props]
  )

  const insertBlock = async (notedId: string, index: number | undefined, block: V1Block) => {
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

  const updateBlock = (notedId: string, blockId: string | undefined, block: V1Block) => {
    console.log('----UPDATE')
    updateBlockMutation.mutate({
      noteId:  notedId,
      blockId: blockId == undefined ? '' : blockId,
      body: block
    })
  }

  const deleteBlock = () => {
    console.log('----DELETE')
    if (props.block == undefined)
      return
    deleteBlockMutation.mutate({
      noteId: props.note.id,
      blockId: props.block.id,
    })
  }

  //const handleEnter = () => {
  //  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //  const lines = editorState.current as any
  //  const { selection } = editor
  //  if (selection == null)
  //    return
  //  const cursorRowPosition = selection.focus.path[0]
  //  const cursorColumnPosition = selection.focus.offset.toString()
  //  let contentBeforeEnter = ''
  //  let contentAfterEnter = ''
  //  for (let i = 0; i < lines.length;++i) {
  //    for (let j = 0; j < lines[i].children[0].text.length; ++j) {
  //      if (cursorRowPosition <= i && cursorColumnPosition <= j)
  //        contentAfterEnter += lines[i].children[0].text[j]
  //      else
  //        contentBeforeEnter += lines[i].children[0].text[j]
  //    }
  //  }
  //  updateBlock(props.note.id, props.block == undefined ? '' : props.block.id,  stringToNoteBlock(contentBeforeEnter))
  //  insertBlock(props.note.id, props.blockIndex == undefined ? 1000 : props.blockIndex + 1,  stringToNoteBlock(contentAfterEnter))
  //}

  const handleEditorChange = (value: Descendant[]) => {
    //Gerer plus tard
    // si Shift & Enter sont pressé, editor.current = "1234\n5678"

    if (editor.operations.some(op => 'set_selection' !== op.type)) {
      updateBlockFromSlateValue(value)
    }
  }

  const handleBackspace = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const element = editorState.current[0] as any

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
        onChange={handleEditorChange}
        editor={editor}
        value={initialEditorState}>
        <Editable
          onKeyDown= { event => { 
            if (event.key == 'Backspace') handleBackspace()
          }}
          readOnly={authContext.accountId !== props.note.authorAccountId}
          renderElement={renderElement} />
      </Slate>
    </div>
  )
}
*/

//faire que un seul composant pas de parent et fils
const NoteViewEditor: React.FC<{ note: V1Note }> = props => {
  const [localBlocks, setLocalBlocks] = React.useState<V1Block[]>( props.note?.blocks ?? [])

  React.useEffect(() => {
    setLocalBlocks((prevLocalBlocks) => prevLocalBlocks ?? [])
  }, [localBlocks])

  //console.log('PARENT localBlocks == '); console.log(localBlocks)

  return (
    <div>
      {
        /*localBlocks?.map((block, index) => (
          <BlockEditorItem key={`block-item-${index}`}
            note={props.note}
            block={block}
            blockIndex={index}
            localBlocks={localBlocks}
            setLocalBlocks={setLocalBlocks}
          />
        ))*/
        <NoteEditor
          note={props.note}
          localBlocks={localBlocks}
          setLocalBlocks={setLocalBlocks}
        />
      }
    </div>
  )
}

export default NoteViewEditor