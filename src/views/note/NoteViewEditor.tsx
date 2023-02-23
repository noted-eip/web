import React from 'react'
import { createEditor, Descendant } from 'slate'
import { withHistory } from 'slate-history'
import { Editable, RenderElementProps, Slate, withReact } from 'slate-react'
import { useGetNoteInCurrentGroup } from '../../hooks/api/notes'
import { useNoteIdFromUrl } from '../../hooks/url'
import { noteBlocksToSlateElements, withShortcuts } from '../../lib/editor'
import { V1Block } from '../../protorepo/openapi/typescript-axios'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Element: React.FC<RenderElementProps> = props => {
  switch (props.element.type) {
    case 'TYPE_HEADING_1':
      return <h1 onChange={(e) => console.log(e)} className='pt-4 pb-2 text-2xl font-medium text-gray-800' {...props.attributes}>{props.children}</h1>
    case 'TYPE_HEADING_2':
      return <h2 className='pt-3 pb-2 text-xl font-medium text-gray-800' {...props.attributes}>{props.children}</h2>
    case 'TYPE_HEADING_3':
      return <h3 className='py-2 text-lg font-medium normal-case text-gray-800' {...props.attributes}>{props.children}</h3>
    case 'TYPE_BULLET_LIST':
      return <ul className='list-inside list-disc py-1 text-sm' {...props.attributes}>{props.children}</ul>
    case 'TYPE_NUMBER_LIST':
      return <ul className='list-inside list-decimal py-1 text-sm' {...props.attributes}>{props.children}</ul>
    case 'TYPE_LIST_ITEM':
      return <li className='py-1 px-2 text-sm' {...props.attributes}>{props.children}</li>
    default:
      return <p className='py-1 text-sm text-slate-800' {...props.attributes}>{props.children}</p>
  }
}

const NoteViewEditor: React.FC = () => {
  const noteId = useNoteIdFromUrl()
  const noteQuery = useGetNoteInCurrentGroup({ noteId })

  const renderElement = React.useCallback(props => <Element {...props} />, [])
  const editor = React.useMemo(() => withShortcuts(withReact(withHistory(createEditor()))), [])

  if (!noteQuery.data && noteQuery.isLoading) {
    return <div className='m-lg grid gap-2 opacity-50 xl:m-xl'>
      <div className='skeleton mb-2 h-6 w-96' />
      <div className='skeleton h-4 w-full' />
      <div className='skeleton h-4 w-full' />
      <div className='skeleton h-4 w-full' />
      <div className='skeleton h-4 w-2/3 ' />
      <div className='skeleton mb-2 mt-6 h-6 w-96' />
      <div className='skeleton h-4 w-full' />
      <div className='skeleton h-32 w-full opacity-50' />
    </div>
  }

  const handleEditorChange = (value: Descendant[]) => {
    if (editor.operations.some(op => 'set_selection' !== op.type)) {
      console.log(value)
    }
  }

  return <div>
    <Slate
      onChange={handleEditorChange}
      editor={editor}
      value={noteBlocksToSlateElements(noteQuery.data?.note.blocks?.length ? noteQuery.data?.note.blocks : [{type: 'TYPE_PARAGRAPH', paragraph: ''} as V1Block])}>
      <Editable
        autoFocus
        className='m-lg min-h-[256px] px-1 xl:mx-xl'
        renderElement={renderElement} />
    </Slate>
  </div>
}

export default NoteViewEditor
