import { Menu } from '@headlessui/react'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import React from 'react'

import { useRecoModeContext } from '../../contexts/recommendation'

interface ItemProps {
  active: boolean
  label: string
  format: string
}

const RecommendationFilters = () => {
  const recoModeContext = useRecoModeContext()
  const [selectedOption, setSelectedOption] = React.useState(recoModeContext.recoMode == null ? 'note' : recoModeContext.recoMode)
 
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
  }

  const handleChangeRecoMode = () => {
    recoModeContext.changeRecoMode(selectedOption)
  }

  const Item = ({ active, label, format }: ItemProps) => {
    return (
      <button
        className={`${
          active ? 'bg-gray-100 text-gray-700' : 'text-gray-700'
        } flex w-full items-center rounded-md p-2 text-sm hover:bg-gray-100`}
        onClick={() => handleOptionSelect(format)}
      >
        <span className='mr-2'>{label}</span>
        {selectedOption.includes(format as never) && (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M16.707 4.293a1 1 0 0 1 0 1.414L8.414 14l-3.707-3.707a1 1 0 0 1 1.414-1.414L8 11.586l7.293-7.293a1 1 0 0 1 1.414 0z'
              clipRule='evenodd'
            />
          </svg>
        )}
      </button>
    )
  }

  return (
    <div className='relative inline-block cursor-pointer text-right'>
      <Menu>
        {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
        {({ open }) => (
          <>
            <Menu.Button className='flex h-8 cursor-pointer items-center rounded-full bg-gray-50 px-1 text-gray-600 transition-colors hover:border-gray-400 hover:bg-gray-100 hover:text-gray-700'>
              <MoreVertIcon className='h-2 w-2' aria-hidden='false' fontSize='small'/>
            </Menu.Button>

            <Menu.Items
              // eslint-disable-next-line tailwindcss/migration-from-tailwind-2
              className='absolute right-0 z-10 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
            >
              <div className='p-1'>
                <Menu.Item>
                  {({ active }) => (
                    <Item 
                      active={active} 
                      label='Filter by block' 
                      format='block' />
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Item
                      active={active}
                      label='Filter by entire note'
                      format='note'
                    />
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active && 'bg-indigo-500'
                      } flex w-full items-center rounded-md bg-indigo-600 p-2 text-sm text-white`}
                      onClick={handleChangeRecoMode}
                    >
                      <span className='mr-2'>
                        Apply
                      </span>
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </>
        )}
      </Menu>
    </div>
  )
}

export default RecommendationFilters