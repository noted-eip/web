import { ArrowPathIcon, LinkIcon as LinkIconOutline,PencilIcon as PencilIconOutline,PlusIcon, TrashIcon as TrashIconOutline } from '@heroicons/react/24/outline'
import { Button, MenuItem, Select, Stack } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Searchbar from '../../components/searchBar/Searchbar'
import { LangageContext } from '../../contexts/langage'
import { useNoteContext } from '../../contexts/note'
import { useGetAccount } from '../../hooks/api/accounts'
import { useCreateNoteInCurrentGroup, useDeleteNoteInCurrentGroup, useGetNoteInCurrentGroup, useListNotesInCurrentGroup, useUpdateNoteInCurrentGroup } from '../../hooks/api/notes'
import useClickOutside from '../../hooks/click'
import { FormatMessage, useOurIntl } from '../../i18n/TextComponent'
import { blockContextToNoteBlockAPI, noteAPIToContextBlocks } from '../../lib/editor'
import { V1Note } from '../../protorepo/openapi/typescript-axios'
import NotesListGridItemContextMenu from '../notes/NotesListGridItemContextMenu'

const NotesListGridItem: React.FC<{ note: V1Note }> = (props) => {
  const { formatMessage } = useOurIntl()
  const [editTitle, setEditTitle] =  React.useState(false)
  const [newTitle, setNewTitle] =  React.useState<string>(props.note.title)
  const newTitleInputRef = React.createRef<HTMLInputElement>()
  const noteQuery = useGetNoteInCurrentGroup({ noteId: props.note.id })
  const [isLoading, setIsLoading] = React.useState(true)
  const authorQ = useGetAccount({accountId: props.note.authorAccountId})
  const deleteNoteQ = useDeleteNoteInCurrentGroup()
  const navigate = useNavigate()
  const updateNoteQ = useUpdateNoteInCurrentGroup()

  useClickOutside(newTitleInputRef, () => {
    setEditTitle(false)
    setNewTitle(props.note.title)
  })

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        await noteQuery.refetch()
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const onChangeTitle = (e) => {
    e.preventDefault()
    if (!noteQuery.data) {
      return
    }
    const updatedNote = {
      ...props.note,
      title: newTitle,
      blocks: noteAPIToContextBlocks(noteQuery.data.note).map((block) => blockContextToNoteBlockAPI(block)),
    }
    updateNoteQ.mutate({noteId: props.note.id, body: updatedNote})
    setEditTitle(false)
  }
  
  const handleClick = (e) => {
    if (e.target.type === 'submit') {
      return
    }
    e.preventDefault()
    navigate(`./note/${props.note.id}`)
  }
  
  return (
    <div>
      {isLoading ? (
        <div className='skeleton h-4 w-full' />
      ) : (noteQuery.data &&
        <div
          className='flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-gray-100 bg-gray-50 p-2 transition-all hover:bg-gray-100 hover:shadow-inner'
          onClick={handleClick}
          id={`group-view-notes-tab-grid-${props.note.id}`}
        >
          <div className='mb-2 h-2/3 w-1/2 rounded-md bg-white shadow-md' />
          <div className='w-full text-center'>
            {editTitle ? (
              <form onSubmit={onChangeTitle}
              >
                <input
                  ref={newTitleInputRef}
                  autoFocus
                  className='w-32 rounded border-gray-200 bg-white px-1 py-0 font-medium'
                  type='text'
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <button type='submit' />
              </form>
            ) : (
              <div className='text-xs font-medium text-gray-800'>
                {props.note.title}
                <PencilIconOutline className='ml-2 hidden h-4 w-4 stroke-2 text-gray-400 group-hover:block' />
              </div>
            )}
            <p className='text-xxs text-gray-500'>{authorQ.data?.account.name}</p>
          </div>
        </div>
      )}
      <NotesListGridItemContextMenu
        targetId={`group-view-notes-tab-grid-${props.note.id}`}
        options={[
          {icon: PencilIconOutline, name: formatMessage({id:'GROUP.noteTab.rename'}), onClick: () => setEditTitle(true)},
          {icon: LinkIconOutline, name: formatMessage({id:'GROUP.noteTab.copyLink'}), onClick: () => { alert('Not implemented') }},
          {icon: TrashIconOutline, name: formatMessage({id:'GROUP.noteTab.delete'}), onClick: () => deleteNoteQ.mutate({ noteId: props.note.id })},
        ]}
        note={props.note} />
    </div>
  )
}

function filterProducts(searchstring: string, notes: V1Note[]) {
  const filteredNotes = notes.filter((element) => {
    if (searchstring === '') {
      return element
    }
    else {
      return element.title.toLowerCase().includes(searchstring)
    }
  })
  
  return (filteredNotes)
}

const GroupViewNotesTab: React.FC = () => {
  const { formatMessage } = useOurIntl()
  const navigate = useNavigate()
  const listNotesQ = useListNotesInCurrentGroup({})
  const [input, setInput] = React.useState('')
  const { clearBlocksContext } = useNoteContext()
  const context = React.useContext(LangageContext)
  // le back renvoie fr-FR ?
  const [selectedLanguage, setSelectedLanguage] = useState(context?.langage || 'fr')

  React.useEffect(() => {
    clearBlocksContext()
  }, [])

  const createNoteQ = useCreateNoteInCurrentGroup({
    onSuccess: (data) => {
      console.log(data)
      navigate(`./note/${data.note.id}`)
    },
  })

  const handleInput = (e) => {
    setInput(e.target.value.toLowerCase())
  }

  const handleLanguageSelect = (event) => {
    setSelectedLanguage(event.target.value)
  }

  return (
    <div className='grid w-full grid-rows-1 gap-4'>
      {/* Menu */}
      {/* Search bar */}
      {
        (listNotesQ.isSuccess && listNotesQ.data.notes) &&
      <Stack direction='row' spacing={2}>
        <Searchbar 
          style={{ flex: 4, height: '40px' }}
          options={listNotesQ.data.notes.map((note) => (note.title))} placeholder={`${formatMessage({ id: 'GROUP.search' })} une note`} handleInput={handleInput}
        />
        <Button
          variant='outlined'
          onClick={() => createNoteQ.mutate({body: {lang: selectedLanguage, title: formatMessage({ id: 'NOTE.untitledNote' })}})}
          style={{ flex: 1, height: '40px' }}
          endIcon={
            createNoteQ.isLoading ?
              <ArrowPathIcon className='h-5 w-5 animate-spin text-blue-500' /> : 
              <PlusIcon className='h-5 w-5 stroke-2' style={{color: '#2a777d' }} />
          }
        >
          <FormatMessage id='NOTE.newNote' />
        </Button>
        <Select
          style={{ height: '40px' }}  
          value={selectedLanguage}
          onChange={handleLanguageSelect}
        >
          <MenuItem value='fr'>🇫🇷</MenuItem>
          <MenuItem value='en'>🇬🇧</MenuItem>
        </Select>
      </Stack>
      }
      {/* Notes Grid */}
      {listNotesQ.isSuccess ? 
        (listNotesQ.data.notes && listNotesQ.data.notes?.length !== 0  ? 
          <div className='grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4'>
            {filterProducts(input, listNotesQ.data.notes).map((note: V1Note, idx) => (
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
