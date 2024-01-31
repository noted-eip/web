import { ArrowPathIcon, DocumentDuplicateIcon, TrashIcon } from '@heroicons/react/24/solid'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import axios from 'axios'
import moment from 'moment'
import React from 'react'
import { LoaderIcon } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import { StyledMenu } from '../../components/Menu/StyledMenu'
import { TAuthContext, useAuthContext } from '../../contexts/auth'
import { BlockContext } from '../../contexts/note'
import { useGetAccount } from '../../hooks/api/accounts'
import { useCreateNoteInCurrentGroup, useDeleteNoteInCurrentGroup,useGetNoteInCurrentGroup, useInsertBlockInCurrentGroup, useUpdateBlockInCurrentGroup } from '../../hooks/api/notes'
import { useGroupIdFromUrl,useNoteIdFromUrl } from '../../hooks/url'
import { FormatMessage, useOurIntl } from '../../i18n/TextComponent'
import { blockContextToNoteBlockAPI } from '../../lib/editor'
import { API_BASE } from '../../lib/env'
import { NotesAPIInsertBlockRequest,V1Block } from '../../protorepo/openapi/typescript-axios'

const extensions = ['md', 'pdf']

const NotesOptions: React.FC<{noteId: string, groupId: string}> = ({ noteId, groupId }) => {
  const url = `${API_BASE}/groups/${encodeURIComponent(groupId)}/notes/${encodeURIComponent(noteId)}/export`
  const auth : TAuthContext = useAuthContext()
  const [anchorEl, setAnchorEl] =  React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  
  const handleExport = async (format: string) => {  
    try {
      const ids = [noteId, groupId]
      const token = await auth.token()
      
      if (ids.some(id => !id)) {
        throw new Error('ID is not defined')
      }
      if (!format || !extensions.some(ext => format == ext)) {
        throw new Error('Invalid export format')
      }
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'blob',
        params : {
          format: format
        }
      })

      // 😳 https://stackoverflow.com/questions/50694881/how-to-download-file-in-react-js
      // create file link in browser's memory
      const href = URL.createObjectURL(response.data)

      // create "a" HTML element with href to file & click
      const link = document.createElement('a')
      link.href = href
      link.setAttribute('download', `note.${format}`) //or any other extension
      document.body.appendChild(link)
      link.click()

      // clean up "a" element & remove ObjectURL
      document.body.removeChild(link)
      URL.revokeObjectURL(href)

    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div>
      <IconButton
        aria-label='more'
        id='long-button'
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup='true'
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <StyledMenu
        id='demo-customized-menu'
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            handleExport('pdf')
            handleClose()}}
        >
          <FormatMessage id='NOTE.export.button1' />
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleExport('md')
            handleClose()}}>
          <FormatMessage id='NOTE.export.button2' />
        </MenuItem>
      </StyledMenu>
    </div>
  )
}

const NoteViewMetadataHeader: React.FC = () => {
  const { formatMessage } = useOurIntl()
  const navigate = useNavigate()
  const authContext = useAuthContext()
  const noteId = useNoteIdFromUrl()
  const noteQ = useGetNoteInCurrentGroup({ noteId })
  const modifiedAtRelative = noteQ.data && noteQ.data.note.modifiedAt && moment(noteQ.data.note.modifiedAt, 'YYYY-MM-DDTHH:mm:ss.SSSZ').fromNow()
  const authorAccountQ = useGetAccount({ accountId: noteQ.data?.note.authorAccountId as string }, { enabled: !!noteQ.data?.note.authorAccountId })
  const canIEdit = noteQ.data?.note.authorAccountId === authContext.accountId
  const [newNoteId, setNewNoteId] = React.useState('')
  const insertBlockMutation = useInsertBlockInCurrentGroup()
  const updateBlockMutation = useUpdateBlockInCurrentGroup({
    onSuccess: (data) => {
      if (noteQ.data?.note.blocks && data.block.paragraph === noteQ.data?.note.blocks[noteQ.data?.note.blocks?.length - 1].paragraph) {
        navigate(`/group/${noteQ.data?.note.groupId}/note/${newNoteId}`)
        window.location.reload()
      }
    }
  })
  
  const insertBlockBackend = async (
    notedId: string,
    index: number | undefined,
    block: V1Block
  ) => {
    const res = await insertBlockMutation.mutateAsync({
      noteId: notedId,
      body: {
        index: index,
        block: block
      } as NotesAPIInsertBlockRequest
    })
    return res.block.id
  }
  const updateBlockBackend = (
    notedId: string,
    blockId: string | undefined,
    block: V1Block
  ) => {
    updateBlockMutation.mutate({
      noteId: notedId,
      blockId: blockId === undefined ? '' : blockId,
      body: block
    })
  }

  const createNoteQ = useCreateNoteInCurrentGroup({
    onSuccess: (data) => {
      setNewNoteId(data.note.id)
      if (!noteQ.data?.note.blocks) {
        return
      }
      if (!data.note.blocks){
        return
      }
      const tmp = noteQ.data?.note.blocks[0]
      tmp.id = data?.note.blocks[0].id
      updateBlockBackend(data.note.id, data?.note.blocks[0].id, tmp)
      noteQ.data?.note.blocks.map(async (e: V1Block, idx) => {
        if (idx === 0) {
          return
        }
        const blockId = await insertBlockBackend(data.note.id, idx, blockContextToNoteBlockAPI({ 
          id: 'tmp-id', 
          type: e.type,
          children: [],
          index: idx,
          isFocused: true
        } as BlockContext))
        const newBlock = e
        newBlock.id = blockId
        updateBlockBackend(data.note.id, blockId, newBlock)
      })
    }
  })

  const deleteNoteQ = useDeleteNoteInCurrentGroup({
    onSuccess: () => {
      navigate(`/group/${noteQ.data?.note.groupId}`)
    }
  })


  return <div className='mx-xl flex h-10 items-center justify-between rounded-md border border-gray-100 bg-gray-50 p-1 px-2'>
    {/* Last edited by */}
    <div className='flex items-center'>
      <h5 className='mr-1 text-gray-500'><FormatMessage id='NOTE.timecodeA' /> {modifiedAtRelative} <FormatMessage id='NOTE.timecodeB' /> </h5>
      <div className='flex h-6 items-center rounded border bg-white p-[2px] px-1 text-xs'>
        {authorAccountQ.data ? <>
          {authorAccountQ.data.account.name}
        </> : <LoaderIcon className='h-3 w-3' />}
      </div>
    </div>
    {/* Menu */}
    <div className='grid grid-cols-[auto_auto_auto_auto] gap-2'>
      {/* Duplicate */}
      {canIEdit && noteQ.data?.note.title && <div className='group flex cursor-pointer items-center rounded p-1 hover:bg-blue-50' onClick={() => createNoteQ.mutate({body: {title: noteQ.data.note.title + ' ' + formatMessage({id: 'GENERIC.copy'})}})}>
        {createNoteQ.isLoading ? <ArrowPathIcon className='mr-1 h-4 w-4 animate-spin text-gray-500 group-hover:text-red-600' /> : <DocumentDuplicateIcon className='mr-1 h-4 w-4 text-gray-500 group-hover:text-blue-500' />}
        <h5 className='text-gray-500 group-hover:text-blue-500'>
          <FormatMessage id='NOTE.duplicate' />
        </h5>
      </div>
      }
      {/* Delete */}
      {canIEdit && <div className='group flex cursor-pointer items-center rounded p-1 hover:bg-red-50' onClick={() => deleteNoteQ.mutate({ noteId })}>
        {deleteNoteQ.isLoading ? <ArrowPathIcon className='mr-1 h-4 w-4 animate-spin text-gray-500 group-hover:text-red-600' /> : <TrashIcon className='mr-1 h-4 w-4 text-gray-500 group-hover:text-red-600' />}
        <h5 className='text-gray-500 group-hover:text-red-600'>
          <FormatMessage id='NOTE.delete' />
        </h5>
      </div>}
      <div className='group flex cursor-pointer items-center p-1'>
        {window.location.pathname.includes('/note/') &&
            window.location.pathname.split('/')[4] &&
              <NotesOptions 
                noteId={useNoteIdFromUrl()}
                groupId={useGroupIdFromUrl()}
              />
        }
      </div>
    </div>
  </div>
}

export default NoteViewMetadataHeader