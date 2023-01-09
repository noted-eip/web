import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { InboxIcon } from '@heroicons/react/24/solid'
import React from 'react'
import ViewSkeleton from '../../components/view/ViewSkeleton'
import { useAuthContext } from '../../contexts/auth'
import { useGetGroup } from '../../hooks/api/groups'
import { useAcceptInvite, useDenyInvite, useListInvites } from '../../hooks/api/invites'
import { Invite } from '../../types/api/invites'

const InviteListItem: React.FC<{ invite: Invite }> = props => {
  const getGroupQ = useGetGroup({ group_id: props.invite.group_id })
  const denyInviteQ = useDenyInvite()
  const acceptInviteQ = useAcceptInvite()

  return <div className='h-12 grid grid-cols-3'>
    <div className='flex items-center'>
      <div className='h-9 w-9 bg-gradient-to-br from-orange-300 to-red-300 rounded-md' />
      <div className='font-medium text-sm text-gray-800 pl-3'>
        {
          getGroupQ.isSuccess ? getGroupQ.data.data.group.name : <div className='skeleton w-16 h-4' />
        }
      </div>
    </div>
    <div className='flex items-center text-sm'>
      {
        getGroupQ.isSuccess ? <p className='text-sm text-gray-500'>{getGroupQ.data.data.group.description}</p> : <div className='skeleton w-48 h-4' />
      }
    </div>
    <div className='flex items-center justify-end'>
      {
        getGroupQ.isSuccess && <React.Fragment>
          <div className='flex hover:scale-105 transition-all items-center px-2 p-1 rounded-full text-red-700 font-medium hover:bg-red-200 bg-red-100 text-xs cursor-pointer'
            onClick={() => denyInviteQ.mutate({ invite_id: props.invite.id })}>
            Deny
            <XMarkIcon className='text-red-700 ml-1 h-3 w-3 stroke-[3px]' />
          </div>
          <div className='ml-2 hover:scale-105 transition-all flex items-center px-2 p-1 rounded-full text-green-700 font-medium hover:bg-green-200 bg-green-100 text-xs cursor-pointer'
            onClick={() => acceptInviteQ.mutate({ invite_id: props.invite.id })}>
            Accept
            <CheckIcon className='text-green-700 ml-1 h-3 w-3 stroke-[3px]' />
          </div>
        </React.Fragment>
      }
    </div>
  </div>
}

const ProfileViewInvitesSection: React.FC = () => {
  const authContext = useAuthContext()
  const listInvitesQ = useListInvites({ recipient_account_id: authContext.userID })


  return <div className='p-5 mt-4 w-full bg-gray-50 rounded-md border border-gray-100'>
    {/* Header */}
    <div className='flex items-center justify-between pb-3 border-b border-[#efefef]'>
      <div className='flex items-center'>
        <InboxIcon className='ml-2 text-gray-600 h-5 w-5 mr-2' />
        <p className='text-gray-600 text-md font-medium'>Invites</p>
      </div>
    </div>

    {/* List */}
    <div className='grid grid-cols-1 gap-4 mt-3 w-full'>
      {
        listInvitesQ.isSuccess ?
          !listInvitesQ.data.data.invites ?
            <div className='text-sm text-center mt-2 text-gray-400'>{'You haven\'t been invited to any group'}</div>
            :
            listInvitesQ.data.data.invites?.map((el, idx) => <InviteListItem
              key={`group-member-list-${el.id}-${idx}`}
              invite={el} />)
          :
          <div>
            <div className='skeleton h-6 w-full mt-2 mb-6' />
            <div className='skeleton h-6 w-full' />
          </div>
      }
    </div>
  </div>
}


const ProfileView: React.FC = () => {
  return <ViewSkeleton title='Profile' panels={['group-chat','group-activity']}>
    <div className='mb-lg xl:mb-xl mx-lg xl:mx-xl w-full'>
      <ProfileViewInvitesSection />
    </div>
  </ViewSkeleton>
}

export default ProfileView
