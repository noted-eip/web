import React from 'react'

import PanelSkeleton from '../components/view/PanelSkeleton'
import { useGenerateWidgets } from '../hooks/api/recommendations'
import { useNoteIdFromUrl } from '../hooks/url'
import { V1Widget } from '../protorepo/openapi/typescript-axios'

const WidgetListItem: React.FC<{ widget: V1Widget }> = (props) => {
  let keyword = ''
  let type = ''
  let urlRedirect = ''
  let summary = ''
  let imageUrl = ''

  if (props.widget?.definitionWidget != undefined) {
    console.log('->is definition widget')
  } else if (props.widget?.imageWidget != undefined) {
    console.log('->is image widget')
  } else if (props.widget?.websiteWidget != undefined) {
    console.log('->is website widget')
    keyword = props.widget.websiteWidget.keyword
    type = props.widget.websiteWidget.type
    urlRedirect = props.widget.websiteWidget.url
    summary = props.widget.websiteWidget?.summary as string
    imageUrl = props.widget.websiteWidget?.imageUrl as string
  }

  return (
    <div className='cursor-pointer rounded-md border border-blue-100 bg-gray-50 bg-gradient-to-br p-4 hover:bg-gray-100 hover:shadow-inner'>
      <a href={urlRedirect} target='_blank' rel='noopener noreferrer'>
        <div className='flex flex-col'>
          <React.Fragment>
            <p className='font-bold'>{ keyword }</p>
          </React.Fragment>
          <React.Fragment>
            <p className='text-gray-700'>{ type }</p>
          </React.Fragment>
          <React.Fragment>
            <p className='font-normal'>{ summary != '' && summary != undefined ? summary : ''}</p>
          </React.Fragment>
          <React.Fragment>
            <img src={ imageUrl != '' && imageUrl != undefined ? imageUrl : ''}/>
          </React.Fragment>
        </div>
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
            You have no widgets in note of id {noteId}
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
