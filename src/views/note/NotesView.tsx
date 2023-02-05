import {
  CodeBracketIcon,
  DocumentTextIcon,
  PencilIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline'
import React from 'react'
import ViewSkeleton from '../../components/view/ViewSkeleton'
import { useGetNote, useInsertBlock } from '../../hooks/api/notes'
import { Block } from '../../types/api/notes'

const NoteViewBlockItem: React.FC<{ block: Block }> = () => {
  return (
    <div
      className='rounded-md border border-gray-100 bg-gray-50 p-2 focus:bg-gray-50 focus:outline-none'
      contentEditable
    ></div>
  )
}

const NoteView: React.FC = () => {
  const noteId = location.pathname.split('/')[4]
  const noteQ = useGetNote(
    { note_id: noteId },
    {
      onSuccess: (data) => {
        setEndOfNote(data.data.note.blocks?.length || 0)
      },
    }
  )
  const insertBlockQ = useInsertBlock()
  const [endOfNote, setEndOfNote] = React.useState(0)

  const addBlockButtonTemplates = [
    { icon: DocumentTextIcon, name: 'Paragraph', type: 'TYPE_PARAGRAPH' },
    { icon: PencilIcon, name: 'Heading 1', type: 'TYPE_HEADING1' },
    { icon: PencilIcon, name: 'Heading 2', type: 'TYPE_HEADING2' },
    { icon: PencilIcon, name: 'Heading 3', type: 'TYPE_HEADING3' },
    { icon: CodeBracketIcon, name: 'Code', type: 'TYPE_CODE' },
    { icon: PhotoIcon, name: 'Image', type: 'TYPE_IMAGE' },
  ]

  return (
    <ViewSkeleton
      title={noteQ.data?.data.note.title || ''}
      panels={['note-recommendations', 'group-chat']}
    >
      <div className='mx-lg mb-lg grid h-0 w-full grid-cols-1 gap-4 xl:mx-xl xl:mb-xl'>
        {noteQ.isSuccess ? (
          noteQ.data.data.note.blocks?.map((block, idx) => (
            <NoteViewBlockItem
              key={`note-view-note-block-${idx}-${block.id}`}
              block={block}
            />
          ))
        ) : (
          <React.Fragment>
            <div className='skeleton h-8 w-full' />
            <div className='skeleton h-16 w-full' />
            <div className='skeleton h-12 w-full' />
          </React.Fragment>
        )}

        <div className='mt-2 grid grid-cols-6 gap-2'>
          {addBlockButtonTemplates.map((el, idx) => {
            return (
              <div
                key={`notes-view-add-block-button-${idx}`}
                className='flex cursor-pointer items-center justify-center rounded border border-gray-200 p-1 text-sm text-gray-700'
                onClick={() => {
                  insertBlockQ.mutate({
                    index: endOfNote,
                    note_id: noteId,
                    block: {
                      type: 'TYPE_PARAGRAPH',
                      paragraph: '',
                    },
                  })
                }}
              >
                {el.name}
                <el.icon className='ml-2 h-4 w-4 stroke-2 text-gray-700' />
              </div>
            )
          })}
        </div>
      </div>
    </ViewSkeleton>
  )
}

export default NoteView
