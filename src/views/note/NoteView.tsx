import { ArrowPathIcon, DocumentDuplicateIcon, ShareIcon, TrashIcon } from '@heroicons/react/24/outline'
import moment from 'moment'
import React from 'react'
import ContentEditable from 'react-contenteditable'
import { useLocation, useNavigate } from 'react-router-dom'
import sanitizeHtml from 'sanitize-html'
import ViewSkeleton from '../../components/view/ViewSkeleton'
import { useAuthContext } from '../../contexts/auth'
import { useGetAccount } from '../../hooks/api/accounts'
import { useDeleteNoteInCurrentGroup, useGetNoteInCurrentGroup, useUpdateNoteInCurrentGroup } from '../../hooks/api/notes'
import { V1Note } from '../../protorepo/openapi/typescript-axios'

/**
 * Increments the state which causes a rerender and executes a callback
 * @param {function} callback - callback to execute after state update
 * @returns {function}
 */
export const useForceUpdate = (callback?) => {
  const [state, updater] = React.useReducer((x) => x + 1, 0)

  React.useEffect(() => {
    callback && callback()
  }, [state])

  return React.useCallback(() => {
    updater()
  }, [])
}

const NoteViewHeader: React.FC = () => {
  const location = useLocation()
  const [latestTitle, setLatestTitle] = React.useState<string>()
  const noteId = location.pathname.split('/')[4]
  const noteQ = useGetNoteInCurrentGroup({ noteId })
  const updateNoteQ = useUpdateNoteInCurrentGroup()
  const authContext = useAuthContext()
  const authorAccountQ = useGetAccount({ accountId: noteQ.data?.note.authorAccountId as string }, { enabled: !!noteQ.data?.note.authorAccountId })
  const text = React.useRef<string | undefined>()

  React.useEffect(() => {
    if (noteQ.isSuccess && !text.current) {
      text.current = noteQ.data.note.title
      setLatestTitle(noteQ.data.note.title)
    }
  }, [noteQ])

  const handleChange = evt => {
    text.current = evt.target.value
  }

  const handleBlur = () => {
    updateNote()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      updateNote()
    }
  }

  const updateNote = () => {
    if (text.current == latestTitle) {
      return
    }
    setLatestTitle(text.current)
    updateNoteQ.mutate({ noteId, body: { title: text.current || '' } as V1Note})
  }

  return <div className='flex items-center justify-center'>
    <div className='flex h-8 w-8 items-center justify-center rounded-md bg-gray-100'>📝</div>
    {
      text.current ?
        <ContentEditable
          className='ml-2 w-96 rounded-md px-1 text-lg font-medium text-gray-600 focus:outline-none'
          html={text.current}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={authContext.accountId !== authorAccountQ.data?.account.id} />
        :
        <div className='skeleton ml-2 h-4 w-32' />
    }
  </div>
}

const NoteHeader: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const noteId = location.pathname.split('/')[4]
  const noteQ = useGetNoteInCurrentGroup({ noteId })
  const deleteNoteQ = useDeleteNoteInCurrentGroup({ onSuccess: () => { navigate('../..') }})
  const modifiedAtRelative = noteQ.data && noteQ.data.note.modifiedAt && moment(noteQ.data.note.modifiedAt, 'YYYY-MM-DDTHH:mm:ss.SSSZ').fromNow()
  const authorAccountQ = useGetAccount({ accountId: noteQ.data?.note.authorAccountId as string }, { enabled: !!noteQ.data?.note.authorAccountId })

  return <div className='mx-xl flex h-10 items-center justify-between rounded-md border border-gray-100 bg-gray-50 p-1 px-2'>
    {/* Last edited by */}
    <div className='flex items-center'>
      <h5 className='mr-1 text-gray-500'>Last edited {modifiedAtRelative} by </h5>
      <div className='flex cursor-pointer items-center rounded border bg-white p-[2px] px-1 text-xs'>
        <div className='mr-1 h-3 w-3 rounded bg-gradient-radial from-teal-300 to-green-200' />
        {authorAccountQ.data && authorAccountQ.data.account.name}
      </div>
    </div>
    {/* Menu */}
    <div className='flex'>
      <div className='group mr-2 flex cursor-pointer items-center rounded p-1 hover:bg-blue-50' onClick={() => {
        alert('Not Implemented')
      }}>
        <DocumentDuplicateIcon className='mr-1 h-4 w-4 text-gray-500 group-hover:text-blue-500' />
        <h5 className='text-gray-500 group-hover:text-blue-500'>Duplicate</h5>
      </div>
      <div className='group mr-2 flex cursor-pointer items-center rounded p-1 hover:bg-blue-50' onClick={() => {
        alert('Not Implemented')
      }}>
        <ShareIcon className='mr-1 h-4 w-4 text-gray-500 group-hover:text-blue-500' />
        <h5 className='text-gray-500 group-hover:text-blue-500'>Share</h5>
      </div>
      <div className='group flex cursor-pointer items-center rounded p-1 hover:bg-red-50' onClick={() => {
        deleteNoteQ.mutate({ noteId })
      }}>
        {
          deleteNoteQ.isLoading ? <ArrowPathIcon className='mr-1 h-4 w-4 animate-spin text-gray-500 group-hover:text-red-600' /> : <TrashIcon className='mr-1 h-4 w-4 text-gray-500 group-hover:text-red-600' />
        }
        <h5 className='text-gray-500 group-hover:text-red-600'>Delete</h5>
      </div>
    </div>
  </div>
}

const NoteView: React.FC = () => {
  const forceUpdate = useForceUpdate()
  const location = useLocation()
  const noteId = location.pathname.split('/')[4]
  const noteQ = useGetNoteInCurrentGroup({ noteId })
  const trailingBlock = React.useRef<string | undefined>()
  const [showPlaceholder, setShowPlaceholder] = React.useState(false)

  React.useEffect(() => {
    if (!noteQ.data?.note.blocks?.length && !trailingBlock.current) {
      setShowPlaceholder(true)
    } else {
      setShowPlaceholder(false)
    }
  }, [noteQ.data])

  const handleChange = (evt) => {
    console.log(evt.target.value)
    console.log(trailingBlock.current)
    if (evt.target.value === '') {
      setShowPlaceholder(true)
    } else if (sanitizeHtml(evt.target.value, {allowedTags: []}) === '') {
      trailingBlock.current = ''
      setShowPlaceholder(true)
    } else {
      if (showPlaceholder) {
        setShowPlaceholder(false)
      }
      trailingBlock.current = sanitizeHtml(evt.target.value, {
        allowedTags: ['br','div'],
        allowedAttributes: {},
      })
      forceUpdate()
    }
  }

  return <ViewSkeleton titleElement={<NoteViewHeader />} panels={['group-chat', 'group-activity', 'note-recommendations']}>
    <div className='w-full'>
      <NoteHeader />
      <div className='relative w-full'>
        <ContentEditable
          html={trailingBlock.current || ''}
          placeholder='Start typing...'
          onChange={handleChange}
          className='m-lg pl-2 text-sm placeholder:text-lg placeholder:text-red-300 focus:outline-none xl:m-xl' />
        {
          showPlaceholder && <div className='pointer-events-none absolute top-0 mx-xl pl-2 text-sm text-gray-400'>Type something...</div>
        }
      </div>
    </div>
  </ViewSkeleton>
}

export default NoteView

// <div className='px-lg pb-lg focus:outline-none xl:px-xl xl:pb-2xl' >
//   <h1 className='pt-8 text-3xl font-medium text-gray-800 first:pt-0'>The Pre-Industrial Era</h1>
//   <div className='pt-2 text-justify'>The Industrial Revolution was a major turning point in human history, marked by a profound shift from manual labor to machine-based manufacturing. It began in the mid-18th century in Britain and quickly spread throughout Europe and North America, fundamentally transforming the way goods were produced, distributed, and consumed.</div>
//   <div className='pt-2 text-justify'> The Industrial Revolution brought about numerous technological innovations, such as the steam engine and mechanized textile production, which dramatically increased the efficiency and productivity of factories.</div>
//   <h2 className='pt-6 text-2xl font-medium text-gray-800'>Cottage industries and handicraft production</h2>
//   <div className='pt-2 text-justify'>The Industrial Revolution was a major turning point in human history, marked by a profound shift from manual labor to machine-based manufacturing. It began in the mid-18th century in Britain and quickly spread throughout Europe and North America, fundamentally transforming the way goods were produced, distributed, and consumed.</div>
//   <h2 className='pt-5 text-xl font-medium text-gray-800'>Limitations of pre-industrial production</h2>
//   <div className='pt-2 text-justify'>The Industrial Revolution was a major turning point in human history, marked by a profound shift from manual labor to machine-based manufacturing. It began in the mid-18th century in Britain and quickly spread throughout Europe and North America, fundamentally transforming the way goods were produced, distributed, and consumed.</div>
//   <h2 className='pt-5 text-xl font-medium text-gray-800'>Some other headline thing</h2>
//   <div className='pt-2 text-justify'>The Industrial Revolution was a major turning point in human history, marked by a profound shift from manual labor to machine-based manufacturing. It began in the mid-18th century in Britain and quickly spread throughout Europe and North America, fundamentally transforming the way goods were produced, distributed, and consumed.</div>
//   <h2 className='pt-5 text-xl font-medium text-gray-800'>Say sike right now</h2>
//   <div className='pt-2 text-justify'>The Industrial Revolution was a major turning point in human history, marked by a profound shift from manual labor to machine-based manufacturing. It began in the mid-18th century in Britain and quickly spread throughout Europe and North America, fundamentally transforming the way goods were produced, distributed, and consumed.</div>
// </div>
