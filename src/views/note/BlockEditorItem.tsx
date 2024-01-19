import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline'
import { Bars3Icon } from '@heroicons/react/24/outline'
import React from 'react'
import { createEditor, Descendant, Editor, Transforms } from 'slate'
import { withHistory } from 'slate-history'
import {
  ReactEditor,
  Slate,
  withReact} from 'slate-react'

import { useBlockContext } from '../../contexts/block'
import { useGroupContext } from '../../contexts/group'
import { useNoteContext } from '../../contexts/note'
import { BlockContext } from '../../contexts/note'
import { useGetGroup } from '../../hooks/api/groups'
import {
  useUpdateBlockInCurrentGroup
} from '../../hooks/api/notes'
import {
  blockContextToNoteBlockAPI,
  blockContextToSlateElements, 
  defaultSlateText,
  SlateText,
  withShortcuts 
} from '../../lib/editor'
import {
  V1Block,
  V1Note
} from '../../protorepo/openapi/typescript-axios'
import {EditableNoted} from './EditableNoted'

export const BlockEditorItem: React.FC<{
  note: V1Note
  block: BlockContext
  blockIndex: number
}> = ({ note, block, blockIndex }) => {
  if (block == undefined) return <div/>
  const groupContext = useGroupContext()
  const getGroupQ = useGetGroup({ groupId: groupContext.groupId as string })
  const [isHovered, setIsHovered] =  React.useState(false)

  const blockContext = useBlockContext()
  const updateBlockMutation = useUpdateBlockInCurrentGroup()
  const { blocks } = useNoteContext()

  const initialEditorState = blockContextToSlateElements(blocks[block.index])
  const editorState = React.useRef<Descendant[]>(initialEditorState)
  editorState.current = initialEditorState
  const editor =  React.useMemo(() => withShortcuts(withReact(withHistory(createEditor()))), [])

  if (!Editor.hasPath(editor, [0, 0])) {
    Transforms.insertNodes (
      editor,
      { type: 'TYPE_PARAGRAPH', children: defaultSlateText },
      { at: [0] }
    )
    editor.history = { undos: [], redos: [] }
  }

  React.useEffect(() => 
  {
    blocks.forEach((currentBlock) => {
      if (currentBlock != undefined)
      {
        if (currentBlock.isFocused && block?.index == currentBlock.index)
        {
          ReactEditor.focus(editor)
          Transforms.select(editor, Editor.end(editor, []))
        }
      }
    })
    // @todo: peut être enlever blocks de [] pour la perf
  }, [editor, blocks])


  const updateBlockFromSlateValue =  React.useCallback((value: Descendant[]) => 
  {
    editorState.current = value

    // Convert editor childrens to context children
    const lines = editorState.current as any
    if (lines[0]?.children === undefined) return

    const childrens: SlateText[] = []
    
    for (let i = 0; i < lines.length; ++i) {
      for (let j = 0; j < lines[i].children.length; ++j) {
        let text = ''
        text += lines[i].children[j]?.text ?? ''
        if (i < lines.length - 1) {
          text += '\n'
        }
        const children = {
          text: text, 
          bold: lines[i].children[j]?.bold ?? {state: false},
          italic: lines[i].children[j]?.italic ?? {state: false},
          underline: lines[i].children[j]?.underline ?? {state: false},
          color: lines[i].children[j]?.color ?? {state: false},
          bgColor: lines[i].children[j]?.bgColor ?? {state: false},
        } as SlateText
      
        childrens.push(children)
      }
    }

    const newBlock: BlockContext = {
      id: block.id, 
      type: (editorState.current[0] as any)?.type ?? 'TYPE_PARAGRAPH',
      children: childrens,
      index: block.index, 
      isFocused: block.isFocused
    }

    updateBlockBackend(note.id, block?.id, blockContextToNoteBlockAPI(newBlock))
    blocks[blockIndex] = newBlock
  
  }, [blocks])
  
  const updateBlockBackend = (
    noteId: string,
    blockId: string | undefined,
    block: V1Block
  ) => {
    updateBlockMutation.mutate({
      noteId: noteId,
      blockId: blockId == undefined ? '' : blockId,
      body: block
    })
  }
  
  const handleEditorChange = (value: Descendant[]) => {
    if (editor.operations.some(op => 'set_selection' !== op.type)) {
      updateBlockFromSlateValue(value)
      setIsHovered(false)
    }
  }
  
  const handleHover = () => {
    setIsHovered(true)
    if (block != undefined) {
      blockContext.changeBlock(block.id)
    }
  }

  const handleLeave = () => {
    setIsHovered(false)
  }

  return (
    <div
      className={`mx-xl flex max-w-screen-xl items-center justify-between rounded-md ${isHovered ? 'border-gray-50 bg-gray-50 bg-gradient-to-br shadow-inner' : ''} overflow-x-hidden`}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
    >
      <div className='h-6 w-8 px-2'>
        {isHovered && getGroupQ.isSuccess && getGroupQ.data?.group?.name !== 'My Workspace' ? (
          <Bars3Icon className='h-6 w-6 text-gray-400' />
        ) : (
          <div className='flex h-6 w-6 items-center justify-center'></div>
        )}
      </div>
      <div className='grow rounded-md bg-transparent p-4' style={{ maxWidth: 'full', overflowX: 'hidden' }}>
        <Slate
          onChange={handleEditorChange}
          editor={editor}
          value={editorState.current}
        >
          <EditableNoted
            block={block}
            note={note}
            editor={editor}
            blockIndex={blockIndex}
            editorState={editorState.current}
          />
        </Slate>
      </div>
      <div className='h-6 w-8'>
        {isHovered && getGroupQ.isSuccess && getGroupQ.data?.group?.name !== 'My Workspace' ? (
          <ChatBubbleOvalLeftEllipsisIcon className='h-6 w-6 text-gray-400' />
        ) : (
          <div className='flex h-6 w-6 items-center justify-center'></div>
        )}
        <div className='h-2 w-8 px-2'/>
      </div>
    </div>
  )
}
