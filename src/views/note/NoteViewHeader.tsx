import React from 'react'
import { createEditor,Descendant } from 'slate'
import { Editable, RenderElementProps, Slate, withReact } from 'slate-react'
import { useDebounce } from 'usehooks-ts'

import EditorTitleElement from '../../components/editor/EditorTitleElement'
import { useGetNoteInCurrentGroup, useUpdateNoteInCurrentGroup } from '../../hooks/api/notes'
import { useNoteIdFromUrl } from '../../hooks/url'
import { ColorStyle, defaultBgColor, defaultTextColor, NoteTitleElement, TextStyle } from '../../lib/editor'
import { V1Note } from '../../protorepo/openapi/typescript-axios'

const renderElement = (props: RenderElementProps) => {
  return <EditorTitleElement {...props} />
}

const NoteViewHeader: React.FC = () => {
  const noteId = useNoteIdFromUrl()
  const noteQ = useGetNoteInCurrentGroup({ noteId })
  const updateNoteQ = useUpdateNoteInCurrentGroup()
  const [editor] =  React.useState(() => withReact(createEditor()))
  const [title, setTitle] =  React.useState<string | undefined>(noteQ.data?.note.title)
  const debouncedTitle = useDebounce<string | undefined>(title, 1000)

  React.useEffect(() => {
    if (debouncedTitle && debouncedTitle !== noteQ.data?.note.title) {
      updateNoteTitle(debouncedTitle)
    }
  }, [debouncedTitle])

  const updateNoteTitle = (title: string) => {
    updateNoteQ.mutate({noteId, body: {title} as V1Note})
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      event.stopPropagation()
      if (title) {
        updateNoteTitle(title)
      }
    }
  }

  const handleChange = (value: Descendant[]) => {
    if (editor.operations.some(op => 'set_selection' !== op.type)) {
      const newTitle = (value[0] as unknown as NoteTitleElement).children[0].text
      setTitle(newTitle)
    }
  }

  return <div className='flex items-center justify-center'>
    <div className='mr-2 flex h-8 w-8 items-center justify-center rounded-md bg-gray-100'>📝</div>
    {noteQ.data ?
      <Slate
        editor={editor}
        onChange={handleChange}
        value={[
          {
            type: 'TYPE_PARAGRAPH',
            children: [
              { 
                text: noteQ.data.note.title, 
                bold: { state: false } as TextStyle, 
                italic: { state: false } as TextStyle, 
                underline: { state: false } as TextStyle, 
                color: { color: defaultTextColor } as ColorStyle, 
                bgColor: { color: defaultBgColor } as ColorStyle 
              }]
          },
        ]} >
        <Editable
          renderElement={renderElement}
          onKeyDown={handleKeyDown} />
      </Slate>
      :
      <div className='skeleton h-4 w-32' />
    }
  </div>
}

export default NoteViewHeader
