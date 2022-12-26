import { Menu, Transition } from '@headlessui/react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import React from 'react'
import { useGroupContext } from '../../contexts/group'
import { Group } from '../../types/api/groups'

const GroupSelectDropdownItem: React.FC<{group: Group}> = props => {
  return <Menu.Item>
    {(active) => <div className='px-4 py-3 text-sm flex items-center cursor-pointer hover:bg-gray-100'>
      <img className='rounded bg-gray-300 h-6 w-6 mr-3' />
      {props.group.name}
    </div>}
  </Menu.Item>
}

const GroupSelectDropdown: React.FC = () => {
  const groupContext = useGroupContext()
  const groups: Group[] = [
    {
      id: '1234',
      name: 'Noted 2022',
      description: 'Not much to see here',
      created_at: '2022'
    },
    {
      id: '1244',
      name: 'Advanced Computing THU',
      description: 'Not much to see here',
      created_at: '2022'
    },
    {
      id: '1254',
      name: 'Epitech Promo 2024',
      description: 'Not much to see here',
      created_at: '2022'
    }
  ]

  return <div>
    <Menu as='div' className='relative'>
      <Menu.Button as='button' className='flex items-center !outline-none'>
        <div className='rounded border border-gray-300 text-sm flex cursor-pointer'>
          <div className='font-medium text-gray-800 flex items-center h-[34px]'>
            {
              groupContext.groupID === null ? 
                <React.Fragment>
                  <div className='h-7 w-7 ml-1 bg-gray-200 rounded' />
                  <p className='text-gray-700 text-sm font-normal pl-1'>Select a group</p>
                </React.Fragment>
                :
                <React.Fragment>
                  <img className='h-8 w-8 p-[1px] mr-[3px]' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJjxQSevxZSdV9xXy7LWCvgmJTAKaeaF3Kj0GWU_FrypKqrlN3xZOD9r125HbaO9SauK0&usqp=CAU' />
                  Noted 2022
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
            groups.map((el, idx) => <GroupSelectDropdownItem group={el} key={`group-select-dropdown-group-${el.id}-${idx}`} />)
          }
          <div className='px-4 py-3 text-sm flex items-center text-gray-700 cursor-pointer hover:bg-gray-100'>
            <PlusIcon className='text-gray-400 h-6 w-6 mr-3' />
            Create a group
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
