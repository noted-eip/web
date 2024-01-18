import {
  ArrowPathIcon,
  CheckIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { EnvelopeIcon, PencilIcon, UserIcon } from '@heroicons/react/24/solid'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import moment from 'moment'
import React from 'react'
import { useDebounce } from 'usehooks-ts'

import LoaderIcon from '../../components/icons/LoaderIcon'
import { useAuthContext } from '../../contexts/auth'
import { useGroupContext } from '../../contexts/group'
import { useGetAccount, useSearchAccount } from '../../hooks/api/accounts'
import { useGetCurrentGroup, useGetGroup, useUpdateCurrentGroup } from '../../hooks/api/groups'
import { useRevokeInviteInCurrentGroup, useSendInviteInCurrentGroup } from '../../hooks/api/invites'
import { useRemoveMemberInCurrentGroup, useUpdateMemberInCurrentGroup } from '../../hooks/api/members'
import useClickOutside from '../../hooks/click'
import { FormatMessage, useOurIntl } from '../../i18n/TextComponent'
import { beautifyError } from '../../lib/api'
import { V1GroupInvite, V1GroupMember } from '../../protorepo/openapi/typescript-axios'

export const GroupViewSettingsTabEditGroup: React.FC = () => {
  const [editName, setEditName] = React.useState(false)
  const [editDescription, setEditDescription] = React.useState(false)
  const groupContext = useGroupContext()
  const getGroupQ = useGetGroup({ groupId: groupContext.groupId as string })
  const updateGroupQ = useUpdateCurrentGroup()
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
      setNewName(getGroupQ.isSuccess ? getGroupQ.data.group.name : '')
    }
    if (newDescription === undefined || !editDescription) {
      setNewDescription(
        getGroupQ.isSuccess ? getGroupQ.data.group.description : ''
      )
    }
  }, [getGroupQ])

  const onChangeName = (e) => {
    e.preventDefault()
    updateGroupQ.mutate({ body: { name: newName } })
    setEditName(false)
  }

  const onChangeDescription = (e) => {
    e.preventDefault()
    updateGroupQ.mutate({ body: { description: newDescription } })
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
                      {getGroupQ.data?.group.name}
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
                      {getGroupQ.data?.group.description}
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

const GroupMemberListItem: React.FC<{ member: V1GroupMember }> = (props) => {
  const { member } = props
  const authContext = useAuthContext()
  const account = useGetAccount({ accountId: member.accountId })
  const removeMemberQ = useRemoveMemberInCurrentGroup()
  const updateGroupMemberQ = useUpdateMemberInCurrentGroup()
  const groupQ = useGetCurrentGroup()

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
      {/* Admin Badge */}
      <div className='flex items-center'>
        {props.member.isAdmin ? (
          <div className='float-right rounded-full bg-purple-200 p-1 px-2 text-xs font-medium text-purple-600'>
            Admin
          </div>
          // Dirty way of checking that the current user is an admin.
        ) : groupQ.data?.group.members?.find((acc) => { return acc.accountId === authContext.accountId && acc.isAdmin }) && (
          <div
            className='invisible float-right cursor-pointer rounded-full border-2 border-dashed border-gray-400 bg-gray-200 p-[2px] px-[6px] text-xs font-medium text-gray-600 opacity-75 hover:opacity-100 group-hover:visible'
            onClick={() =>
              updateGroupMemberQ.mutate({
                accountId: props.member.accountId,
                body: {
                  isAdmin: true,
                } as V1GroupMember,
              })
            }
          >
            Admin
          </div>
        )}
      </div>
      {/* Remove Group Member */}
      <div className='flex items-center justify-end'>
        {props.member.accountId !== authContext.accountId &&
          props.member.isAdmin ? null :
          <div className='cursor-pointer opacity-75 group-hover:opacity-100'>
            {
              removeMemberQ.isLoading ?
                <LoaderIcon className='h-9 w-9 p-2' />
                :
                <TrashIcon className='h-9 w-9 rounded-md stroke-2 p-2 text-gray-400 hover:bg-gray-200' onClick={() => removeMemberQ.mutate({ accountId: props.member.accountId })} />
            }
          </div>}
      </div>
    </div>
  )
}

const GroupViewSettingsTabMembersSection: React.FC = () => {
  const { formatMessage } = useOurIntl()
  const groupQ = useGetCurrentGroup()
  const [accountEmailSearch, setAccountEmailSearch] = React.useState<string>('')
  const searchAccountQ = useSearchAccount({email: accountEmailSearch}, {enabled: false, retry: false})
  const sendInviteQ = useSendInviteInCurrentGroup(
    {onError: (e) => {beautifyError(e.response?.data.error, 'invite', formatMessage)}}
  )
  const debouncedValue = useDebounce<string>(accountEmailSearch, 1000)

  React.useEffect(() => {
    if (accountEmailSearch != '') {
      searchAccountQ.refetch()
    }
  }, [debouncedValue])

  const onInviteFriend = () => {
    sendInviteQ.mutate({ body: { recipientAccountId: searchAccountQ.data?.account.id as string } })
    setAccountEmailSearch('')
  }

  return (groupQ.data?.group.workspaceAccountId ? null :
    <div className='mt-4 overflow-hidden rounded-md border border-gray-100 bg-gray-50'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-gray-200 p-5'>
        <div className='flex items-center'>
          <UserIcon className='mx-2 h-5 w-5 text-gray-600' />
          <p className='text-base font-medium text-gray-600'>
            <FormatMessage id='GROUP.settings.members.title' />
          </p>
        </div>
        <form
          className='flex items-center'
          onSubmit={(e) => {
            e.preventDefault()
            onInviteFriend()
          }}
        >
          <Stack direction='row' spacing={2}>
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
            <Button
              type='submit'
              tabIndex={2}
              variant='contained'
              size='small'
              disabled={!searchAccountQ.isSuccess}
            >
              <span className={`${sendInviteQ.isLoading && 'invisible'}`}>
                <FormatMessage id='GROUP.settings.members.button' />
              </span>
              {sendInviteQ.isLoading && <LoaderIcon className='absolute h-5 w-5' />}
            </Button>
          </Stack>
        </form>
      </div>
      {/* List */}
      <div className='grid w-full grid-cols-1'>
        <div className='grid h-8 grid-cols-[30%_40%_20%_10%] border-b border-gray-200 px-5'>
          <span className='text-sm font-medium leading-8 text-gray-500'>
            {formatMessage({ id: 'GENERIC.name' }).toUpperCase()}
          </span>
          <span className='text-sm font-medium leading-8 text-gray-500'>
            {formatMessage({ id: 'AUTH.email' }).toUpperCase()}
          </span>
          <span className='text-sm font-medium leading-8 text-gray-500'>
            {formatMessage({ id: 'GENERIC.role' }).toUpperCase()}
          </span>
          <span className='text-end text-sm font-medium leading-8 text-gray-500'>
            {formatMessage({ id: 'GENERIC.actions' }).toUpperCase()}
          </span>
        </div>
        {groupQ.isSuccess ? (
          groupQ.data.group.members?.map((el, idx) =>
            <GroupMemberListItem
              key={`group-member-list-${el.accountId}-${idx}`}
              member={el}
            />
          )
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

const PendingInviteListItem: React.FC<{ invite: V1GroupInvite }> = (props) => {
  const senderAccountQ = useGetAccount({ accountId: props.invite.senderAccountId })
  const recipientAccountQ = useGetAccount({ accountId: props.invite.recipientAccountId })
  const expiresInDateString = moment(props.invite.validUntil, 'YYYY-MM-DDTHH:mm:ssZ').fromNow()
  const revokeInviteQ = useRevokeInviteInCurrentGroup()

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
      <div className='text-sm leading-[64px] text-gray-500'>{expiresInDateString}</div>
      <div className='flex items-center justify-end'>
        {/* TODO: Display this when the person can actually delete the invite */}
        <div className='cursor-pointer opacity-75 group-hover:opacity-100'>
          {
            revokeInviteQ.isLoading ?
              <LoaderIcon className='h-9 w-9 p-2' />
              :
              <TrashIcon className='h-9 w-9 rounded-md stroke-2 p-2 text-gray-400 hover:bg-gray-200' onClick={() => {
                revokeInviteQ.mutate({ inviteId: props.invite.id })
              }} />
          }
        </div>
      </div>
    </div>
  )
}

const GroupViewSettingsTabPendingInvitesSection: React.FC = () => {
  const groupQ = useGetCurrentGroup()

  return (groupQ.data?.group.workspaceAccountId ? null :
    <div className='mt-4 overflow-hidden rounded-md border border-gray-100 bg-gray-50'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-gray-200 p-5'>
        <div className='flex items-center'>
          <EnvelopeIcon className='mx-2 h-5 w-5 text-gray-600' />
          <p className='text-base font-medium text-gray-600'>
            <FormatMessage id='GROUP.settings.invites.title' />
          </p>
        </div>
      </div>

      {/* List */}
      <div className='grid w-full grid-cols-1'>
        <div className='grid h-8 grid-cols-[35%_35%_20%_10%] border-b border-gray-200 px-5'>
          <span className='text-sm font-medium leading-8 text-gray-500'>
            <FormatMessage id='GROUP.settings.invites.colTitle1' />
          </span>
          <span className='text-sm font-medium leading-8 text-gray-500'>
            <FormatMessage id='GROUP.settings.invites.colTitle2' />
          </span>
          <span className='text-sm font-medium leading-8 text-gray-500'>
            <FormatMessage id='GROUP.settings.invites.colTitle3' />
          </span>
          <span className='text-end text-sm font-medium leading-8 text-gray-500'>
            <FormatMessage id='GROUP.settings.invites.colTitle4' />
          </span>
        </div>
        {groupQ.isSuccess ? (
          groupQ.data.group.invites?.length ? (
            groupQ.data.group.invites.map((el, idx) => (
              <PendingInviteListItem
                key={`group-view-pending-invites-list-${el.id}-${idx}`}
                invite={el}
              />
            ))
          ) : (
            <div className='flex justify-center p-4 text-sm text-gray-400'>
              <FormatMessage id='GROUP.settings.invites.desc' />
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
      <div className='mb-8 flex w-full flex-col'>
        <GroupViewSettingsTabEditGroup />
        <GroupViewSettingsTabMembersSection />
        <GroupViewSettingsTabPendingInvitesSection />
      </div>
    </div>
  )
}

export default GroupViewSettingsTab
