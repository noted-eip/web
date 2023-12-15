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

const AddNoteEvent: React.FC<{ event: string, noteName: string, accountName: string, folderName: string }> = props => {
  //const username = 'Someone'
  //const noteName = 'a note'
  //const folder = ''

  let everything = ''
  let firstPart = ''
  let secondPart = ''

  if (props.event != undefined) {
    everything = props.event
    everything = everything.substring(everything.indexOf('>') + 1, everything.length)
    firstPart = everything.substring(0, everything.indexOf('<'))
    everything = everything.substring(everything.indexOf('>') + 1, everything.length)
    secondPart = everything.substring(0, everything.indexOf('<'))
  }

  return (
    <div className='inline-flex space-x-2'>
      <span>
        <span className='font-bold'>{ props.accountName }</span>
        <span className='font-normal'>{ firstPart }</span>
        <span className='font-bold'>{ props.noteName }</span>
        <span className='font-normal'>{ secondPart }</span>
        <span className='font-normal'>{ props.folderName }</span>
      </span>
    </div>
  )
}

const UpdateOnMemberEvent: React.FC<{ event: string, groupName: string, accountName: string }> = props => {
  //const username = 'Someone'
  //const groupName = 'a group'

  let everything = ''
  let firstPart = ''
  let secondPart = ''

  if (props.event != undefined) {
    everything = props.event
    everything = everything.substring(everything.indexOf('>') + 1, everything.length)
    firstPart = everything.substring(0, everything.indexOf('<'))
    everything = everything.substring(everything.indexOf('>') + 1, everything.length)
    secondPart = everything.substring(0, everything.indexOf('<'))
  }

  return (
    <div className='inline-flex space-x-2'>
      <span>
        <span className='font-bold'>{ props.accountName }</span>
        <span className='font-normal'>{ firstPart }</span>
        <span className='font-bold'>{ props.groupName }</span>
        <span className='font-normal'>{ secondPart }</span>
      </span>
    </div>
  )
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

function getNoteNameFromEvent(event: string) {
  let noteTitle = ''
  const noteId = getNoteIdInEvent(event)
  const getNoteReponse = useGetNoteInCurrentGroup({ noteId: noteId })
  if (getNoteReponse.data?.note.title != undefined) {
    noteTitle = getNoteReponse.data?.note.title
  }
  return noteTitle
}
function getAccountNameFromEvent(event: string)
{
  let accountName = ''
  const userId = event.substring(event.indexOf('<userID:') + 8, event.indexOf('>'))
  const getUserResponse = useGetAccount({ accountId: userId })
  if (getUserResponse.data?.account.name != undefined) {
    accountName = getUserResponse.data?.account.name
  }
  return accountName
}
function getGroupNameFromEvent(event: string)
{
  let groupName = ''
  const groupId = getGroupIdInEvent(event)
  const getGroupReponse = useGetGroup({ groupId: groupId })
  if (getGroupReponse.data?.group.name != undefined) {
    groupName = getGroupReponse.data?.group.name
  }
  return groupName
}

const ActivityListItem: React.FC<{ activity: V1GroupActivity, nextActivity?: V1GroupActivity, indexActivity: number, nbActivities: number }> = (props) => {
  const groupContext = useGroupContext()
  const navigate = useNavigate()
  let redirectId
  let icon

  let noteName = ''
  let accountName = ''
  let groupName = ''
  const folderName = ''

  switch (props.activity.type) { 
    case 'ADD-NOTE': {
      noteName = getNoteNameFromEvent(props.activity?.event)
      accountName = getAccountNameFromEvent(props.activity?.event)
      redirectId = getNoteIdInEvent(props.activity?.event)
      icon = <DocumentPlusIcon className='mr-3 h-6 w-6 text-green-400' />
      break
    }
    case 'ADD-MEMBER': {
      groupName = getGroupNameFromEvent(props.activity?.event)
      accountName = getAccountNameFromEvent(props.activity?.event)
      redirectId = getGroupIdInEvent(props.activity?.event)
      icon = <ArrowRightOnRectangleIcon className='mr-3 h-6 w-6 text-green-400' />
      break
    }
    case 'REMOVE-MEMBER': {
      redirectId = getGroupIdInEvent(props.activity?.event)
      icon = <ArrowRightOnRectangleIcon className='mr-3 h-6 w-6 text-red-400' />
      break
    }
  }

  const dateFormat = getDateFormat(props.activity?.createdAt)

  return (
    <div className='group cursor-pointer'>
      <div 
        className='rounded-md border border-gray-100 bg-gray-50 bg-gradient-to-br p-4 group-hover:bg-gray-100 group-hover:shadow-inner'
        onClick={
          props.activity.type == 'ADD-NOTE' ? 
            noteName.length < 1 ?  
              () => null//pop up
              :
              () => navigate(getRoute(props.activity.type, groupContext.groupId as string, redirectId))
            :
            accountName.length < 1 ? 
              () => null//pop up
              :
              () => navigate(getRoute(props.activity.type, groupContext.groupId as string, redirectId))
        }
      >
        <div className='flex items-center'>
          <div className='grid grid-flow-col gap-1 p-1'>
            {icon}
          </div>
          <div className='flex flex-col'>
            { 
              props.activity.type == 'ADD-NOTE' ?
                <AddNoteEvent event={props.activity?.event} noteName={noteName} accountName={accountName} folderName={folderName} /> :
                <UpdateOnMemberEvent event={props.activity?.event} groupName={groupName} accountName={accountName}/> 
            }
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
            listActivitiesQ.data?.activities?.slice(0).reverse().map((activity, idx) => (
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