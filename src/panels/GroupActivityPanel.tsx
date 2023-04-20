import React from 'react'

import PanelSkeleton from '../components/view/PanelSkeleton'
//import { useAuthContext } from '../contexts/auth'
import { useGetAccount } from '../hooks/api/accounts'
import { useListActivities } from '../hooks/api/activities'
import { /*useListGroups, */ useGetCurrentGroup,useGetGroup } from '../hooks/api/groups'
import { useGetNoteInCurrentGroup/*, useGetCurrentGroup*/ } from '../hooks/api/notes'
import { V1Group, V1GroupActivity } from '../protorepo/openapi/typescript-axios'

//<p className='hover:underline'> zebi </p>

function getAddNoteEvent(event: string) {
  let username = 'someone'
  let noteTitle = 'a note'
  const folder = 'x'
 
  let everything = ''
  let firstPart = ''
  let secondPart = ''
  
  if (event != undefined) {
    
    everything = event
    everything = everything.substring(everything.indexOf('>') + 1, everything.length)
    firstPart = everything.substring(0, everything.indexOf('<'))
    everything = everything.substring(everything.indexOf('>') + 1, everything.length)
    secondPart = everything.substring(0, everything.indexOf('<'))

    const userId = event.substring(
      event.indexOf('<userID:') + 8, 
      event.indexOf('>'))
    const getUserResponse = useGetAccount({ accountId: userId })
    if (getUserResponse.data?.account.name != undefined) {
      username = getUserResponse.data?.account.name
    }

    const subStringFirstEvent = event.substring(
      event.indexOf('>') + 1, 
      event.length)
    const noteId = subStringFirstEvent.substring(
      subStringFirstEvent.indexOf('<noteID:') + 8, 
      subStringFirstEvent.indexOf('>'))
    const getNoteReponse = useGetNoteInCurrentGroup({ noteId: noteId })
    if (getNoteReponse.data?.note.title != undefined) {
      noteTitle = getNoteReponse.data?.note.title
    }
  }
  return username + firstPart + noteTitle + secondPart + folder
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

    const userId = event.substring(
      event.indexOf('<userID:') + 8, 
      event.indexOf('>'))
    const getUserResponse = useGetAccount({ accountId: userId })
    if (getUserResponse.data?.account.name != undefined) {
      username = getUserResponse.data?.account.name
    }

    const subStringFirstEvent = event.substring(
      event.indexOf('>') + 1, 
      event.length)
    const groupId = subStringFirstEvent.substring(
      subStringFirstEvent.indexOf('<groupID:') + 8, 
      subStringFirstEvent.indexOf('>'))
    const getGroupReponse = useGetGroup({ groupId: groupId })
    if (getGroupReponse.data?.group.name != undefined) {
      groupName = getGroupReponse.data?.group.name
    }
  }
  return username + firstPart + groupName + secondPart
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
  return 'The ' + date + ' at ' + time + '.'
}

const NotificationListItem: React.FC<{ activity: V1GroupActivity, group: V1Group }> = (props) => {
  let event = 'Error on event loading.'

  switch(props.activity.type) { 
    case 'ADD-NOTE': { 
      event = getAddNoteEvent(props.activity?.event)
      break
    } 
    case 'ADD-MEMBER': { 
      event = getUpdateOnMemberEvent(props.activity?.event)
      break
    }
    case 'REMOVE-MEMBER': { 
      event = getUpdateOnMemberEvent(props.activity?.event)
      break
    }
  }

  const dateFormat = getDateFormat(props.activity?.createdAt)

  return (
    <div className='rounded-md border border-gray-100 bg-gray-50 bg-gradient-to-br p-4'>
      <div className='flex items-center'>
        {/*<div className='group mr-4 h-16 w-16 rounded-md bg-gradient-radial from-teal-300 to-green-200'>
          <div className='hidden h-full w-full cursor-pointer items-center justify-center rounded-md bg-[rgba(255,255,255,0.2)] group-hover:flex'>
            <ArrowPathIcon className='hidden h-6 w-6 stroke-2 text-gray-500 group-hover:block' />
          </div>
        </div>*/}
        <div className='flex flex-col'>
          <React.Fragment>
            <p className='font-normal'>{ event }</p>
          </React.Fragment>
          <div className='flex flex-col'>
            <React.Fragment>
              <div>
                <p className='text-gray-700'>{ dateFormat }</p>
              </div>
            </React.Fragment>
          </div>
        </div>
      </div>
    </div>
  )
}

const NotificationListCurrentGroup: React.FC = () => {
  const groupResponse = useGetCurrentGroup()
  const group = groupResponse.data?.group

  if (group == undefined) {
    return (<div><p>Your current group haven&apost been found</p></div>)
  }

  const listActivitiesQ = useListActivities({ groupId: group.id as string, limit: 20 })

  return (
    <div className='overflow-y-scroll'>
      <div className='space-y-2'>
        {listActivitiesQ.isSuccess ? (
          !listActivitiesQ.data?.activities?.length ? (
            <div className='my-4 text-center text-sm text-gray-400'>
            You have no activities in group {group.name} of id {group.id}
            </div>
          ) : (
            listActivitiesQ.data?.activities?.map((activity, idx) => (
              <NotificationListItem key={`activity-list-${activity.id}-${idx}`} activity={activity} group={group} />
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

/*
const NotificationListGroups: React.FC = () => {
  const authContext = useAuthContext()
  const listGroups = useListGroups({ accountId: authContext.accountId})
  const groups = listGroups.data?.groups
  //console.log('Groups : ', groups)

  if (groups == undefined) {
    return (<div><p>You are in any groups</p></div>)
  }

  const frontArrayOfElem = groups.map((group, idx) => {
    
    const listActivitiesQ = useListActivities({ groupId: group?.id as string, limit: 20 })

    return (
      <div className='overflow-y-scroll' key={`group-activity-list-${group.id}-${idx}`}>
        {listActivitiesQ.isSuccess ? (
          !listActivitiesQ.data?.activities?.length ? (
            <div className='my-4 text-center text-sm text-gray-400'>
              You have no activities in group {group.name} of id {group.id}
            </div>
          ) : (
            listActivitiesQ.data?.activities?.map((activity, idx) => (
              <NotificationListItem key={`activity-list-${activity.id}-${idx}`} activity={activity} group={group} />
            ))
          )
        ) : (
          <div className='my-4 text-center text-sm text-gray-400'>
            Loading your activities...
          </div>
        )}
      </div>
    )
  })

  return (
    <div>
      {frontArrayOfElem}
    </div>
  )
}
*/

const GroupActivityPanel: React.FC = () => {
  return (
    <PanelSkeleton>
      <NotificationListCurrentGroup />
    </PanelSkeleton>
  )
}

export default GroupActivityPanel
