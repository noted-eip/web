import { ArrowRightIcon, ArrowRightOnRectangleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Cog6ToothIcon, Square2StackIcon, UserIcon } from '@heroicons/react/24/solid'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthContext } from '../../contexts/auth'
import { removeAccountFromDevelopmentContext, useDevelopmentContext } from '../../contexts/dev'
import { useGetAccount } from '../../hooks/api/accounts'
import { useListInvites } from '../../hooks/api/invites'
import { apiQueryClient } from '../../lib/api'
import { LS_AUTH_TOKEN_KEY, LS_GROUP_ID_KEY } from '../../lib/constants'
import { TOGGLE_DEV_FEATURES } from '../../lib/env'
import Input from '../form/Input'

const DevAccountItem: React.FC<{ account: { id: string, token: string }}> = props => {
  const authContext = useAuthContext()
  const getAccountQ = useGetAccount({ account_id: props.account.id })
  const setAccounts = useDevelopmentContext()?.setAccounts

  if (!setAccounts) return null

  return <div className='bg-gray-50 group rounded-md p-1 flex justify-between text-xs border border-gray-100 cursor-pointer'
    onClick={() => {
      authContext.logout()
      window.localStorage.removeItem(LS_GROUP_ID_KEY)
      window.localStorage.setItem(LS_AUTH_TOKEN_KEY, props.account.token)
      apiQueryClient.clear()
      window.location.assign('/')
    }}>
    <div>
      <span className='hidden xl:block float-right group-hover:underline text-gray-700'>{getAccountQ.data?.data.account.name.slice(0, 9)}</span>
      <span className='xl:hidden float-right text-gray-700'>{getAccountQ.data?.data.account.name[0]}</span>
      <XMarkIcon className='float-right h-4 mr-1 stroke-2 hover:text-red-600 hover:stroke-[3px] text-gray-600 w-3'
        onClick={() => removeAccountFromDevelopmentContext(props.account.id, setAccounts)} />
    </div>
    <ArrowRightIcon className='float-right h-4 ml-1 stroke-2 text-gray-600 w-3' />
  </div>
}

export const Sidebar: React.FC = () => {
  const authContext = useAuthContext()
  const currentPath = useLocation().pathname
  const listInvitesQ = useListInvites({ recipient_account_id: authContext.userID })
  const getAccountQ = useGetAccount({ account_id: authContext.userID })
  const accountsMap = useDevelopmentContext()?.accounts
  const [accounts, setAccounts] = React.useState<{token: string, id: string}[]>()

  React.useEffect(() => {
    const temp: {token: string, id: string}[] = []
    for (const key in accountsMap) {
      temp.push({token: accountsMap[key]?.token || '', id: key})
    }
    setAccounts(temp)
  }, [accountsMap])

  const links = [
    { path: '/', icon: Square2StackIcon, title: 'Home', numNotifications: 0 },
    { path: '/profile', icon: UserIcon, title: 'Profile', numNotifications: listInvitesQ.isSuccess && listInvitesQ.data.data.invites ? listInvitesQ.data.data.invites.length : 0 },
    { path: '/settings', icon: Cog6ToothIcon, title: 'Settings', numNotifications: 0 },
  ]

  return <div className='border-r border-gray-300 h-screen hidden md:flex flex-col'>
    <div className='m-lg mt-xl xl:m-xl h-full flex flex-col justify-between'>
      <div>
        {/* Logo */}
        <div className='h-[36px] w-[36px] bg-gray-200 rounded-md border border-gray-300' />

        {/* Account Indicator */}
        <div className='group border lg:mt-lg xl:mt-xl border-gray-200 rounded-md flex items-center justify-between p-1'>
          <div className='flex items-center'>
            <div className='bg-gradient-radial hidden xl:block to-green-200 from-teal-300 h-7 w-7 rounded-md mr-2' />
            {getAccountQ.isSuccess ?
              <span className='text-xs hidden xl:block font-medium text-gray-700'>{getAccountQ.data.data.account.name}</span>
              :
              getAccountQ.isError ?
                <div className='skeleton-error h-4 w-24' />
                :
                <div className='skeleton h-4 w-24' />
            }
          </div>
          <div className='hidden group-hover:flex w-6 h-6 justify-center items-center rounded-md hover:bg-gray-100 cursor-pointer'>
            <ArrowRightOnRectangleIcon className='h-4 w-4 text-gray-500 stroke-2 mr-1' onClick={() => authContext.logout()} />
          </div>
        </div>

        {/* Navigation */}
        <div>
          {links.map((el, idx) => {
            return <Link to={el.path} key={`sidebar-nav-${idx}`} className={`flex justify-between mt-sm hover:bg-gray-100  p-2 cursor-pointer rounded-md ${currentPath == el.path ? 'bg-gray-100' : ''}`}>
              <div className='flex items-center'>
                <el.icon className='text-gray-400 h-5 w-5' />
                <span className='ml-xs text-sm font-medium text-gray-600 hidden xl:block'>{el.title}</span>
              </div>
              {
                el.numNotifications > 0 &&<span className='text-xs text-purple-700 bg-purple-200 rounded-full p-1 h-5 w-5 font-medium flex items-center justify-center'>{el.numNotifications}</span>
              }
            </Link>
          })}
        </div>
      </div>
      <div className='grid gap-4'>
        {
          TOGGLE_DEV_FEATURES && <div className='grid grid-cols-1 gap-2 mt-4'>
            {accounts?.map((el, idx) => {
              if (el.id === authContext.userID) return null
              return <DevAccountItem key={`account-key-${el.id}-${idx}`} account={el} />
            })}
          </div>
        }
      </div>
    </div>
  </div>
}
