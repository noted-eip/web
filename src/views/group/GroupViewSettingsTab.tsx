import { PencilIcon, UserIcon } from '@heroicons/react/24/solid'
import { ArrowPathIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { useGroupContext } from '../../contexts/group'
import { useGetGroup, useListCurrentGroupMembers, useUpdateGroup } from '../../hooks/api/groups'
import GroupViewMenu from './GroupViewMenu'
import useClickOutside from '../../hooks/click'
import { GroupMember } from '../../types/api/groups'
import { useGetAccount } from '../../hooks/api/accounts'
import { useDebounce } from 'usehooks-ts'
import LoaderIcon from '../../components/icons/LoaderIcon'
import { useSendInvite } from '../../hooks/api/invites'

export const GroupViewSettingsTabEditGroup: React.FC = () => {
  const [editName, setEditName] = React.useState(false)
  const [editDescription, setEditDescription] = React.useState(false)
  const groupContext = useGroupContext()
  const getGroupQ = useGetGroup({ group_id: groupContext.groupID as string })
  const updateGroupQ = useUpdateGroup()
  const [newName, setNewName] = React.useState<string | undefined>(undefined)
  const [newDescription, setNewDescription] = React.useState<string | undefined>(undefined)
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
      setNewDescription(getGroupQ.isSuccess ? getGroupQ.data.data.group.description : '')
    }
  }, [getGroupQ])

  const onChangeName = (e) => {
    e.preventDefault()
    updateGroupQ.mutate({ group: { id: groupContext.groupID as string, name: newName }, update_mask: 'name' })
    setEditName(false)
  }

  const onChangeDescription = (e) => {
    e.preventDefault()
    updateGroupQ.mutate({ group: { id: groupContext.groupID as string, description: newDescription }, update_mask: 'description' })
    setEditDescription(false)
  }

  return <div className='bg-gradient-to-br bg-gray-50 rounded-md p-4 border border-gray-100'>
    <div className='flex items-center'>
      <div className='group h-16 w-16 bg-gradient-to-br from-orange-300 to-red-300 rounded-md mr-4'>
        <div className='hidden group-hover:flex w-full h-full items-center justify-center bg-[rgba(255,255,255,0.2)] rounded-md cursor-pointer'>
          <ArrowPathIcon className='hidden group-hover:block h-6 w-6 stroke-2 text-gray-500' />
        </div>
      </div>
      <div className='flex flex-col'>
        {
          getGroupQ.isSuccess ?
            <React.Fragment>
              <div className='group flex items-center h-8 cursor-pointer' onClick={() => {
                setEditName(true)
                setEditDescription(false)
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
                      <p className='font-medium'>{getGroupQ.data?.data.group.name}</p>
                      <PencilIcon className='hidden group-hover:block h-4 w-4 stroke-2 text-gray-400 ml-2' />
                    </React.Fragment>
                 
                }
              </div>
              <div className='group flex items-center h-6 cursor-pointer' onClick={() => {
                setEditName(false)
                setEditDescription(true)
              }}>
                {
                  editDescription ? 
                    <form onSubmit={onChangeDescription} className='flex items-center'>
                      <input ref={newDescriptionInputRef} autoFocus className='rounded text-gray-500 border-gray-200 text-sm px-1 py-0 -ml-[5px] w-72 bg-white' type="text"
                        value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
                      <button type='submit' />
                    </form>
                    :
                    <React.Fragment>
                      <p className='text-gray-500 text-sm cursor-pointer'>{getGroupQ.data?.data.group.description}</p>
                      <PencilIcon className='hidden group-hover:block h-4 w-4 stroke-2 text-gray-400 ml-2' />
                    </React.Fragment>
                }
              </div>
            </React.Fragment>
            :
            <React.Fragment>
              <div className='skeleton w-48 h-6'>

              </div>
            </React.Fragment>
        }
      </div>
    </div>
  </div>
}

const GroupMemberListItem: React.FC<{ member: GroupMember }> = props => {
  const account = useGetAccount({ account_id: props.member.account_id })

  return <div className='h-12 grid grid-cols-3'>
    <div className='flex items-center'>
      <div className='h-9 w-9 bg-gradient-radial from-gray-50 to-gray-200 rounded-md' />
      <div className='font-medium text-sm text-gray-800 pl-3'>
        {
          account.isSuccess ? account.data.data.account.name : <div className='skeleton w-16 h-4' />
        }
      </div>
    </div>
    <div className='flex items-center'>
      {
        account.isSuccess ? <p className='text-sm text-gray-500'>{account.data.data.account.email}</p> : <div className='skeleton w-48 h-4' />
      }
    </div>
    <div className='flex items-center justify-end'>
      {
        props.member.role === 'admin' && <div className='float-right text-xs font-medium p-1 px-2 text-purple-600 bg-purple-200 ml-2 rounded-full'>Admin</div>
      }
    </div>
  </div>
}

const GroupViewSettingsTabMembersSection: React.FC = () => {
  const groupContext = useGroupContext()
  const [accountEmailSearch, setAccountEmailSearch] = React.useState<string>('')
  const searchAccountQ = useGetAccount({ email: accountEmailSearch }, { enabled: false, retry: false })
  const sendInviteQ = useSendInvite()
  const listMembersQ = useListCurrentGroupMembers({}, {})
  const debouncedValue = useDebounce<string>(accountEmailSearch, 1000)

  React.useEffect(() => {
    if (accountEmailSearch != '') {
      searchAccountQ.refetch()
    }
  }, [debouncedValue])

  const onInviteFriend = () => {
    sendInviteQ.mutate({ group_id: groupContext.groupID as string, recipient_account_id: searchAccountQ.data?.data.account.id as string })
    setAccountEmailSearch('')
  }

  return <div className='p-5 mt-4 bg-gray-50 rounded-md border border-gray-100'>
    {/* Header */}
    <div className='flex items-center justify-between pb-3 border-b border-[#efefef]'>
      <div className='flex items-center'>
        <UserIcon className='ml-2 text-gray-600 h-5 w-5 mr-2' />
        <p className='text-gray-600 text-md font-medium'>Members</p>
      </div>
      <form className='flex items-center' onSubmit={(e) => {
        e.preventDefault()
        onInviteFriend()
      }}>
        <div className='flex items-center justify-center w-64'>
          <input
            tabIndex={1}
            className='px-2 w-full h-8 rounded-md rounded-r-none focus:ring-0 focus:border-gray-300 border-r-0 outline-none placeholder:text-gray-400 text-sm border border-gray-300 bg-white'
            placeholder='jhon@email.com'
            type='email'
            autoCorrect='off'
            autoCapitalize='off'
            spellCheck='false'
            onChange={(e) => setAccountEmailSearch(e.target.value)}
            value={accountEmailSearch || ''} />
          <div className='h-8 rounded-md rounded-l-none bg-white border border-l-0 border-gray-300 flex justify-center items-center pr-2'>
            {
              searchAccountQ.isSuccess ?
                <CheckIcon className='text-green-600 h-4 w-4 stroke-2' />
                :
                accountEmailSearch === '' ?
                  <div></div>
                  :
                  debouncedValue === accountEmailSearch ?
                    searchAccountQ.isError ?
                      <XMarkIcon className='text-red-600 h-4 w-4 stroke-2' />                    
                      :
                      <LoaderIcon className='h-4 w-4' />
                    :
                    <LoaderIcon className='h-4 w-4' />
            }
          </div>
        </div>
        <button tabIndex={2} type="submit" disabled={!searchAccountQ.isSuccess} className='h-8 px-3 text-white transition-colors duration-150 bg-blue-600 disabled:text-gray-800 disabled:bg-gray-300 ml-2 cursor-pointer rounded-md text-sm font-medium'>
          <span className={`${sendInviteQ.isLoading && 'invisible'}`}>Send invite</span>
        </button>
      </form>
    </div>

    {/* List */}
    <div className='grid grid-cols-1 gap-4 mt-3 w-full'>
      {
        listMembersQ.isSuccess ? listMembersQ.data.data.members.map((el, idx) => <GroupMemberListItem
          key={`group-member-list-${el.account_id}-${idx}`}
          member={el} />)
          :
          <div>
            <div className='skeleton h-6 w-full mt-2 mb-6' />
            <div className='skeleton h-6 w-full' />
          </div>
      }
    </div>
  </div>
}

const GroupViewSettingsTab: React.FC = () => {
  return <div className='grid grid-rows-1 gap-4'>
    <GroupViewMenu activeTab={'settings'}>
      <div></div>
    </GroupViewMenu>

    <div className='w-full flex flex-col'>
      <GroupViewSettingsTabEditGroup />
      <GroupViewSettingsTabMembersSection />
    </div>
  </div>
}

export default GroupViewSettingsTab
