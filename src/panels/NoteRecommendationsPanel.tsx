import React from 'react'

import PanelSkeleton from '../components/view/PanelSkeleton'
import { useGenerateWidgets, useGetWikipediaImage } from '../hooks/api/recommendations'
import { useNoteIdFromUrl } from '../hooks/url'
import { getWikipediaImageNameFromUrl } from '../lib/widget'
import { V1Widget } from '../protorepo/openapi/typescript-axios'

const WidgetListItem: React.FC<{ widget: V1Widget }> = (props) => {
  let keyword = ''
  let type = ''
  let urlRedirect = ''
  let summary = ''
  let imageUrl = ''

  if (props.widget?.websiteWidget != undefined) {
    keyword = props.widget.websiteWidget.keyword
    type = props.widget.websiteWidget.type
    urlRedirect = props.widget.websiteWidget.url
    summary = props.widget.websiteWidget?.summary as string
    imageUrl = props.widget.websiteWidget?.imageUrl as string
  }

  const imageQ = useGetWikipediaImage({ imageUrl: getWikipediaImageNameFromUrl(imageUrl) })

  return (
    <div className='cursor-pointer rounded-md border border-blue-100 bg-gray-50 bg-gradient-to-br p-4 hover:bg-gray-100 hover:shadow-inner'>
      <a href={urlRedirect} target='_blank' rel='noopener noreferrer'>
        { props.widget?.websiteWidget != undefined ? (<div className='flex flex-col'>
          <p className='font-bold'>{keyword}</p>
          <p className='text-gray-700'>{ type }</p>
          <p className='font-normal'>{ summary != '' && summary != undefined ? summary : ''}</p>
          {imageQ.isSuccess ? (<img src={imageQ.data}/>) : (null)}
        </div>) : (null) }
      </a>
    </div>
  )
}

const WidgetListCurrentGroup: React.FC = () => {
  const noteId = useNoteIdFromUrl()

  if (noteId == null) {
    return (
      <div className='my-4 text-center text-sm text-gray-400'>
        <p>{'Your current note haven\'t been found'}</p>
      </div>)
  }

  const listWidgetsQ = useGenerateWidgets({ noteId: noteId })

  return(
    <div className='overflow-y-scroll'>
      <div className='space-y-2'>
        {listWidgetsQ.isSuccess ? (
          !listWidgetsQ.data?.widgets.length ? (
            <div className='my-4 text-center text-sm text-gray-400'>
            You have no widgets for this note
            </div>
          ) : (
            listWidgetsQ.data?.widgets?.map((widget, idx) => (
              <WidgetListItem key={`widget-list-${idx}`} widget={widget} />
            ))
          )
        ) : (
          <div className='my-4 text-center text-sm text-gray-400'>
          Loading your widgets...
          </div>
        )}
      </div>
    </div>
  )
}

const NoteRecommendationsPanel: React.FC = () => {
  return (
    <PanelSkeleton>
      <WidgetListCurrentGroup />
    </PanelSkeleton>
  )
}

export default NoteRecommendationsPanel
