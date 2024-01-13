import { ArrowPathIcon, DocumentDuplicateIcon, ShareIcon, TrashIcon } from '@heroicons/react/24/solid'
import moment from 'moment'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import LoaderIcon from '../../components/icons/LoaderIcon'
import { useAuthContext } from '../../contexts/auth'
import { useGetAccount } from '../../hooks/api/accounts'
import { useDeleteNoteInCurrentGroup, useGetNoteInCurrentGroup } from '../../hooks/api/notes'
import { useGroupIdFromUrl, useNoteIdFromUrl } from '../../hooks/url'
import { FormatMessage } from '../../i18n/TextComponent'
import { NotesOptions } from './NoteMetadataHeader'

const NoteViewMetadataHeader: React.FC = () => {
  const navigate = useNavigate()
  const authContext = useAuthContext()
  const noteId = useNoteIdFromUrl()
  const noteQ = useGetNoteInCurrentGroup({ noteId })
  const deleteNoteQ = useDeleteNoteInCurrentGroup({ onSuccess: () => { navigate('../..') } })
  const modifiedAtRelative = noteQ.data && noteQ.data.note.modifiedAt && moment(noteQ.data.note.modifiedAt, 'YYYY-MM-DDTHH:mm:ss.SSSZ').fromNow()
  const authorAccountQ = useGetAccount({ accountId: noteQ.data?.note.authorAccountId as string }, { enabled: !!noteQ.data?.note.authorAccountId })
  const canIEdit = noteQ.data?.note.authorAccountId === authContext.accountId

  const handleDeleteNote = () => deleteNoteQ.mutate({ noteId })

  return <div className='mx-xl flex h-10 items-center justify-between rounded-md border border-gray-100 bg-gray-50 p-1 px-2'>
    {/* Last edited by */}
    <div className='flex items-center'>
      <h5 className='mr-1 text-gray-500'><FormatMessage id='NOTE.timecodeA' /> {modifiedAtRelative} <FormatMessage id='NOTE.timecodeB' /> </h5>
      <div className='flex h-6 cursor-pointer items-center rounded border bg-white p-[2px] px-1 text-xs'>
        {authorAccountQ.data ? <>
          <div className='mr-1 h-3 w-3 rounded bg-gradient-radial from-teal-300 to-green-200' />
          {authorAccountQ.data.account.name}
        </> : <LoaderIcon className='h-3 w-3' />}
      </div>
    </div>
    {/* Menu */}
    <div className='grid grid-cols-[auto_auto_auto_auto] gap-2'>
      {/* Duplicate */}
      <div className='group flex cursor-pointer items-center rounded p-1 hover:bg-blue-50' onClick={() => alert('Not Implemented')}>
        <DocumentDuplicateIcon className='mr-1 h-4 w-4 text-gray-500 group-hover:text-blue-500' />
        <h5 className='text-gray-500 group-hover:text-blue-500'>
          <FormatMessage id='NOTE.duplicate' />
        </h5>
      </div>
      {/* Share */}
      <div className='group flex cursor-pointer items-center rounded p-1 hover:bg-blue-50' onClick={() => alert('Not Implemented')}>
        <ShareIcon className='mr-1 h-4 w-4 text-gray-500 group-hover:text-blue-500' />
        <h5 className='text-gray-500 group-hover:text-blue-500'>
          <FormatMessage id='NOTE.share' />
        </h5>
      </div>
      {/* Delete */}
      {canIEdit && <div className='group flex cursor-pointer items-center rounded p-1 hover:bg-red-50' onClick={handleDeleteNote}>
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
            groupId={useGroupIdFromUrl()} />}

      </div>
    </div>
  </div>
}

export default NoteViewMetadataHeader