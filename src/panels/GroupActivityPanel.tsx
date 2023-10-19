import {ArrowRightOnRectangleIcon,DocumentPlusIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import PanelSkeleton from '../components/view/PanelSkeleton'
import { useGroupContext } from '../contexts/group'
import { useGetAccount } from '../hooks/api/accounts'
import { useListActivitiesInCurrentGroup } from '../hooks/api/activities'
import { useGetGroup } from '../hooks/api/groups'
import { useGetNoteInCurrentGroup } from '../hooks/api/notes'
import { V1GroupActivity } from '../protorepo/openapi/typescript-axios'

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
  switch(activityType) { 
    case 'ADD-NOTE': { 
      url = `./group/${currentGroupId}/note/${redirectId}`
      break
    } 
    case 'ADD-MEMBER': { 
      url = `./group/${redirectId}`
      break
    }
    case 'REMOVE-MEMBER': {
      url = `./group/${redirectId}`
      break
    }
  }
  return url
}

let nbSameActivity = 0
let indexFirstSameActivity = -1
let lastActivity = ''

const ActivityListItem: React.FC<{ activity: V1GroupActivity, nextActivity?: V1GroupActivity, indexActivity: number, nbActivities: number }> = (props) => {
  const groupContext = useGroupContext()
  const navigate = useNavigate()
  let event
  let redirectId
  let icon

  if (props.indexActivity == 0) {
    //console.log('------------------RESET--------------------')
    nbSameActivity = 0
    indexFirstSameActivity = -1
    lastActivity = ''
  }

  if (lastActivity != props.activity.type) {
    indexFirstSameActivity = -1
  }


  switch(props.activity.type) { 
    case 'ADD-NOTE': {
      event = getAddNoteEvent(props.activity?.event)
      redirectId = getNoteIdInEvent(props.activity?.event)
      icon = <DocumentPlusIcon className='mr-3 h-6 w-6 text-green-400' />
      break
    } 
    case 'ADD-MEMBER': { 
      event = getUpdateOnMemberEvent(props.activity?.event)
      redirectId = getGroupIdInEvent(props.activity?.event)
      icon = <ArrowRightOnRectangleIcon className='mr-3 h-6 w-6 text-green-400' />
      break
    }
    case 'REMOVE-MEMBER': { 
      event = getUpdateOnMemberEvent(props.activity?.event)
      redirectId = getGroupIdInEvent(props.activity?.event)
      icon = <ArrowRightOnRectangleIcon className='mr-3 h-6 w-6 text-red-400' />
      break
    }
  }

  if (props.nextActivity != undefined) {
    if (props.nextActivity.type == props.activity.type) {
      if (indexFirstSameActivity == -1) {
        indexFirstSameActivity = props.indexActivity
      }
      lastActivity = props.activity.type
      return null
    }
  }

  const dateFormat = getDateFormat(props.activity?.createdAt)

  if (indexFirstSameActivity == -1) {
    nbSameActivity = 0
  } else {
    nbSameActivity = (props.indexActivity + 1) - indexFirstSameActivity
  }

  return (
    <div className='group cursor-pointer'>
      {nbSameActivity == 0 ?
        <p></p> :
        <span className='absolute right-0 m-1.5 h-4 w-4 -translate-x-6 rounded-full bg-blue-200 p-0.5 text-center text-xs font-medium leading-none text-white group-hover:bg-blue-400'>
          {nbSameActivity}
        </span>
      }
      <div 
        className='rounded-md border border-gray-100 bg-gray-50 bg-gradient-to-br p-4 group-hover:bg-gray-100 group-hover:shadow-inner'
        onClick={() => navigate(getRoute(props.activity.type, groupContext.groupId as string, redirectId))}
      >
        <div className='flex items-center'>
          <div className='grid grid-flow-col gap-1 p-1'>
            {icon}
          </div>
          <div className='flex flex-col'>
            <p className='font-normal'>{ event }</p>
            <p className='text-gray-700'>{ dateFormat }</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ActivityListCurrentGroup: React.FC = () => {
  const listActivitiesQ = useListActivitiesInCurrentGroup({ limit: 100 })

  return (
    <div className='overflow-y-scroll'>
      <div className='space-y-2'>
        {listActivitiesQ.isSuccess ? (
          !listActivitiesQ.data?.activities?.length ? (
            <div className='my-4 text-center text-sm text-gray-400'>
              No recent activity
            </div>
          ) : (
            listActivitiesQ.data?.activities?.map((activity, idx) => (
              <ActivityListItem key={`activity-list-${activity.id}-${idx}`} activity={activity} nextActivity={listActivitiesQ.data?.activities.at(idx + 1)} indexActivity={idx} nbActivities={listActivitiesQ.data.activities.length} />
            ))
          )
        ) : (
          <div className='my-4 text-center text-sm text-gray-400'>
          Loading your activities...
          </div>
        )}
      </div>
    </div>
  )
}

const GroupActivityPanel: React.FC = () => {
  return (
    <PanelSkeleton>
      <ActivityListCurrentGroup/>
    </PanelSkeleton>
  )
}

export default GroupActivityPanel
