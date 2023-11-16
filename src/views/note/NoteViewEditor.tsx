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

/*let localBlocks : V1Block[] = []

let hasInit: bool = false

const singletonSetLocalBlocks = (newBlocks: V1Block[]) => {
  if (!hasInit) {
    null
  } else {
    localBlocks = newBlocks
  }
}*/

const BlockEditorItem: React.FC<{ note: V1Note, block?: V1Block, blockIndex: number, localBlocks: V1Block[], setLocalBlocks: any }> = props => {
  const authContext = useAuthContext()
  const blockContext = useBlockContext()
  const initialEditorState = noteBlocksToSlateElements(
    [props.localBlocks[props.blockIndex == undefined ? 0 : props.blockIndex]]
  )
  const editorState = React.useRef<Descendant[]>(initialEditorState)
  const renderElement = React.useCallback(props => <EditorElement {...props} />, [])
  const editor = React.useMemo(() => withShortcuts(withReact(withHistory(createEditor()))), [])
  
  const insertBlockMutation = useInsertBlockInCurrentGroup()
  const updateBlockMutation = useUpdateBlockInCurrentGroup()
  const deleteBlockMutation = useDeleteBlockInCurrentGroup()

  const updateBlockFromSlateValue = async (value: Descendant[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lines = value as any
    editorState.current = value

    console.log('BLOCK INDEX = ' + props.blockIndex)

    // CHAT GPT
    const setLocalBlocksAsync = async (updateFunction: (prevBlocks: V1Block[]) => Promise<V1Block[]>) => {
      const newBlocks = await updateFunction(props.localBlocks)
      props.setLocalBlocks(newBlocks)
    }

    setLocalBlocksAsync(async (prevLocalBlocks: V1Block[]) => {
      const newLocalBlocks = [...prevLocalBlocks]
      newLocalBlocks[props.blockIndex].paragraph = lines[0].children[0].text
      updateBlock(props.note.id, props.block?.id, stringToNoteBlock(lines[0].children[0].text))

      if (lines[1] != null || lines[1] != undefined) {
        const newBlockId = await insertBlock(props.note.id, props.blockIndex == undefined ? 1000 : props.blockIndex + 1, stringToNoteBlock(lines[1].children[0].text))

        const newLocalBlock = { id: await newBlockId, type: 'TYPE_PARAGRAPH', paragraph: lines[1].children[0].text } as V1Block

        console.log('local blocks')
        console.log(newLocalBlocks)
        newLocalBlocks.push(newLocalBlock)
        console.log('new local blocks')
        console.log(newLocalBlocks)

        editor.children = [{ type: 'paragraph', children: [{ text: lines[0].children[0].text }] }]

        return newLocalBlocks
        // quand on update le premier editor ca suprrime le dernier
      }

      return newLocalBlocks
    })
    // !CHAT GPT
    
    /*props.localBlocks[props.blockIndex].paragraph = lines[0].children[0].text
    updateBlock(props.note.id, props.block == undefined ? '' : props.block.id,  stringToNoteBlock(lines[0].children[0].text))
    props.setLocalBlocks(props.localBlocks)

    if (lines[1] != null || lines[1] != undefined) {

      const newBlockId = insertBlock(props.note.id, props.blockIndex == undefined ? 1000 : props.blockIndex + 1,  stringToNoteBlock(lines[1].children[0].text))

      const newLocalBlock = { id: await newBlockId, type: 'TYPE_PARAGRAPH', paragraph: lines[1].children[0].text } as V1Block
      
      console.log('local blocks');console.log(props.localBlocks)
      props.localBlocks.push(newLocalBlock)
      console.log('new local blocks');console.log(props.localBlocks)
      
      editor.children = [
        { type: 'paragraph', children: [{ text: lines[0].children[0].text }] },
      ]

      props.setLocalBlocks(props.localBlocks)
      
      // props.localBlocks.some(async element => {
      //   if (element.id == await newBlockId)
      //     return
      //   props.setLocalBlocks(props.localBlocks)
      //   return
      // })
    }*/
  }

  const insertBlock = async (notedId: string, index: number | undefined, block: V1Block) => {
    console.log('----INSERT')
    const res = await insertBlockMutation.mutateAsync({
      noteId: notedId,
      body: { 
        index: index, 
        block: block 
      } as NotesAPIInsertBlockRequest
    })
    console.log(res.block.id)
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

const NoteViewEditor: React.FC<{ note: V1Note }> = props => {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [localBlocks, setLocalBlocks] = React.useState<V1Block[]>( props.note?.blocks ?? [])

  //localBlocks = props.note.blocks == undefined ? {} as V1Block[] : props.note.blocks

  console.log('IN PARENT - LocalBlocks')
  console.log(localBlocks)
  console.log(localBlocks.length)

  // Utilisez useEffect pour redessiner le composant lorsque localBlocks change
  React.useEffect(() => {
    setLocalBlocks(props.note?.blocks ?? [])
  }, [props.note?.blocks])
  
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