import React from 'react'
import ViewSkeleton from '../../components/view/ViewSkeleton'

const NoteViewHeader: React.FC = () => {
  return <div className='flex items-center justify-center'>
    <div className='flex h-8 w-8 items-center justify-center rounded-md bg-gray-100'>📝</div>
    <div className='ml-2 w-96 rounded-md px-1 text-lg font-medium text-gray-600 ring-blue-200 focus:outline-none focus:ring-2' contentEditable>World War II</div>
  </div>
}

const NoteView: React.FC = () => {
  return <ViewSkeleton titleElement={<NoteViewHeader />} panels={['group-chat', 'group-activity', 'note-recommendations']}>
    <div className='px-lg pb-lg focus:outline-none xl:px-xl xl:pb-2xl' >
      {/* Heading 1 */}
      <h1 className='pt-8 text-3xl font-medium text-gray-800 first:pt-0'>The Pre-Industrial Era</h1>
      {/* Paragraph */}
      <div className='pt-2 text-justify'>The Industrial Revolution was a major turning point in human history, marked by a profound shift from manual labor to machine-based manufacturing. It began in the mid-18th century in Britain and quickly spread throughout Europe and North America, fundamentally transforming the way goods were produced, distributed, and consumed.</div>
      <div className='pt-2 text-justify'> The Industrial Revolution brought about numerous technological innovations, such as the steam engine and mechanized textile production, which dramatically increased the efficiency and productivity of factories.</div>
      {/* Heading 2 */}
      <h2 className='pt-6 text-2xl font-medium text-gray-800'>Cottage industries and handicraft production</h2>
      <div className='pt-2 text-justify'>The Industrial Revolution was a major turning point in human history, marked by a profound shift from manual labor to machine-based manufacturing. It began in the mid-18th century in Britain and quickly spread throughout Europe and North America, fundamentally transforming the way goods were produced, distributed, and consumed.</div>
      {/* Heading 3 */}
      <h2 className='pt-5 text-xl font-medium text-gray-800'>Limitations of pre-industrial production</h2>
      <div className='pt-2 text-justify'>The Industrial Revolution was a major turning point in human history, marked by a profound shift from manual labor to machine-based manufacturing. It began in the mid-18th century in Britain and quickly spread throughout Europe and North America, fundamentally transforming the way goods were produced, distributed, and consumed.</div>
      {/* Heading 3 */}
      <h2 className='pt-5 text-xl font-medium text-gray-800'>Some other headline thing</h2>
      <div className='pt-2 text-justify'>The Industrial Revolution was a major turning point in human history, marked by a profound shift from manual labor to machine-based manufacturing. It began in the mid-18th century in Britain and quickly spread throughout Europe and North America, fundamentally transforming the way goods were produced, distributed, and consumed.</div>
      {/* Heading 3 */}
      <h2 className='pt-5 text-xl font-medium text-gray-800'>Say sike right now</h2>
      <div className='pt-2 text-justify'>The Industrial Revolution was a major turning point in human history, marked by a profound shift from manual labor to machine-based manufacturing. It began in the mid-18th century in Britain and quickly spread throughout Europe and North America, fundamentally transforming the way goods were produced, distributed, and consumed.</div>
    </div>
  </ViewSkeleton>
}

export default NoteView
