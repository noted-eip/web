import { NoteAdd, PersonAdd, PersonRemove } from '@mui/icons-material'
import Lottie from 'lottie-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import emptyAnim from '../assets/animations/empty-box.json'
import processAnim from '../assets/animations/process.json'
import PanelSkeleton from '../components/view/PanelSkeleton'
import { useGroupContext } from '../contexts/group'
import { useGetAccount } from '../hooks/api/accounts'
import { useListActivitiesInCurrentGroup } from '../hooks/api/activities'
import { useGetGroup } from '../hooks/api/groups'
import { useGetNoteInCurrentGroup } from '../hooks/api/notes'
import { FormatMessage } from '../i18n/TextComponent'
import { V1GroupActivity, V1ListActivitiesResponse } from '../protorepo/openapi/typescript-axios'

function getNoteIdInEvent(event: string) {
  let noteId = ''
  if (event != undefined) {
    const subStringFirstEvent = event.substring(
      event.indexOf('>') + 1,
      event.length)
    noteId = subStringFirstEvent.substring(
      subStringFirstEvent.indexOf('<noteID:') + 8,
      subStringFirstEvent.indexOf('>'))
  }
  return noteId
}

function getGroupIdInEvent(event: string) {
  let groupId = ''
  if (event != undefined) {
    const subStringFirstEvent = event.substring(
      event.indexOf('>') + 1,
      event.length)
    groupId = subStringFirstEvent.substring(
      subStringFirstEvent.indexOf('<groupID:') + 9,
      subStringFirstEvent.indexOf('>'))
  }
  return groupId
}

function getAddNoteEvent(event: string) {
  let username = 'Someone'
  let noteTitle = 'a note'
  const folder = ''

  let everything = ''
  let firstPart = ''
  let secondPart = ''

  if (event != undefined) {

    everything = event
    everything = everything.substring(everything.indexOf('>') + 1, everything.length)
    firstPart = everything.substring(0, everything.indexOf('<'))
    everything = everything.substring(everything.indexOf('>') + 1, everything.length)
    secondPart = everything.substring(0, everything.indexOf('<'))

    const userId = event.substring(event.indexOf('<userID:') + 8, event.indexOf('>'))
    const getUserResponse = useGetAccount({ accountId: userId })
    if (getUserResponse.data?.account.name != undefined) {
      username = getUserResponse.data?.account.name
    }

    const noteId = getNoteIdInEvent(event)
    const getNoteReponse = useGetNoteInCurrentGroup({ noteId: noteId })
    if (getNoteReponse.data?.note.title != undefined) {
      noteTitle = getNoteReponse.data?.note.title
    }
  }
  return (username + firstPart + noteTitle + secondPart + folder)
}

function getUpdateOnMemberEvent(event: string) {
  let username = 'Mr.Smith'
  let groupName = 'a mysterious group'

  let everything = ''
  let firstPart = ''
  let secondPart = ''

  if (event != undefined) {

    everything = event
    everything = everything.substring(everything.indexOf('>') + 1, everything.length)
    firstPart = everything.substring(0, everything.indexOf('<'))
    everything = everything.substring(everything.indexOf('>') + 1, everything.length)
    secondPart = everything.substring(0, everything.indexOf('<'))

    const userId = event.substring(event.indexOf('<userID:') + 8, event.indexOf('>'))
    const getUserResponse = useGetAccount({ accountId: userId })
    if (getUserResponse.data?.account.name != undefined) {
      username = getUserResponse.data?.account.name
    }

    const groupId = getGroupIdInEvent(event)
    const getGroupReponse = useGetGroup({ groupId: groupId })
    if (getGroupReponse.data?.group.name != undefined) {
      groupName = getGroupReponse.data?.group.name
    }
  }
  return (username + firstPart + groupName + secondPart)
}

function getDateFormat(unformatedDate: string) {
  let everything = ''
  let date = ''
  let time = ''

  if (unformatedDate != undefined) {
    everything = unformatedDate
    date = everything.substring(0, everything.indexOf('T'))
    everything = everything.substring(everything.indexOf('T') + 1, everything.length)
    time = everything.substring(0, everything.indexOf('.'))
  }
  return ('The ' + date + ' at ' + time + '.')
}

function getRoute(activityType: string, currentGroupId: string, redirectId: string) {
  let url
  switch (activityType) {
    case 'ADD-NOTE': {
      url = `/group/${currentGroupId}/note/${redirectId}`
      break
    }
    case 'ADD-MEMBER': {
      url = `/group/${redirectId}`
      break
    }
    case 'REMOVE-MEMBER': {
      url = `/group/${redirectId}`
      break
    }
  }
  return url
}

const ActivityListItem: React.FC<{ activity: V1GroupActivity }> = (props) => {
  const groupContext = useGroupContext()
  const navigate = useNavigate()
  let event
  let redirectId

  switch (props.activity.type) {
    case 'ADD-NOTE': {
      event = getAddNoteEvent(props.activity?.event)
      redirectId = getNoteIdInEvent(props.activity?.event)
      break
    }
    case 'ADD-MEMBER': {
      event = getUpdateOnMemberEvent(props.activity?.event)
      redirectId = getGroupIdInEvent(props.activity?.event)
      break
    }
    case 'REMOVE-MEMBER': {
      event = getUpdateOnMemberEvent(props.activity?.event)
      redirectId = getGroupIdInEvent(props.activity?.event)
      break
    }
  }

  const dateFormat = getDateFormat(props.activity?.createdAt)

  const handleNavigation = () => {
    navigate(getRoute(props.activity.type, groupContext.groupId as string, redirectId))
    window.location.reload()
  }

  const getIcon = () => {
    if (props.activity.type === 'ADD-NOTE') {
      return (<NoteAdd className='mr-2' />)
    } else if (props.activity.type === 'ADD-MEMBER') {
      return (<PersonAdd className='mr-2' />)
    } else {
      return (<PersonRemove className='mr-2' />)
    }
  }

  return (
    <div
      className='cursor-pointer rounded-md border border-gray-100 bg-gray-50 bg-gradient-to-br p-4 hover:bg-gray-100 hover:shadow-inner'
      onClick={handleNavigation}
    >
      <div className='flex items-center'>
        {getIcon()}
        <div className='flex flex-col'>
          <p className='font-normal'>{event}</p>
          <div className='flex flex-col'>
            <div>
              <p className='text-gray-700'>{dateFormat}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ActivityListCurrentGroup: React.FC<{groupId: string}> = (prop) => {
  const [newListActivities, setNewActivities] = React.useState<V1GroupActivity[]>([])
  const listActivitiesQ = useListActivitiesInCurrentGroup({ limit: 100 }, {
    onSuccess: (data: V1ListActivitiesResponse) => {
      console.log('data', data)
      // setNewActivities([data.activities, ...newListActivities])
    },
    onError: (e) => {
      const errorActivity: V1GroupActivity = {
        id: `tmp-id-${newListActivities.length}`,
        groupId: prop.groupId,
        type: '',
        event: '',
        createdAt: '',
      }
      setNewActivities([errorActivity, ...newListActivities])
      console.error('chat', e)
    }})

  return (
    <div className={`h-full overflow-y-scroll ${(!listActivitiesQ.isSuccess || (listActivitiesQ.isSuccess && !listActivitiesQ.data?.activities?.length)) && 'flex items-center justify-center'} lg:px-lg lg:pb-lg xl:px-xl xl:pb-xl`}>
      <div className='my-4 space-y-2 text-center'>
        {listActivitiesQ.isSuccess ? (
          !listActivitiesQ.data?.activities?.length ? (
            <>
              <FormatMessage id='PANEL.activity.none' />
              <Lottie
                animationData={emptyAnim}
                loop
                autoplay
                className='h-full w-full'
              />
            </>
          ) : (
            listActivitiesQ.data?.activities?.map((activity, idx) => (
              <ActivityListItem key={`activity-list-${activity.id}-${idx}`} activity={activity} />
            ))
          )
        ) : (
          <>
            <FormatMessage id='PANEL.activity.loading' />
            <Lottie
              animationData={listActivitiesQ.isLoading ? processAnim : emptyAnim}
              loop
              autoplay
              className='h-full w-full'
            />
          </>
        )}
      </div>
    </div>
  )
}

const ActivityListNoGroup: React.FC = () => {
  return (
    <div className='flex h-full items-center justify-center overflow-y-scroll lg:px-lg lg:pb-lg xl:px-xl xl:pb-xl'>
      <div className='my-4 space-y-2 text-center'>
        <FormatMessage id='PANEL.activity.noGroup' />
        <Lottie
          animationData={emptyAnim}
          loop
          autoplay
          className='h-full w-full'
        />
      </div>
    </div>
  )
}

const GroupActivityPanel: React.FC = () => {
  const groupContext = useGroupContext()
  const currentGroupId: string = groupContext.groupId as string

  return (
    <PanelSkeleton>
      {currentGroupId ? <ActivityListCurrentGroup groupId={currentGroupId} /> : <ActivityListNoGroup />}
    </PanelSkeleton>
  )
}

export default GroupActivityPanel
