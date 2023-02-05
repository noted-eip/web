import { PencilIcon, FolderIcon } from '@heroicons/react/24/solid'
import React from 'react'
import { useGroupContext } from '../../contexts/group'
import { useGetGroup } from '../../hooks/api/groups'
import GroupViewMenu from './GroupViewMenu'
import { useAuthContext } from '../../contexts/auth'
import { useNavigate } from 'react-router-dom'
import { useCreateNote, useListNotes } from '../../hooks/api/notes'
import { Note } from '../../types/api/notes'
import { useGetAccount } from '../../hooks/api/accounts'

const NotesListGridItem: React.FC<{ note: Note }> = (props) => {
  const authorQ = useGetAccount({accountId: props.note.author_id})
  const navigate = useNavigate()

  return (
    <div
      className='flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-md bg-gray-50 p-2 transition-all hover:bg-gray-100 hover:shadow-inner'
      onClick={() => navigate(`./note/${props.note.id}`)}
    >
      <div className='mb-2 h-2/3 w-1/2 rounded-md bg-white shadow-md' />
      <div className='w-full text-center'>
        <div className='text-xs font-medium text-gray-800'>{props.note.title}</div>
        <p className='text-xxs text-gray-500'>{authorQ.data?.data.account.name}</p>
      </div>
    </div>
  )
}

const GroupViewNotesTab: React.FC = () => {
  const authContext = useAuthContext()
  const listNotesQ = useListNotes({ author_id: authContext.userID })
  const groupContext = useGroupContext()
  const getGroupQ = useGetGroup({ group_id: groupContext.groupID as string })
  const navigate = useNavigate()
  const createNoteQ = useCreateNote({
    onSuccess: (data) => {
      navigate(`./note/${data.data.note.id}`)
    },
  })

  return (
    <div className='grid w-full grid-rows-1 gap-4'>
      {/* Menu */}
      <GroupViewMenu activeTab={''}>
        <div className='flex items-center'>
          {getGroupQ.isSuccess ? (
            <div className='mr-4 flex h-7 rounded bg-gray-100 px-2'>
              <div className='flex items-center'>
                <FolderIcon className='mr-2 h-4 w-4 text-gray-500' />
                <p className='mr-1 cursor-pointer text-sm text-gray-500 decoration-blue-500 decoration-2 hover:underline'>
                  {getGroupQ.data.data.group.name}
                </p>
              </div>
            </div>
          ) : (
            <React.Fragment>
              <div className='skeleton h-7 w-56'></div>
              <div className='skeleton h-7 w-56'></div>
            </React.Fragment>
          )}
        </div>
      </GroupViewMenu>

      {/* Search bar */}
      <div className='flex grid-rows-[auto_auto]'>
        <input
          className='w-full rounded-md border border-gray-200 p-2 text-sm placeholder:text-gray-400'
          placeholder={`Search ${getGroupQ.data?.data.group.name || ''}`}
          type='text'
        />
        <button
          className='ml-4 flex shrink-0 items-center rounded-md bg-blue-600 p-2 px-3 text-sm text-white transition-all hover:bg-blue-700 hover:shadow-md'
          onClick={() => {
            createNoteQ.mutate({
              group_id: groupContext.groupID as string,
              note: { title: 'Untitled Note', author_id: 'ssss' },
            })
          }}
        >
          New note
          <PencilIcon className='ml-2 h-4 w-4 text-white' />
        </button>
      </div>

      {/* Notes Grid */}
      <div className='grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4'>
        {listNotesQ.isSuccess ? (
          listNotesQ.data.data?.notes?.map((note, idx) => (
            <NotesListGridItem
              key={`group-view-notes-tab-grid-${note.id}-${idx}`}
              note={note}
            />
          ))
        ) : (
          <div className='skeleton h-48 w-full' />
        )}
        {/* New Note Button
      <div className='w-full h-48 items-center justify-center cursor-pointer p-2 border-gray-100 border rounded text-gray-600 flex flex-col'
        onClick={() => createNoteQ.mutate({ group_id: groupContext.groupID as string, note: { title: 'Untitled Note', author_id: 'ssss' }})}>
        <DocumentTextIcon className='text-gray-400 h-12 w-12 stroke-1 mb-4' />
        <div className='flex items-center text-gray-500'>
          <PlusIcon className='text-gray-500 h-5 w-5 mr-1' />New Note
        </div>
      </div> */}
      </div>
    </div>
  )
}

export default GroupViewNotesTab
