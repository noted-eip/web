import { getAnalytics, logEvent } from 'firebase/analytics'
import React from 'react'

import ViewSkeleton from '../../components/view/ViewSkeleton'
import { useAuthContext } from '../../contexts/auth'
import { TPanelKey } from '../../contexts/panel'
import {  useGetGroup } from '../../hooks/api/groups'
import { axiosRequestOptionsWithAuthorization } from '../../hooks/api/helpers'
import { useGetNoteInCurrentGroup } from '../../hooks/api/notes'
import { useGroupIdFromUrl, useNoteIdFromUrl } from '../../hooks/url'
import { TOGGLE_DEV_FEATURES } from '../../lib/env'
import {NoteViewMetadataHeader} from './NoteMetadataHeader'
import NoteViewEditor from './NoteViewEditor'
import NoteViewHeader from './NoteViewHeader'


function editorLoadingSkeleton(): React.ReactElement<unknown, string> | null {
  return <div className='m-lg grid gap-2 opacity-50 xl:m-xl'>
    <div className='skeleton mb-2 h-6 w-96' />
    <div className='skeleton h-4 w-full' />
    <div className='skeleton h-4 w-full' />
    <div className='skeleton h-4 w-full' />
    <div className='skeleton h-4 w-2/3 ' />
    <div className='skeleton mb-2 mt-6 h-6 w-96' />
    <div className='skeleton h-4 w-full' />
    <div className='skeleton h-32 w-full opacity-50' />
  </div>
}

const NoteView: React.FC = () => {
  const analytics = getAnalytics()
  const noteId = useNoteIdFromUrl()
  const noteQuery = useGetNoteInCurrentGroup({ noteId })
  const [isLoading, setIsLoading] = React.useState(true)
  const group = useGetGroup({groupId: useGroupIdFromUrl()})


  const authContext = useAuthContext()
  React.useEffect(() => {
    const res = axiosRequestOptionsWithAuthorization(authContext)
  }, [])


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
  }, [noteId])

  if (!TOGGLE_DEV_FEATURES) {
    logEvent(analytics, 'page_view', {
      page_title: 'note_page'
    })
  }

  const panelKeys: TPanelKey[] = ['group-activity', 'note-recommendations', 'note-quizs']
  return (
    <ViewSkeleton titleElement={<NoteViewHeader />} panels={panelKeys.concat((group.isLoading == true || ((group.data?.group.workspaceAccountId?.length ?? 0) > 0)) ? [] : ['block-comments'])}>
      <div className='w-full'>
        <NoteViewMetadataHeader />
        <div className='p-2'/>
        {isLoading ? (
          editorLoadingSkeleton()
        ) : (
          noteQuery.data && <NoteViewEditor note={noteQuery.data.note} />
        )}
      </div>
    </ViewSkeleton>
  )
}

export default NoteView
