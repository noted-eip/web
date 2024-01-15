import { ArrowPathIcon, PlusIcon, TrashIcon as TrashIconOutline } from '@heroicons/react/24/outline'
import { Button, Stack } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useNoteContext } from '../../contexts/note'
import { useGetAccount } from '../../hooks/api/accounts'
import { useGetCurrentGroup } from '../../hooks/api/groups'
import { useCreateNoteInCurrentGroup, useDeleteNoteInCurrentGroup, useListNotesInCurrentGroup } from '../../hooks/api/notes'
import { FormatMessage, useOurIntl } from '../../i18n/TextComponent'
import { V1Note } from '../../protorepo/openapi/typescript-axios'
import NotesListGridItemContextMenu from '../notes/NotesListGridItemContextMenu'

const NotesListGridItem: React.FC<{ note: V1Note }> = (props) => {
  const authorQ = useGetAccount({accountId: props.note.authorAccountId})
  const deleteNoteQ = useDeleteNoteInCurrentGroup()
  const navigate = useNavigate()

  return (
    <div>
      <div
        className='flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-gray-100 bg-gray-50 p-2 transition-all hover:bg-gray-100 hover:shadow-inner'
        onClick={() => navigate(`./note/${props.note.id}`)}
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
          // TODO: on le dev ca ?
          // {icon: LinkIconOutline, name: 'Copy Link', onClick: () => { alert('Not implemented') }},
          {icon: TrashIconOutline, name: 'Delete', onClick: () => { deleteNoteQ.mutate({ noteId: props.note.id }) }},
        ]}
        note={props.note} />
    </div>
  )
}

const GroupViewNotesTab: React.FC = () => {
  const { formatMessage } = useOurIntl()
  const navigate = useNavigate()
  const listNotesQ = useListNotesInCurrentGroup({})
  const getGroupQ = useGetCurrentGroup()

  const { clearBlocksContext } = useNoteContext()

  React.useEffect(() => {
    clearBlocksContext()
  }, [])

  const createNoteQ = useCreateNoteInCurrentGroup({
    onSuccess: (data) => {
      navigate(`./note/${data.note.id}`)
    },
  })

  return (
    <div className='grid w-full grid-rows-1 gap-4'>
      {/* Menu */}
      {/* Search bar */}
      <Stack direction='row' spacing={2}>
        <input
          className='w-full rounded-md border border-gray-200 p-2 text-sm placeholder:text-gray-400'
          placeholder={`${formatMessage({ id: 'GROUP.search' })} ${getGroupQ.data?.group.name || ''}`}
          type='text'
        />
        <Button
          variant='outlined'
          className='shrink-0'
          onClick={() => {
            createNoteQ.mutate({body: {title: formatMessage({ id: 'NOTE.untitledNote' })}})
          }}
          endIcon={
            createNoteQ.isLoading ?
              <ArrowPathIcon className='h-5 w-5 animate-spin text-blue-500' /> : 
              <PlusIcon className='h-5 w-5 stroke-2' style={{color: '#2a777d' }} />
          }
        >
          <FormatMessage id='NOTE.newNote' />
        </Button>
      </Stack>
      {/* Notes Grid */}
      {listNotesQ.isSuccess ? 
        (listNotesQ.data.notes?.length !== 0 ? 
          <div className='grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4'>
            {listNotesQ.data.notes?.map((note, idx) => (
              <NotesListGridItem
                key={`group-view-notes-tab-grid-${note.id}-${idx}`}
                note={note}
              />
            ))}
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
  )
}

export default GroupViewNotesTab
