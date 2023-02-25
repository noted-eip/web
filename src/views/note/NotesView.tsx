import React from 'react'
import ContentEditable from 'react-contenteditable'
import ViewSkeleton from '../../components/view/ViewSkeleton'
import { useGetNoteInCurrentGroup, useUpdateNoteInCurrentGroup } from '../../hooks/api/notes'
import { V1Note } from '../../protorepo/openapi/typescript-axios'

const NoteViewHeader: React.FC = () => {
  const [latestTitle, setLatestTitle] = React.useState<string>()
  const noteId = location.pathname.split('/')[4]
  const getNoteQ = useGetNoteInCurrentGroup({ noteId })
  const updateNoteQ = useUpdateNoteInCurrentGroup()
  const text = React.useRef<string | undefined>()

  React.useEffect(() => {
    if (getNoteQ.isSuccess && !text.current) {
      text.current = getNoteQ.data.note.title
      setLatestTitle(getNoteQ.data.note.title)
    }
  }, [getNoteQ])

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
          className='ml-2 w-96 rounded-md px-1 text-lg font-medium text-gray-600 ring-blue-200 focus:outline-none focus:ring-2'
          html={text.current}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          contentEditable />
        :
        <div className='skeleton ml-2 h-4 w-32' />
    }
  </div>
}

const NoteView: React.FC = () => {
  return <ViewSkeleton titleElement={<NoteViewHeader />} panels={['group-chat', 'group-activity', 'note-recommendations']}>
    {/* <div className='px-lg pb-lg focus:outline-none xl:px-xl xl:pb-2xl' >
      <h1 className='pt-8 text-3xl font-medium text-gray-800 first:pt-0'>The Pre-Industrial Era</h1>
      <div className='pt-2 text-justify'>The Industrial Revolution was a major turning point in human history, marked by a profound shift from manual labor to machine-based manufacturing. It began in the mid-18th century in Britain and quickly spread throughout Europe and North America, fundamentally transforming the way goods were produced, distributed, and consumed.</div>
      <div className='pt-2 text-justify'> The Industrial Revolution brought about numerous technological innovations, such as the steam engine and mechanized textile production, which dramatically increased the efficiency and productivity of factories.</div>
      <h2 className='pt-6 text-2xl font-medium text-gray-800'>Cottage industries and handicraft production</h2>
      <div className='pt-2 text-justify'>The Industrial Revolution was a major turning point in human history, marked by a profound shift from manual labor to machine-based manufacturing. It began in the mid-18th century in Britain and quickly spread throughout Europe and North America, fundamentally transforming the way goods were produced, distributed, and consumed.</div>
      <h2 className='pt-5 text-xl font-medium text-gray-800'>Limitations of pre-industrial production</h2>
      <div className='pt-2 text-justify'>The Industrial Revolution was a major turning point in human history, marked by a profound shift from manual labor to machine-based manufacturing. It began in the mid-18th century in Britain and quickly spread throughout Europe and North America, fundamentally transforming the way goods were produced, distributed, and consumed.</div>
      <h2 className='pt-5 text-xl font-medium text-gray-800'>Some other headline thing</h2>
      <div className='pt-2 text-justify'>The Industrial Revolution was a major turning point in human history, marked by a profound shift from manual labor to machine-based manufacturing. It began in the mid-18th century in Britain and quickly spread throughout Europe and North America, fundamentally transforming the way goods were produced, distributed, and consumed.</div>
      <h2 className='pt-5 text-xl font-medium text-gray-800'>Say sike right now</h2>
      <div className='pt-2 text-justify'>The Industrial Revolution was a major turning point in human history, marked by a profound shift from manual labor to machine-based manufacturing. It began in the mid-18th century in Britain and quickly spread throughout Europe and North America, fundamentally transforming the way goods were produced, distributed, and consumed.</div>
    </div> */}
  </ViewSkeleton>
}

export default NoteView
