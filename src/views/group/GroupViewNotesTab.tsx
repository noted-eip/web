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

type NotesLiNotesListGridItemContextMenuProps = {
  note: V1Note,
  targetId: string,
  options: {
    name: string,
    icon: (props: React.SVGProps<SVGSVGElement> & { title?: string | undefined; titleId?: string | undefined; }) => JSX.Element,
    onClick: () => void,
  }[],
}

const NotesListGridItemContextMenu: React.FC<NotesLiNotesListGridItemContextMenuProps> = (props) => {
  const [contextData, setContextData] = React.useState({ visible:false, posX: 0, posY: 0})
  const contextRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const contextMenuEventHandler= (e) => {
      const targetElement = document.getElementById(props.targetId)

      if (targetElement && targetElement.contains(e.target)) {
        e.preventDefault()
        setContextData({ visible: true, posX: e.clientX, posY: e.clientY })
      } else if(contextRef.current && !contextRef.current.contains(e.target)){
        setContextData({ ...contextData, visible: false })
      }
    }

    const offClickHandler= () => {
      if(contextRef.current){
        setContextData({ ...contextData, visible: false })
      }
    }

    document.addEventListener('contextmenu', contextMenuEventHandler)
    document.addEventListener('click', offClickHandler)
    return () => {
      document.removeEventListener('contextmenu', contextMenuEventHandler)
      document.removeEventListener('click', offClickHandler)
    }
  }, [contextData, props.targetId])

  return <div ref={contextRef} className='absolute w-48 list-none rounded-md border border-gray-200 bg-white shadow-lg' style={{ display:`${contextData.visible ? 'block' : 'none'}`, left: contextData.posX, top: contextData.posY }}>
    <div className=''>
      {props.options.map((option) => (
        <li
          key={`notes-list-grid-item-context-menu-${props.note.id}-${option.name}`}
          className='group m-1 flex cursor-pointer items-center rounded-md px-3 py-2 text-sm hover:bg-gray-50'
          onClick={() => {option.onClick()}}>
          <div className='mr-2'>
            {<option.icon className='h-5 w-5 stroke-2 text-gray-400 group-hover:text-gray-500' />}
          </div>
          <p className='text-gray-600 group-hover:text-black'>
            {option.name}
          </p>
        </li>
      ))}
    </div>
  </div>
}

export const NotesListGridItem: React.FC<{ note: V1Note }> = (props) => {
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
              <PlusIcon className='h-5 w-5 stroke-2 text-blue-500' />
          }
        >
          <FormatMessage id='NOTE.newNote' />
        </Button>
      </Stack>
      {/* Notes Grid */}
      <div className='grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4'>
        {listNotesQ.isSuccess ? (
          listNotesQ.data?.notes?.map((note, idx) => (
            <NotesListGridItem
              key={`group-view-notes-tab-grid-${note.id}-${idx}`}
              note={note}
            />
          ))
        ) : (
          <div className='skeleton h-48 w-full' />
        )}
      </div>
    </div>
  )
}

export default GroupViewNotesTab
