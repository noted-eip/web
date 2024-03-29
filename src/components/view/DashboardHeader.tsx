import { Menu, Transition } from '@headlessui/react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import React from 'react'

import { useAuthContext } from '../../contexts/auth'
import { useGroupContext } from '../../contexts/group'
import {
  useCreateGroup,
  useGetCurrentGroup,
  useListGroups,
} from '../../hooks/api/groups'
import { FormatMessage } from '../../i18n/TextComponent'
import LoaderIcon from '../icons/LoaderIcon'

const GroupSelectDropdownItem: React.FC<
React.PropsWithChildren & { onClick?: undefined | (() => void) }
> = (props) => {
  return (
    <Menu.Item>
      {() => (
        <div
          className='flex cursor-pointer items-center px-4 py-3 text-sm hover:bg-gray-100'
          onClick={props.onClick}
        >
          {props.children}
        </div>
      )}
    </Menu.Item>
  )
}


const GroupSelectDropdown: React.FC = () => {
  const auth = useAuthContext()
  const groupContext = useGroupContext()
  const getGroupQ = useGetCurrentGroup({ enabled: !!groupContext.groupId })
  const listGroupsQ = useListGroups({ accountId: auth.accountId })
  const createGroupQ = useCreateGroup()

  return (
    <div>
      {/* TODO: va degager */}
      <Menu as='div' className='relative'>
        <div className='flex space-x-4'>
          <Menu.Button as='button' className='flex items-center !outline-none'>
            <div className='flex cursor-pointer rounded border border-gray-300 text-sm'>
              <div className='flex h-[34px] items-center font-medium text-gray-800'>
                <>
                  {getGroupQ.isSuccess ? (
                    <>
                      <div className='mx-2 h-4 w-4 rounded bg-gradient-to-br from-orange-400 to-pink-400' />
                      {getGroupQ.data?.group.name}
                    </>
                  ) : getGroupQ.isFetching ? (
                    <>
                      <div className='mx-2 h-4 w-4 rounded bg-gradient-to-br from-orange-400 to-pink-400' />
                      <div className='skeleton h-4 w-24'></div>
                    </>
                  ) : (
                    <>
                      <div className='ml-3 mr-1 text-gray-700'>
                        <FormatMessage id='DASHBOARD.selectGroup' />
                      </div>
                    </>
                  )}
                </>
              </div>
              <div className='ml-2 flex items-center justify-center border-l border-gray-300 px-1'>
                <ChevronDownIcon className='h-4 w-4 stroke-[10px] text-gray-500' />
              </div>
            </div>
          </Menu.Button>
        </div>
        <Transition
          as={React.Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <Menu.Items className='absolute right-0 mt-1 w-72 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none'>
            {listGroupsQ.isSuccess ? (
              listGroupsQ.data.groups &&
              listGroupsQ.data.groups
                .filter((el) => el.id !== groupContext.groupId)
                .map((el, idx) => (
                  <GroupSelectDropdownItem
                    key={`group-select-dropdown-group-${el.id}-${idx}`}
                    onClick={() => {
                      groupContext.changeGroup(el.id)
                    }}
                  >
                    <div className='mr-3 h-6 w-6 rounded bg-gradient-to-br from-orange-400 to-pink-400' />
                    {el.name}
                  </GroupSelectDropdownItem>
                ))
            ) : (
              <GroupSelectDropdownItem>
                <div className='mr-3 h-6 w-6 animate-pulse rounded bg-gradient-to-br from-gray-100 to-gray-200' />
                <p className='h-4 w-32 animate-pulse rounded bg-gradient-to-br from-gray-100 to-gray-200'></p>
              </GroupSelectDropdownItem>
            )}
            <div
              className='flex cursor-pointer items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100'
              onClick={() => {
                createGroupQ.mutate({
                  body: {
                    name: 'My Group',
                    description: 'Created on ' + new Date().toDateString(),
                  },
                })
              }}
            >
              {createGroupQ.isLoading ? (
                <>
                  <LoaderIcon className='mr-3 h-6 w-6 text-gray-400' />
                  Creating...
                </>
              ) : (
                <>
                  <PlusIcon className='mr-3 h-6 w-6 text-gray-400' />
                  <FormatMessage id='GROUP.createGroup' />
                </>
              )}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

const DashboardHeader: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <div className='bg-white px-lg pb-lg pt-xl xl:px-xl xl:pb-xl'>
      <div className='flex h-[36px] max-h-[36px] items-center justify-between'>
        {props.children}
        <GroupSelectDropdown />
      </div>
    </div>
  )
}

export default DashboardHeader
