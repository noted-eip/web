import React, { useCallback } from 'react'
import { BaseEditor, createEditor,Descendant,Editor,Transforms } from 'slate'
import { Editable, ReactEditor, RenderElementProps, Slate,withReact } from 'slate-react'

import { useAuthContext } from '../../contexts/auth'
import { useBlockContext } from '../../contexts/block'
import { useDeleteBlockInCurrentGroup, useInsertBlockInCurrentGroup, useUpdateBlockInCurrentGroup } from '../../hooks/api/notes'
import {stringToNoteBlock } from '../../lib/editor'
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
      //console.log(props.children[0].props.text)
      return <p className='py-1 text-sm text-slate-800 first:pt-0' {...props.attributes}>{props.children}</p>
    default:
      //console.log(props.children[0].props.text)
      return <p className='py-1 text-sm text-slate-800 first:pt-0' {...props.attributes}>{props.children}</p>
  }
}

/*let localBlocks : V1Block[] = []

let hasInit: bool = false

const singletonSetLocalBlocks = (newBlocks: V1Block[]) => {
  if (!hasInit) {
    null
  } else {
    localBlocks = newBlocks
  }
}*/

const BlockEditorItem: React.FC<{ note: V1Note, block?: V1Block, blockIndex: number, localBlocks: V1Block[], setLocalBlocks: React.Dispatch<React.SetStateAction<V1Block[]>> }> = props => {
  if (props.block == undefined)
    return <div/>

  const authContext = useAuthContext()
  const blockContext = useBlockContext()

  const initialEditorState = [{ type: 'TYPE_PARAGRAPH', children: [{ text: props.block.paragraph ?? '' }] } as Descendant]

  const editorState = React.useRef<Descendant[]>(initialEditorState)
  const renderElement = React.useCallback(props => <EditorElement {...props} />, [])
  
  //const editor = React.useMemo(() => withShortcuts(withReact(withHistory(createEditor()))), [])
  const editorRef = React.useRef<BaseEditor & ReactEditor>(withReact(createEditor()))
  const editor = editorRef.current

  const insertBlockMutation = useInsertBlockInCurrentGroup()
  const updateBlockMutation = useUpdateBlockInCurrentGroup()
  const deleteBlockMutation = useDeleteBlockInCurrentGroup()
  
  //editor.children = [{ type: 'TYPE_PARAGRAPH', children: [{ text: props.localBlocks[props.blockIndex == undefined ? 0 : props.blockIndex].paragraph }] }]
  editorState.current = [{ type: 'TYPE_PARAGRAPH', children: [{ text: props.block?.paragraph ?? '' }] }]

  const firstBlockPath = [0, 0] // Adjust based on your structure
  if (Editor.hasPath(editor, firstBlockPath)) {
    Transforms.setNodes(editor, { text: props.block?.paragraph ?? '' }, { at: [0, 0] })
    //if (props.blockIndex != 0) {
    //  console.log(props.blockIndex)
    //  Transforms.select(editorRef.current, {path: [0, 0], offset: 0})
    //}
  }

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

        //props.setLocalBlocks((prevLocalBlocks) => [...prevLocalBlocks, newLocalBlock])
        props.setLocalBlocks((prevLocalBlocks) => {
          const newBlocks = [...prevLocalBlocks]
          newBlocks.splice(props.blockIndex + 1, 0, newLocalBlock)
          return newBlocks
        })
        
        //editor.children = [{ type: 'TYPE_PARAGRAPH', children: [{ text: lines[0]?.children[0]?.text ?? '' }] }]
        editorState.current = [{ type: 'TYPE_PARAGRAPH', children: [{ text: lines[0]?.children[0]?.text ?? '' }] }]
        const secondBlockPath = [1]
        Transforms.removeNodes(editor, { at: secondBlockPath })


      } else {
        //editor.children = [{ type: 'TYPE_PARAGRAPH', children: [{ text: lines[0]?.children[0]?.text ?? '' }] }]
        editorState.current = [{ type: 'TYPE_PARAGRAPH', children: [{ text: lines[0]?.children[0]?.text ?? '' }] }]
        
        const firstBlockPath = [0, 0] // Adjust based on your structure
        if (Editor.hasPath(editor, firstBlockPath)) {
          Transforms.setNodes(editor, { text: props.block?.paragraph ?? '' }, { at: [0, 0] })
        }
        
        props.setLocalBlocks((prevLocalBlocks) => [...prevLocalBlocks])
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
    //Gerer plus tard
    // si Shift & Enter sont pressé, editor.current = "1234\n5678"
    if (editor.operations.some(op => 'set_selection' !== op.type)) {
      updateBlockFromSlateValue(value)
    }
  }

  const handleBackspace = () => {
    const element = editorState.current[0] as any

    if (element.children[0].text.length < 1) {
      props.setLocalBlocks((prevLocalBlocks) => {
        //return [
        //  ...prevLocalBlocks.slice(0, props.blockIndex),
        //  ...prevLocalBlocks.slice(props.blockIndex + 1)
        //]
        const newBlocks = [...prevLocalBlocks]
        delete newBlocks[props.blockIndex]
        return newBlocks
      })
      
      deleteBlock()
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
        value={editorState.current}>
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

const NoteViewEditor: React.FC<{ note: V1Note }> = props => {
  const [localBlocks, setLocalBlocks] = React.useState<V1Block[]>( props.note?.blocks ?? [])

  React.useEffect(() => {
    setLocalBlocks((prevLocalBlocks) => prevLocalBlocks ?? [])
  }, [localBlocks])

  //console.log('localBlocks papa'); console.log(localBlocks)

  return (
    <div>
      {
        localBlocks?.map((block, index) => (
          <BlockEditorItem key={`block-item-${index}`}
            note={props.note}
            block={block}
            blockIndex={index}
            localBlocks={localBlocks}
            setLocalBlocks={setLocalBlocks}
          />
        ))
      }
    </div>
  )
}

export default NoteViewEditor