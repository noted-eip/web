import { TrashIcon as TrashIconOutline } from '@heroicons/react/24/outline'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import Searchbar from '../../components/searchBar/Searchbar'
import ViewSkeleton from '../../components/view/ViewSkeleton'
import { useAuthContext } from '../../contexts/auth'
import { useGroupContext } from '../../contexts/group'
import { useGetAccount } from '../../hooks/api/accounts'
import { useDeleteNoteInCurrentGroup, useListNotes } from '../../hooks/api/notes'
import { FormatMessage, useOurIntl } from '../../i18n/TextComponent'
import { V1Note } from '../../protorepo/openapi/typescript-axios'
import NotesListGridItemContextMenu from './NotesListGridItemContextMenu'

export const NotesListGridItemNoGroup: React.FC<{ note: V1Note }> = (props) => {
  const authorQ = useGetAccount({accountId: props.note.authorAccountId})
  const deleteNoteQ = useDeleteNoteInCurrentGroup()
  const navigate = useNavigate()
  const groupContext = useGroupContext()

  const handleViewNote = () => {
    groupContext.changeGroup(props.note.groupId)
    navigate(`/group/${props.note.groupId}/note/${props.note.id}`)
  }

  return (
    <div>
      <div
        className='flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-gray-100 bg-gray-50 p-2 transition-all hover:bg-gray-100 hover:shadow-inner'
        onClick={handleViewNote}
        id={`group-view-notes-tab-grid-${props.note.id}`}
      >
        <div className='mb-2 h-2/3 w-1/2 rounded-md bg-white shadow-md' />
        <div className='w-full text-center'>
          <div className='text-xs font-medium text-gray-800'>{props.note.title}</div>
          <p className='text-xxs text-gray-500'>{authorQ.data?.account.name}</p>
        </div>
      </div>
      <NotesListGridItemContextMenu
        targetId={`group-view-notes-tab-grid-${props.note.id}`}
        options={[
          {icon: TrashIconOutline, name: 'Delete', onClick: () => { deleteNoteQ.mutate({ noteId: props.note.id }) }},
        ]}
        note={props.note} />
    </div>
  )
}

const FilterPrducts: React.FC<{ searchstring: string, notes: V1Note[] }> = (props) => {

  const filteredNotes = props.notes.filter((element) => {
    if (props.searchstring === '') {
      return element
    }
    else {
      return element.title.toLowerCase().includes(props.searchstring)
    }
  })
  
  return (
    <>
      {filteredNotes.map((note, idx) => (
        <NotesListGridItemNoGroup
          key={`group-view-notes-tab-grid-${note.id}-${idx}`}
          note={note}
        />
      ))}
    </>
  )
}

const NotesView: React.FC = () => {
  const { formatMessage } = useOurIntl()
  const authContext = useAuthContext()
  const listNotesQ = useListNotes({authorAccountId: authContext.accountId})
  const [input, setInput] = React.useState('')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInput = (e: any) => {
    setInput(e.target.value.toLowerCase())
  }
 
  return (
    <ViewSkeleton title={formatMessage({ id: 'GENERIC.notes' })} panels={['group-activity-no-group']}>
      <div className='mx-lg mb-lg w-full xl:mx-xl xl:mb-xl'>
        <div className='grid w-full grid-rows-1 gap-4'>
          {/* Search bar */}
          {
            (listNotesQ.isSuccess && listNotesQ.data.notes) &&
            <Searchbar options={listNotesQ.data.notes.map((note) => (note.title))} placeholder={`${formatMessage({ id: 'GROUP.search' })} une note`} handleInput={handleInput} />
          }
          {/* Notes Grid */}
          {listNotesQ.isSuccess ? 
            (listNotesQ.data.notes && listNotesQ.data.notes?.length !== 0  ? 
              <div className='grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4'>
                <FilterPrducts searchstring={input} notes={listNotesQ.data.notes} />
              </div>
              : 
              <div className='flex h-full items-center justify-center lg:px-lg lg:pb-lg xl:px-xl xl:pb-xl'>
                <div className='my-4 space-y-2 text-center'>
                  <FormatMessage id='NOTES.noNotes' />
                </div>
              </div>) :
            <div className='skeleton h-48 w-full' />     
          }
        </div>
      </div>
    </ViewSkeleton>
  )
}


export default NotesView
