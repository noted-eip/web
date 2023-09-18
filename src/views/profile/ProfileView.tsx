import { ArrowPathIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { ExclamationTriangleIcon, InboxIcon, PencilIcon } from '@heroicons/react/24/solid'
import { getAnalytics, logEvent } from 'firebase/analytics'
import React from 'react'

import LoaderIcon from '../../components/icons/LoaderIcon'
import ViewSkeleton from '../../components/view/ViewSkeleton'
import { useAuthContext } from '../../contexts/auth'
import { useDeleteMyAccount, useGetAccount, useUpdateMyAccount } from '../../hooks/api/accounts'
import { useGetGroup } from '../../hooks/api/groups'
import { useAcceptInvite, useDenyInvite, useListInvites } from '../../hooks/api/invites'
import useClickOutside from '../../hooks/click'
import { V1Account, V1GroupInvite } from '../../protorepo/openapi/typescript-axios'

const InviteListItem: React.FC<{ invite: V1GroupInvite }> = (props) => {
  const getGroupQ = useGetGroup({ groupId: props.invite.groupId as string })
  const denyInviteQ = useDenyInvite()
  const acceptInviteQ = useAcceptInvite()

  const analytics = getAnalytics()
  
  logEvent(analytics, 'page_view', {
    page_title: 'profile'
  })
  return (
    <div className='my-2 grid h-12 grid-cols-3'>
      <div className='flex items-center'>
        <div className='h-9 w-9 rounded-md bg-gradient-to-br from-orange-300 to-red-300' />
        <div className='pl-3 text-sm font-medium text-gray-800'>
          {getGroupQ.isSuccess ? (
            getGroupQ.data.group.name
          ) : (
            <div className='skeleton h-4 w-16' />
          )}
        </div>
      </div>
      <div className='flex items-center text-sm'>
        {getGroupQ.isSuccess ? (
          <p className='text-sm text-gray-500'>{getGroupQ.data.group.description}</p>
        ) : (
          <div className='skeleton h-4 w-48' />
        )}
      </div>
      <div className='flex items-center justify-end'>
        {getGroupQ.isSuccess && (
          <React.Fragment>
            <button
              disabled={denyInviteQ.isLoading || acceptInviteQ.isLoading}
              className='group flex cursor-pointer items-center rounded-full bg-red-100 p-1 px-3 text-xs font-medium text-red-700 hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-700'
              onClick={() => denyInviteQ.mutate({ groupId: props.invite?.groupId as string, inviteId: props.invite.id })}
            >
              Deny
              {
                denyInviteQ.isLoading ?
                  <LoaderIcon className='ml-1 h-3 w-3' />
                  :
                  <XMarkIcon className='ml-1 h-3 w-3 stroke-[3px] text-red-700 transition-all group-hover:scale-[120%] group-disabled:text-gray-700' />
              }
              
            </button>
            <button
              disabled={denyInviteQ.isLoading || acceptInviteQ.isLoading}
              className='group ml-2 flex cursor-pointer items-center rounded-full bg-green-100 p-1 px-3 text-xs font-medium text-green-700 hover:bg-green-200 disabled:bg-gray-100 disabled:text-gray-700'
              onClick={() => acceptInviteQ.mutate({ groupId: props.invite.groupId as string, inviteId: props.invite.id })}
            >
              Accept
              {
                acceptInviteQ.isLoading ?
                  <LoaderIcon className='ml-1 h-3 w-3' />
                  :
                  <CheckIcon className='ml-1 h-3 w-3 stroke-[3px] text-green-700 transition-all group-hover:scale-[120%] group-disabled:text-gray-700' />
              }
            </button>
          </React.Fragment>
        )}
      </div>
    </div>
  )
}

const ProfileViewPendingInvitesSection: React.FC = () => {
  const authContext = useAuthContext()
  const listInvitesQ = useListInvites({ recipientAccountId: authContext.accountId })

  return (
    <div className='mt-4 w-full rounded-md border border-gray-100 bg-gray-50'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-[#efefef] p-5'>
        <div className='flex items-center'>
          <InboxIcon className='mr-2 h-5 w-5 text-gray-600' />
          <p className='text-base font-medium text-gray-600'>Invites</p>
        </div>
      </div>

      {/* List */}
      <div className='grid w-full grid-cols-1 gap-4 px-5'>
        {listInvitesQ.isSuccess ? (
          !listInvitesQ.data.invites?.length ? (
            <div className='my-4 text-center text-sm text-gray-400'>
              You haven&rsquo;t been invited to any group
            </div>
          ) : (
            listInvitesQ.data.invites?.map((el, idx) => (
              <InviteListItem key={`group-member-list-${el.id}-${idx}`} invite={el} />
            ))
          )
        ) : (
          <div>
            <div className='skeleton my-6 h-6 w-full' />
            <div className='skeleton mb-6 h-6 w-full' />
          </div>
        )}
      </div>
    </div>
  )
}

const ProfileViewAccountSection: React.FC = () => {
  const authContext = useAuthContext()
  const [editName, setEditName] = React.useState(false)
  const [newName, setNewName] = React.useState<string | undefined>(undefined)
  const updateAccountQ = useUpdateMyAccount()
  const getAccountQ = useGetAccount({accountId: authContext.accountId})
  const newNameInputRef = React.createRef<HTMLInputElement>()

  useClickOutside(newNameInputRef, () => {
    setEditName(false)
  })

  React.useEffect(() => {
    if (newName === undefined || !editName) {
      setNewName(getAccountQ.isSuccess ? getAccountQ.data.account.name : '')
    }
  }, [getAccountQ])

  const onChangeName = (e) => {
    e.preventDefault()
    updateAccountQ.mutate({body: {name: newName} as V1Account})
    setEditName(false)
  }

  return (
    <div className='rounded-md border border-gray-100 bg-gray-50 bg-gradient-to-br p-4'>
      <div className='flex items-center'>
        <div className='group mr-4 h-16 w-16 rounded-md bg-gradient-radial from-teal-300 to-green-200'>
          <div className='hidden h-full w-full cursor-pointer items-center justify-center rounded-md bg-[rgba(255,255,255,0.2)] group-hover:flex'>
            <ArrowPathIcon className='hidden h-6 w-6 stroke-2 text-gray-500 group-hover:block' />
          </div>
        </div>
        <div className='flex flex-col'>
          {getAccountQ.isSuccess ? (
            <React.Fragment>
              <div
                className='group flex h-8 cursor-pointer items-center'
                onClick={() => {
                  setEditName(true)
                }}
              >
                {editName ? (
                  <form onSubmit={onChangeName}>
                    <input
                      ref={newNameInputRef}
                      autoFocus
                      className='ml-[-5px] w-48 rounded border-gray-200 bg-white px-1 py-0 font-medium'
                      type='text'
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                    <button type='submit' />
                  </form>
                ) : (
                  <React.Fragment>
                    <p className='font-medium'>{getAccountQ.data?.account.name}</p>
                    <PencilIcon className='ml-2 hidden h-4 w-4 stroke-2 text-gray-400 group-hover:block' />
                  </React.Fragment>
                )}
              </div>
              <div>
                <p className='text-gray-700'>{getAccountQ?.data.account.email}</p>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className='skeleton h-4 w-48'></div>
              <div className='skeleton mt-4 h-4 w-64'></div>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  )
}

const ProfileViewDangerZoneSection: React.FC = () => {
  const deleteAccountQ = useDeleteMyAccount()

  return (
    <div className='mt-4 w-full rounded-md border border-gray-100 bg-gray-50'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-[#efefef] p-5'>
        <div className='flex items-center'>
          <ExclamationTriangleIcon className='mr-2 h-5 w-5 text-red-700' />
          <p className='text-base font-medium text-red-700'>Danger Zone</p>
        </div>
      </div>

      <div className='grid grid-cols-[40%_60%] p-5'>
        <div>
          <p className='mb-2 text-sm font-medium text-gray-800'>Delete my account</p>
          <p className='text-xs text-gray-600'>This has the effect of permanently deleting all of your personal data including your notes.</p>
        </div>
        <div className='flex items-center justify-end'>
          <button
            className='rounded-md border border-gray-300 bg-white p-2 px-3 text-sm text-red-600 transition-all duration-100 hover:border-red-600 hover:bg-red-600 hover:text-white'
            onClick={() => {deleteAccountQ.mutate(undefined)}}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}

const ProfileView: React.FC = () => {
  return (
    <ViewSkeleton title='Profile' panels={['group-chat', 'group-activity']}>
      <div className='mx-lg mb-lg w-full xl:mx-xl xl:mb-xl'>
        <ProfileViewAccountSection />
        <ProfileViewPendingInvitesSection />
        <ProfileViewDangerZoneSection />
      </div>
    </ViewSkeleton>
  )
}

export default ProfileView
