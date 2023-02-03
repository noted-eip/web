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

const NotesListGridItem: React.FC<{note: Note}> = props => {
  const authorQ = useGetAccount({ account_id: props.note.author_id })
  const navigate = useNavigate()

  return <div
    className='hover:shadow-inner transition-all hover:bg-gray-100 w-full h-48 bg-gray-50 rounded-md items-center justify-center cursor-pointer p-2 flex flex-col'
    onClick={() => navigate(`./note/${props.note.id}`)}>
    <div className='h-2/3 bg-white w-1/2 rounded-md shadow-md mb-2' />
    <div className='text-center w-full'>
      <div className='text-xs font-medium text-gray-800'>{props.note.title}</div>
      <p className='text-xxs text-gray-500'>{authorQ.data?.data.account.name}</p>
    </div>
  </div>
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
    }
  })

  return <div className='grid grid-rows-1 gap-4 w-full'>
    {/* Menu */}
    <GroupViewMenu activeTab={''}>
      <div className='flex items-center'>
        {
          getGroupQ.isSuccess ?
            <div className='mr-4 flex bg-gray-100 h-7 rounded px-2'>      
              <div className='flex items-center'>
                <FolderIcon className='text-gray-500 h-4 w-4 mr-2' /><p className='text-sm text-gray-500 mr-1 hover:underline cursor-pointer decoration-2 decoration-blue-500'>{getGroupQ.data.data.group.name}</p>
              </div>
            </div>
            :
            <React.Fragment>
              <div className='skeleton w-56 h-7'></div>
              <div className='skeleton w-56 h-7'></div>
            </React.Fragment>
        }
      </div>
    </GroupViewMenu>

    {/* Search bar */}
    <div className='flex grid-row-[auto_auto]'>
      <input className='rounded-md text-sm p-2 border border-gray-200 w-full placeholder:text-gray-400' placeholder={`Search ${getGroupQ.data?.data.group.name || ''}`} type="text" />
      <button className='flex-shrink-0 flex items-center text-sm text-white rounded-md p-2 px-3 bg-blue-600 hover:shadow-md ml-4 transition-all hover:bg-blue-700'
        onClick={() => {createNoteQ.mutate({ group_id: groupContext.groupID as string, note: { title: 'Untitled Note', author_id: 'ssss' }})}}>
        New note
        <PencilIcon className='h-4 w-4 text-white ml-2' />
      </button>
    </div>

    {/* Notes Grid */}
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-3 xl:grid-cols-4 lg:gap-4">
      {
        listNotesQ.isSuccess ?
          listNotesQ.data.data?.notes?.map((note, idx) => <NotesListGridItem key={`group-view-notes-tab-grid-${note.id}-${idx}`} note={note} />)
          :
          <div className='skeleton w-full h-48' />
      }
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
}

export default GroupViewNotesTab
