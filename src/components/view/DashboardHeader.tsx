import { Menu, Transition } from '@headlessui/react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, UserIcon } from '@heroicons/react/24/solid'
import React from 'react'
import { useAuthContext } from '../../contexts/auth'
import { useGroupContext } from '../../contexts/group'
import { useCreateGroup, useGetGroup, useListGroups } from '../../hooks/api/groups'
import LoaderIcon from '../icons/LoaderIcon'

const GroupSelectDropdownItem: React.FC<React.PropsWithChildren & { onClick?: undefined | (() => void) }> = props => {
  return <Menu.Item>
    {() => <div className='px-4 py-3 text-sm flex items-center cursor-pointer hover:bg-gray-100' onClick={props.onClick}>
      {props.children}
    </div>}
  </Menu.Item>
}

const GroupSelectDropdown: React.FC = () => {
  const auth = useAuthContext()
  const groupContext = useGroupContext()
  const getGroupQ = useGetGroup({ group_id: groupContext.groupID as string })
  const listGroupsQ = useListGroups({ account_id: auth.userID })
  const createGroupQ = useCreateGroup({
    onSuccess: (data) => {
      groupContext.changeGroup(data.data.group.id)
    }
  })

  return <div>
    <Menu as='div' className='relative'>
      <Menu.Button as='button' className='flex items-center !outline-none'>
        <div className='rounded border border-gray-300 text-sm flex cursor-pointer'>
          <div className='font-medium text-gray-800 flex items-center h-[34px]'>
            {
              groupContext.groupID === null ? 
                <React.Fragment>
                  <div className='h-4 w-4 mx-2 bg-gradient-to-br from-orange-400 to-pink-400 rounded' />
                  <p className='text-gray-700 text-sm font-normal pl-2'>Select a group</p>
                </React.Fragment>
                :
                <React.Fragment>
                  <div className='h-4 w-4 mx-2 bg-gradient-to-br from-orange-400 to-pink-400 rounded' />
                  {
                    getGroupQ.isSuccess ? getGroupQ.data?.data.group.name : <div className='h-4 w-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded animate-pulse'></div>
                  }
                </React.Fragment>
            }
          </div>
          <div className='border-l border-gray-300 flex items-center justify-center px-1 ml-2'>
            <ChevronDownIcon className='h-4 w-4 stroke-[10px] text-gray-500' />
          </div>
        </div>
      </Menu.Button>
      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-1 w-72 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {
            listGroupsQ.isSuccess ?
              listGroupsQ.data.data.groups.map((el, idx) => <GroupSelectDropdownItem key={`group-select-dropdown-group-${el.id}-${idx}`} onClick={() => {groupContext.changeGroup(el.id)}} >
                <img className='rounded bg-gray-200 h-6 w-6 mr-3' />
                {el.name}
              </GroupSelectDropdownItem>) 
              :
              <GroupSelectDropdownItem>
                <div className='rounded bg-gradient-to-br animate-pulse from-gray-100 to-gray-200 h-6 w-6 mr-3' />
                <p className='h-4 w-32 animate-pulse bg-gradient-to-br from-gray-100 to-gray-200 rounded'></p>
              </GroupSelectDropdownItem>
          }
          {/* {
            groups.map((el, idx) => <GroupSelectDropdownItem group={el} key={`group-select-dropdown-group-${el.id}-${idx}`} />)
          } */}
          <div className='px-4 py-3 text-sm flex items-center text-gray-700 cursor-pointer hover:bg-gray-100' onClick={() => {
            createGroupQ.mutate({ name: 'My Group', description: 'Created on ' + (new Date()).toDateString() })
          }}>
            {
              createGroupQ.isLoading ?
                <React.Fragment>
                  <LoaderIcon className='text-gray-400 h-6 w-6 mr-3' />
                  Creating...
                </React.Fragment>
                :
                <React.Fragment>
                  <PlusIcon className='text-gray-400 h-6 w-6 mr-3' />
                  Create a group
                </React.Fragment>
            }
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  </div>
} 

const DashboardHeader: React.FC<React.PropsWithChildren> = (props) => {
  return <div className='pb-lg xl:pb-xl pt-xl px-lg xl:px-xl bg-white'>
    <div className='flex items-center justify-between max-h-[36px] h-[36px]'>
      {props.children}
      <GroupSelectDropdown />
    </div>
  </div>
}

export default DashboardHeader
