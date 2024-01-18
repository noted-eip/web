import { ArrowPathIcon, PlusIcon, TrashIcon as TrashIconOutline } from '@heroicons/react/24/outline'
import { Button, Stack } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import Searchbar from '../../components/searchBar/Searchbar'
import { useNoteContext } from '../../contexts/note'
import { useGetAccount } from '../../hooks/api/accounts'
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
        <NotesListGridItem
          key={`group-view-notes-tab-grid-${note.id}-${idx}`}
          note={note}
        />
      ))}
    </>
  )
}

const GroupViewNotesTab: React.FC = () => {
  const { formatMessage } = useOurIntl()
  const navigate = useNavigate()
  const listNotesQ = useListNotesInCurrentGroup({})
  const [input, setInput] = React.useState('')
  const { clearBlocksContext } = useNoteContext()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInput = (e: any) => {
    setInput(e.target.value.toLowerCase())
  }

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
      {
        (listNotesQ.isSuccess && listNotesQ.data.notes) &&
      <Stack direction='row' spacing={2}>
        <Searchbar 
          style={{ flex: 5 }}
          options={listNotesQ.data.notes.map((note) => (note.title))} placeholder={`${formatMessage({ id: 'GROUP.search' })} une note`} handleInput={handleInput}
        />
        <Button
          variant='outlined'
          onClick={() => {
            createNoteQ.mutate({body: {title: formatMessage({ id: 'NOTE.untitledNote' })}})
          }}
          style={{ flex: 1 }}
          endIcon={
            createNoteQ.isLoading ?
              <ArrowPathIcon className='h-5 w-5 animate-spin text-blue-500' /> : 
              <PlusIcon className='h-5 w-5 stroke-2' style={{color: '#2a777d' }} />
          }
        >
          <FormatMessage id='NOTE.newNote' />
        </Button>
      </Stack>
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
  )
}

export default GroupViewNotesTab
