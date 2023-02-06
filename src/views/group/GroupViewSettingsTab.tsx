import { EnvelopeIcon, PencilIcon, UserIcon } from '@heroicons/react/24/solid'
import {
  ArrowPathIcon,
  CheckIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import React from 'react'
import { useGroupContext } from '../../contexts/group'
import {
  useGetGroup,
  useListCurrentGroupMembers,
  useRemoveGroupMember,
  useUpdateGroup,
  useUpdateGroupMember,
} from '../../hooks/api/groups'
import GroupViewMenu from './GroupViewMenu'
import useClickOutside from '../../hooks/click'
import { GroupMember } from '../../types/api/groups'
import { useGetAccount } from '../../hooks/api/accounts'
import { useDebounce } from 'usehooks-ts'
import LoaderIcon from '../../components/icons/LoaderIcon'
import { useListInvites, useSendInvite } from '../../hooks/api/invites'
import { useAuthContext } from '../../contexts/auth'
import { Invite } from '../../types/api/invites'

export const GroupViewSettingsTabEditGroup: React.FC = () => {
  const [editName, setEditName] = React.useState(false)
  const [editDescription, setEditDescription] = React.useState(false)
  const groupContext = useGroupContext()
  const getGroupQ = useGetGroup({ group_id: groupContext.groupID as string })
  const updateGroupQ = useUpdateGroup()
  const [newName, setNewName] = React.useState<string | undefined>(undefined)
  const [newDescription, setNewDescription] = React.useState<
  string | undefined
  >(undefined)
  const newNameInputRef = React.createRef<HTMLInputElement>()
  const newDescriptionInputRef = React.createRef<HTMLInputElement>()

  useClickOutside(newNameInputRef, () => {
    setEditName(false)
  })

  useClickOutside(newDescriptionInputRef, () => {
    setEditDescription(false)
  })

  React.useEffect(() => {
    if (newName === undefined || !editName) {
      setNewName(getGroupQ.isSuccess ? getGroupQ.data.data.group.name : '')
    }
    if (newDescription === undefined || !editDescription) {
      setNewDescription(
        getGroupQ.isSuccess ? getGroupQ.data.data.group.description : ''
      )
    }
  }, [getGroupQ])

  const onChangeName = (e) => {
    e.preventDefault()
    updateGroupQ.mutate({
      group: { id: groupContext.groupID as string, name: newName },
      update_mask: 'name',
    })
    setEditName(false)
  }

  const onChangeDescription = (e) => {
    e.preventDefault()
    updateGroupQ.mutate({
      group: {
        id: groupContext.groupID as string,
        description: newDescription,
      },
      update_mask: 'description',
    })
    setEditDescription(false)
  }

  return (
    <div className='rounded-md border border-gray-100 bg-gray-50 bg-gradient-to-br p-4'>
      <div className='flex items-center'>
        <div className='group mr-4 h-16 w-16 rounded-md bg-gradient-to-br from-orange-300 to-red-300'>
          <div className='hidden h-full w-full cursor-pointer items-center justify-center rounded-md bg-[rgba(255,255,255,0.2)] group-hover:flex'>
            <ArrowPathIcon className='hidden h-6 w-6 stroke-2 text-gray-500 group-hover:block' />
          </div>
        </div>
        <div className='flex flex-col'>
          {getGroupQ.isSuccess ? (
            <React.Fragment>
              <div
                className='group flex h-8 cursor-pointer items-center'
                onClick={() => {
                  setEditName(true)
                  setEditDescription(false)
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
                    <p className='font-medium'>
                      {getGroupQ.data?.data.group.name}
                    </p>
                    <PencilIcon className='ml-2 hidden h-4 w-4 stroke-2 text-gray-400 group-hover:block' />
                  </React.Fragment>
                )}
              </div>
              <div
                className='group flex h-6 cursor-pointer items-center'
                onClick={() => {
                  setEditName(false)
                  setEditDescription(true)
                }}
              >
                {editDescription ? (
                  <form
                    onSubmit={onChangeDescription}
                    className='flex items-center'
                  >
                    <input
                      ref={newDescriptionInputRef}
                      autoFocus
                      className='ml-[-5px] w-72 rounded border-gray-200 bg-white px-1 py-0 text-sm text-gray-500'
                      type='text'
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                    />
                    <button type='submit' />
                  </form>
                ) : (
                  <React.Fragment>
                    <p className='cursor-pointer text-sm text-gray-500'>
                      {getGroupQ.data?.data.group.description}
                    </p>
                    <PencilIcon className='ml-2 hidden h-4 w-4 stroke-2 text-gray-400 group-hover:block' />
                  </React.Fragment>
                )}
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className='skeleton h-6 w-48'></div>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  )
}

const GroupMemberListItem: React.FC<{ member: GroupMember }> = (props) => {
  const authContext = useAuthContext()
  const groupContext = useGroupContext()
  const account = useGetAccount({accountId: props.member.account_id})
  const removeGroupQ = useRemoveGroupMember()
  const updateGroupMemberQ = useUpdateGroupMember()

  return (
    <div className='group grid h-16 cursor-default grid-cols-[30%_40%_20%_10%] px-5 hover:bg-gray-100'>
      <div className='flex items-center'>
        <div className='h-9 w-9 rounded-md bg-gradient-radial from-teal-300 to-green-200' />
        <div className='pl-3 text-sm font-medium text-gray-800'>
          {account.isSuccess ? (
            account.data.account.name
          ) : (
            <div className='skeleton h-4 w-16' />
          )}
        </div>
      </div>
      <div className='flex items-center'>
        {account.isSuccess ? (
          <p className='text-sm text-gray-500'>
            {account.data.account.email}
          </p>
        ) : (
          <div className='skeleton h-4 w-48' />
        )}
      </div>
      <div className='flex items-center'>
        {props.member.role === 'admin' ? (
          <div className='float-right rounded-full bg-purple-200 p-1 px-2 text-xs font-medium text-purple-600'>
            Admin
          </div>
        ) : (
          <div
            className='invisible float-right cursor-pointer rounded-full border-2 border-dashed border-gray-400 bg-gray-200 p-[2px] px-[6px] text-xs font-medium text-gray-600 opacity-75 hover:opacity-100 group-hover:visible'
            onClick={() =>
              updateGroupMemberQ.mutate({
                account_id: props.member.account_id,
                group_id: groupContext.groupID as string,
                member: { role: 'admin' },
                update_mask: 'role',
              })
            }
          >
            Admin
          </div>
        )}
      </div>
      <div className='flex items-center justify-end'>
        {props.member.account_id !== authContext.userID &&
        props.member.role === 'admin' ? null : (
            <div
              className='cursor-pointer rounded-md p-2 opacity-75 hover:bg-gray-200 group-hover:opacity-100'
              onClick={() =>
                removeGroupQ.mutate({
                  account_id: props.member.account_id,
                  group_id: groupContext.groupID as string,
                })
              }
            >
              <TrashIcon className='h-5 w-5 stroke-2 text-gray-400' />
            </div>
          )}
      </div>
    </div>
  )
}

const GroupViewSettingsTabMembersSection: React.FC = () => {
  const groupContext = useGroupContext()
  const [accountEmailSearch, setAccountEmailSearch] = React.useState<string>('')
  const searchAccountQ = useGetAccount({accountId: '', email: accountEmailSearch}, {enabled: false, retry: false})
  const sendInviteQ = useSendInvite()
  const listMembersQ = useListCurrentGroupMembers({}, {})
  const debouncedValue = useDebounce<string>(accountEmailSearch, 1000)

  React.useEffect(() => {
    if (accountEmailSearch != '') {
      searchAccountQ.refetch()
    }
  }, [debouncedValue])

  const onInviteFriend = () => {
    sendInviteQ.mutate({
      group_id: groupContext.groupID as string,
      recipient_account_id: searchAccountQ.data?.account.id as string,
    })
    setAccountEmailSearch('')
  }

  return (
    <div className='mt-4 overflow-hidden rounded-md border border-gray-100 bg-gray-50'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-gray-200 p-5'>
        <div className='flex items-center'>
          <UserIcon className='mx-2 h-5 w-5 text-gray-600' />
          <p className='text-base font-medium text-gray-600'>Members</p>
        </div>
        <form
          className='flex items-center'
          onSubmit={(e) => {
            e.preventDefault()
            onInviteFriend()
          }}
        >
          <div className='flex w-64 items-center justify-center'>
            <input
              tabIndex={1}
              className='h-8 w-full rounded-md rounded-r-none border border-r-0 border-gray-300 bg-white px-2 text-sm outline-none placeholder:text-gray-400 focus:border-gray-300 focus:ring-0'
              placeholder='jhon@email.com'
              type='email'
              autoCorrect='off'
              autoCapitalize='off'
              spellCheck='false'
              onChange={(e) => setAccountEmailSearch(e.target.value)}
              value={accountEmailSearch || ''}
            />
            <div className='flex h-8 items-center justify-center rounded-md rounded-l-none border border-l-0 border-gray-300 bg-white pr-2'>
              {searchAccountQ.isSuccess ? (
                <CheckIcon className='h-4 w-4 stroke-2 text-green-600' />
              ) : accountEmailSearch === '' ? (
                <div></div>
              ) : debouncedValue === accountEmailSearch ? (
                searchAccountQ.isError ? (
                  <XMarkIcon className='h-4 w-4 stroke-2 text-red-600' />
                ) : (
                  <LoaderIcon className='h-4 w-4' />
                )
              ) : (
                <LoaderIcon className='h-4 w-4' />
              )}
            </div>
          </div>
          <button
            tabIndex={2}
            type='submit'
            disabled={!searchAccountQ.isSuccess}
            className='ml-2 h-8 cursor-pointer rounded-md bg-blue-600 px-3 text-sm font-medium text-white transition-colors duration-150 disabled:bg-gray-300 disabled:text-gray-800'
          >
            <span className={`${sendInviteQ.isLoading && 'invisible'}`}>
              Send invite
              {sendInviteQ.isLoading && <LoaderIcon className='h-4 w-4' />}
            </span>
          </button>
        </form>
      </div>

      {/* List */}
      <div className='grid w-full grid-cols-1'>
        <div className='grid h-8 grid-cols-[30%_40%_20%_10%] border-b border-gray-200 px-5'>
          <span className='text-sm font-medium leading-8 text-gray-500'>
            NAME
          </span>
          <span className='text-sm font-medium leading-8 text-gray-500'>
            EMAIL
          </span>
          <span className='text-sm font-medium leading-8 text-gray-500'>
            ROLE
          </span>
          <span className='text-end text-sm font-medium leading-8 text-gray-500'>
            ACTIONS
          </span>
        </div>
        {listMembersQ.isSuccess ? (
          listMembersQ.data.data.members?.map((el, idx) => (
            <GroupMemberListItem
              key={`group-member-list-${el.account_id}-${idx}`}
              member={el}
            />
          ))
        ) : (
          <div className='px-5'>
            <div className='skeleton my-5 h-6 w-full' />
            <div className='skeleton my-5 h-6 w-full' />
          </div>
        )}
      </div>
    </div>
  )
}

const PendingInviteListItem: React.FC<{ invite: Invite }> = (props) => {
  const senderAccountQ = useGetAccount({accountId: props.invite.sender_account_id})
  const recipientAccountQ = useGetAccount({accountId: props.invite.recipient_account_id})

  return (
    <div className='group grid h-16 cursor-default grid-cols-[35%_35%_20%_10%] px-5 hover:bg-gray-100'>
      <div className='flex items-center'>
        <div className='h-6 w-6 rounded-md bg-gradient-radial from-teal-300 to-green-200' />
        <div className='pl-3 text-sm font-medium text-gray-800'>
          {recipientAccountQ.isSuccess ? (
            recipientAccountQ.data.account.name
          ) : (
            <div className='skeleton h-4 w-16' />
          )}
        </div>
      </div>
      <div className='flex items-center'>
        <div className='h-6 w-6 rounded-md bg-gradient-radial from-teal-300 to-green-200' />
        <div className='pl-3 text-sm font-medium text-gray-800'>
          {senderAccountQ.isSuccess ? (
            senderAccountQ.data.account.name
          ) : (
            <div className='skeleton h-4 w-16' />
          )}
        </div>
      </div>
      <div className='text-sm leading-[64px] text-gray-500'>a week</div>
      <div className='flex items-center justify-end'>
        <div className='cursor-pointer rounded-md p-2 opacity-75 hover:bg-gray-200 group-hover:opacity-100'>
          <TrashIcon className='h-5 w-5 stroke-2 text-gray-400' />
        </div>
      </div>
    </div>
  )
}

const GroupViewSettingsTabPendingInvitesSection: React.FC = () => {
  const groupContext = useGroupContext()
  const authContext = useAuthContext()
  const listInvitesQ = useListInvites({
    group_id: groupContext.groupID as string,
    sender_account_id: authContext.userID,
  })

  return (
    <div className='mt-4 overflow-hidden rounded-md border border-gray-100 bg-gray-50'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-gray-200 p-5'>
        <div className='flex items-center'>
          <EnvelopeIcon className='mx-2 h-5 w-5 text-gray-600' />
          <p className='text-base font-medium text-gray-600'>Pending Invites</p>
        </div>
      </div>

      {/* List */}
      <div className='grid w-full grid-cols-1'>
        <div className='grid h-8 grid-cols-[35%_35%_20%_10%] border-b border-gray-200 px-5'>
          <span className='text-sm font-medium leading-8 text-gray-500'>
            NAME
          </span>
          <span className='text-sm font-medium leading-8 text-gray-500'>
            INVITED BY
          </span>
          <span className='text-sm font-medium leading-8 text-gray-500'>
            EXPIRES IN
          </span>
          <span className='text-end text-sm font-medium leading-8 text-gray-500'>
            ACTIONS
          </span>
        </div>
        {listInvitesQ.isSuccess ? (
          listInvitesQ.data.data.invites ? (
            listInvitesQ.data.data.invites.map((el, idx) => (
              <PendingInviteListItem
                key={`group-view-pending-invites-list-${el.id}-${idx}`}
                invite={el}
              />
            ))
          ) : (
            <div className='flex justify-center p-4 text-sm text-gray-400'>
              No pending invites for this group
            </div>
          )
        ) : (
          <div className='px-5'>
            <div className='skeleton my-6 h-6 w-full' />
            <div className='skeleton my-6 h-6 w-full' />
          </div>
        )}
      </div>
    </div>
  )
}

const GroupViewSettingsTab: React.FC = () => {
  return (
    <div className='grid grid-rows-1 gap-4'>
      <GroupViewMenu activeTab={'settings'}>
        <div></div>
      </GroupViewMenu>

      <div className='flex w-full flex-col'>
        <GroupViewSettingsTabEditGroup />
        <GroupViewSettingsTabMembersSection />
        <GroupViewSettingsTabPendingInvitesSection />
      </div>
    </div>
  )
}

export default GroupViewSettingsTab
