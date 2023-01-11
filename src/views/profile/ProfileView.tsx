import { useGetAccount, useUpdateAccount } from '../../hooks/api/accounts'
import useClickOutside from '../../hooks/click'
import {PencilIcon} from '@heroicons/react/24/solid'
import ViewSkeleton from '../../components/view/ViewSkeleton'
import { ArrowPathIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { InboxIcon } from '@heroicons/react/24/solid'
import React from 'react'
import { useAuthContext } from '../../contexts/auth'
import { useGetGroup } from '../../hooks/api/groups'
import { useAcceptInvite, useDenyInvite, useListInvites } from '../../hooks/api/invites'
import { Invite } from '../../types/api/invites'

const InviteListItem: React.FC<{ invite: Invite }> = props => {
  const getGroupQ = useGetGroup({ group_id: props.invite.group_id })
  const denyInviteQ = useDenyInvite()
  const acceptInviteQ = useAcceptInvite()

  return <div className='h-12 my-2 grid grid-cols-3'>
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
          <div className='group flex items-center px-2 p-1 rounded-full text-red-700 font-medium hover:bg-red-200 bg-red-100 text-xs cursor-pointer'
            onClick={() => denyInviteQ.mutate({ invite_id: props.invite.id })}>
            Deny
            <XMarkIcon className='group-hover:scale-[120%] transition-all text-red-700 ml-1 h-3 w-3 stroke-[3px]' />
          </div>
          <div className='group ml-2 flex items-center px-2 p-1 rounded-full text-green-700 font-medium hover:bg-green-200 bg-green-100 text-xs cursor-pointer'
            onClick={() => acceptInviteQ.mutate({ invite_id: props.invite.id })}>
            Accept
            <CheckIcon className='group-hover:scale-[120%] transition-all text-green-700 ml-1 h-3 w-3 stroke-[3px]' />
          </div>
        </React.Fragment>
      }
    </div>
  </div>
}

const ProfileViewInvitesSection: React.FC = () => {
  const authContext = useAuthContext()
  const listInvitesQ = useListInvites({ recipient_account_id: authContext.userID })


  return <div className='mt-4 w-full bg-gray-50 rounded-md border border-gray-100'>
    {/* Header */}
    <div className='p-5 flex items-center justify-between border-b border-[#efefef]'>
      <div className='flex items-center'>
        <InboxIcon className='ml-2 text-gray-600 h-5 w-5 mr-2' />
        <p className='text-gray-600 text-md font-medium'>Invites</p>
      </div>
    </div>

    {/* List */}
    <div className='px-5 grid grid-cols-1 gap-4 w-full'>
      {
        listInvitesQ.isSuccess ?
          !listInvitesQ.data.data.invites ?
            <div className='text-sm text-center my-4 text-gray-400'>{'You haven\'t been invited to any group'}</div>
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

const ProfileViewAccountSection: React.FC = () => {
  const authContext = useAuthContext()
  const [editName, setEditName] = React.useState(false)
  const [newName, setNewName] = React.useState<string | undefined>(undefined)
  const updateAccountQ = useUpdateAccount()
  const getAccountQ = useGetAccount({account_id: authContext.userID})
  const newNameInputRef = React.createRef<HTMLInputElement>()

  useClickOutside(newNameInputRef, () => {
    setEditName(false)
  })

  React.useEffect(() => {
    if (newName === undefined || !editName) {
      setNewName(getAccountQ.isSuccess ? getAccountQ.data.data.account.name : '')
    }
  }, [getAccountQ])

  const onChangeName = (e) => {
    e.preventDefault()
    updateAccountQ.mutate({ account: { id: authContext.userID as string, name: newName }, update_mask: 'name' })
    setEditName(false)
  }

  return <div className='bg-gradient-to-br bg-gray-50 rounded-md p-4 border border-gray-100'>
    <div className='flex items-center'>
      <div className='group h-16 w-16 bg-gradient-radial to-green-200 from-teal-300 rounded-md mr-4'>
        <div className='hidden group-hover:flex w-full h-full items-center justify-center bg-[rgba(255,255,255,0.2)] rounded-md cursor-pointer'>
          <ArrowPathIcon className='hidden group-hover:block h-6 w-6 stroke-2 text-gray-500' />
        </div>
      </div>
      <div className='flex flex-col'>
        {
          getAccountQ.isSuccess ?
            <React.Fragment>
              <div className='group flex items-center h-8 cursor-pointer' onClick={() => {
                setEditName(true)
              }}>
                {
                  editName ? 
                    <form onSubmit={onChangeName}>
                      <input ref={newNameInputRef} autoFocus className='rounded border-gray-200 font-medium -ml-[5px] w-48 px-1 py-0 bg-white' type="text"
                        value={newName} onChange={(e) => setNewName(e.target.value)} />
                      <button type='submit' />
                    </form>
                    :
                    <React.Fragment>
                      <p className='font-medium'>{getAccountQ.data?.data.account.name}</p>
                      <PencilIcon className='hidden group-hover:block h-4 w-4 stroke-2 text-gray-400 ml-2' />
                    </React.Fragment>
                }
              </div>
              <div>
                <p className='text-gray-700'>{getAccountQ.data?.data.account.email}</p>
              </div>
            </React.Fragment>
            :
            <React.Fragment>
              <div className='skeleton w-48 h-6'></div>
            </React.Fragment>
        }
      </div>
    </div>
  </div>
}

const ProfileView: React.FC = () => {
  return <ViewSkeleton title='Profile' panels={['group-chat','group-activity']}>
    <div className='mb-lg xl:mb-xl mx-lg xl:mx-xl w-full'>
      <ProfileViewAccountSection />
      <ProfileViewInvitesSection />
    </div>
  </ViewSkeleton>
}

export default ProfileView
