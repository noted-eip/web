import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { Fragment } from 'react'
import React from 'react'

import ViewSkeleton from '../../components/view/ViewSkeleton'
import { LangageContext } from '../../contexts/langage'
import { FormatMessage } from '../../i18n/TextComponent'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const SettingsView: React.FC = () => {
  const context = React.useContext(LangageContext)

  return (
    <ViewSkeleton title='Settings' panels={['group-chat', 'group-activity']}>
      <div className='mx-lg mb-lg w-full xl:mx-xl xl:mb-xl'>
        <div className='mt-4 w-full rounded-md border border-gray-100 bg-gray-50'>
          {/* Header */}
          <div className='flex items-center justify-between border-b border-[#efefef] p-5'>
            <div className='flex items-center'>
              <p className='text-base font-medium text-red-700'>
                <FormatMessage id='SETTINGS.langage.title' />
              </p>
            </div>
          </div>

          <div className='grid grid-cols-[40%_60%] p-5'>
            <div className='relative inline-block text-left'>
              <Menu as='div' className='relative inline-block text-left'>
                <div>
                  <Menu.Button className='inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'>
                    <FormatMessage id='SETTINGS.langage.options' />
                    <ChevronDownIcon className='-mr-1 h-5 w-5 text-gray-400' aria-hidden='true' />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-100'
                  enterFrom='transform opacity-0 scale-95'
                  enterTo='transform opacity-100 scale-100'
                  leave='transition ease-in duration-75'
                  leaveFrom='transform opacity-100 scale-100'
                  leaveTo='transform opacity-0 scale-95'
                >
                  <Menu.Items className='absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                    <div className='py-1'>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            className={classNames(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block px-4 py-2 text-sm'
                            )}
                            onClick={() => {context?.changeLangage('fr')}}
                          >
                            <FormatMessage id='SETTINGS.langage.french' />
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            className={classNames(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block px-4 py-2 text-sm'
                            )}
                            onClick={() => {context?.changeLangage('en')}}
                          >
                            <FormatMessage id='SETTINGS.langage.english' />
                          </a>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
      </div>
    </ViewSkeleton>
  )
}

export default SettingsView
