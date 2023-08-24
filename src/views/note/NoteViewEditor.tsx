import debounce from 'lodash.debounce'
import React from 'react'
import { createEditor,Descendant } from 'slate'
import { withHistory } from 'slate-history'
import { Editable, RenderElementProps, Slate, withReact } from 'slate-react'

import { useAuthContext } from '../../contexts/auth'
import { useUpdateNoteInCurrentGroup } from '../../hooks/api/notes'
import { blockArraysAreEqual, noteBlocksToSlateElements, slateElementsToNoteBlocks, withShortcuts } from '../../lib/editor'
import { V1Block, V1Note } from '../../protorepo/openapi/typescript-axios'

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
  const initialEditorState = noteBlocksToSlateElements(props.note.blocks?.length ? props.note.blocks : [{ type: 'TYPE_PARAGRAPH', paragraph: '' } as V1Block])
  const editorState = React.useRef<Descendant[]>(initialEditorState)
  const renderElement = React.useCallback(props => <EditorElement {...props} />, [])
  const editor = React.useMemo(() => withShortcuts(withReact(withHistory(createEditor()))), [])
  const updateNoteMutation = useUpdateNoteInCurrentGroup()

  const handleEditorChange = (value: Descendant[]) => {
    if (editor.operations.some(op => 'set_selection' !== op.type)) {
      editorState.current = value
      debouncedUpdateNoteBlocks()
    }
  }

  const updateNoteBlocks = () => {
    const latestState = slateElementsToNoteBlocks(editorState.current)
    
    // @note: No changes on lastest blocks and actuals
    if (blockArraysAreEqual(latestState, props.note.blocks || [])) return

    updateNoteMutation.mutate({
      noteId: props.note.id,
      body: { blocks: latestState } as V1Note
    })
  }

  const debouncedUpdateNoteBlocks = React.useMemo(() => debounce(updateNoteBlocks, 5), [])

  return (
    <div 
      className='cursor-pointer rounded-md bg-transparent bg-gradient-to-br p-4 hover:border-gray-100 hover:bg-gray-100 hover:shadow-inner'>
      
      <Slate
        onChange={handleEditorChange}
        editor={editor}
        value={initialEditorState}>
        <Editable
          readOnly={authContext.accountId !== props.note.authorAccountId}
          className='m-lg min-h-[256px] px-1 xl:mx-xl'
          renderElement={renderElement} />
      </Slate>
    
    </div>
  )
}

export default NoteViewEditor
