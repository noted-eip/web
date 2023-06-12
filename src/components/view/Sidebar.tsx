import {
  ArrowRightIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { Square2StackIcon, UserIcon } from '@heroicons/react/24/solid'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import { useAuthContext } from '../../contexts/auth'
import {
  removeAccountFromDevelopmentContext,
  useDevelopmentContext
} from '../../contexts/dev'
import { useGetAccount } from '../../hooks/api/accounts'
import { useListInvites } from '../../hooks/api/invites'
import { useOurIntl } from '../../i18n/TextComponent'
import { apiQueryClient } from '../../lib/api'
import { LS_AUTH_TOKEN_KEY, LS_GROUP_ID_KEY } from '../../lib/constants'
import { TOGGLE_DEV_FEATURES } from '../../lib/env'

const DevAccountItem: React.FC<{ account: { id: string; token: string } }> = (props) => {
  const authContext = useAuthContext()
  const getAccountQ = useGetAccount({accountId: props.account.id})
  const setAccounts = useDevelopmentContext()?.setAccounts

  if (!setAccounts) return null

  return (
    <div
      className='group flex cursor-pointer justify-between rounded-md border border-gray-100 bg-gray-50 p-1 text-xs'
      onClick={() => {
        authContext.logout()
        window.localStorage.removeItem(LS_GROUP_ID_KEY)
        window.localStorage.setItem(LS_AUTH_TOKEN_KEY, props.account.token)
        apiQueryClient.clear()
        window.location.assign('/')
      }}
    >
      <div>
        <span className='float-right hidden text-gray-700 group-hover:underline xl:block'>
          {getAccountQ.data?.account.name.slice(0, 9)}
        </span>
        <span className='float-right text-gray-700 xl:hidden'>
          {getAccountQ.data?.account.name[0]}
        </span>
        <XMarkIcon
          className='float-right mr-1 h-4 w-3 stroke-2 text-gray-600 hover:stroke-[3px] hover:text-red-600'
          onClick={() =>
            removeAccountFromDevelopmentContext(props.account.id, setAccounts)
          }
        />
      </div>
      <ArrowRightIcon className='float-right ml-1 h-4 w-3 stroke-2 text-gray-600' />
    </div>
  )
}

export const Sidebar: React.FC = () => {
  const { formatMessage } = useOurIntl()
  const authContext = useAuthContext()
  const currentPath = useLocation().pathname
  const listInvitesQ = useListInvites({ recipientAccountId: authContext.accountId })
  const getAccountQ = useGetAccount({accountId: authContext.accountId})
  const accountsMap = useDevelopmentContext()?.accounts
  const [accounts, setAccounts] = React.useState<{ token: string; id: string }[]>()

  React.useEffect(() => {
    const temp: { token: string; id: string }[] = []
    for (const key in accountsMap) {
      temp.push({ token: accountsMap[key]?.token || '', id: key })
    }
    setAccounts(temp)
  }, [accountsMap])

  const links = [
    { path: '/', icon: Square2StackIcon, title: formatMessage({ id: 'GENERIC.home' }), numNotifications: 0 },
    {
      path: '/profile',
      icon: UserIcon,
      title: formatMessage({ id: 'GENERIC.profile' }),
      numNotifications:
        listInvitesQ.isSuccess && listInvitesQ.data.invites
          ? listInvitesQ.data.invites.length
          : 0,
    },
    // { path: '/settings', icon: Cog6ToothIcon, title: 'Settings', numNotifications: 0 },
  ]

  return (
    <div className='hidden h-screen flex-col border-r border-gray-300 md:flex'>
      <div className='sjustify-between m-lg mt-xl flex h-full flex-col xl:m-xl'>
        <div>
          {/* Logo */}
          <div className='h-[36px] w-[36px] rounded-md border border-gray-300 bg-gray-200' />

          {/* Account Indicator */}
          <div className='group flex items-center justify-between rounded-md border border-gray-200 p-1 lg:mt-lg xl:mt-xl'>
            <div className='flex items-center'>
              <div className='mr-2 hidden h-7 w-7 rounded-md bg-gradient-radial from-teal-300 to-green-200 xl:block' />
              {getAccountQ.isSuccess ? (
                <span className='hidden text-xs font-medium text-gray-700 xl:block'>
                  {getAccountQ.data.account.name}
                </span>
              ) : getAccountQ.isError ? (
                <div className='skeleton-error h-4 w-24' />
              ) : (
                <div className='skeleton h-4 w-24' />
              )}
            </div>
            <div className='hidden h-6 w-6 cursor-pointer items-center justify-center rounded-md hover:bg-gray-100 group-hover:flex'>
              <ArrowRightOnRectangleIcon
                className='mr-1 h-4 w-4 stroke-2 text-gray-500'
                onClick={() => authContext.logout()}
              />
            </div>
          </div>

          {/* Navigation */}
          <div>
            {links.map((el, idx) => {
              return (
                <Link
                  to={el.path}
                  key={`sidebar-nav-${idx}`}
                  className={`mt-sm flex cursor-pointer justify-between  rounded-md p-2 hover:bg-gray-100 ${
                    currentPath == el.path ? 'bg-gray-100' : ''
                  }`}
                >
                  <div className='flex items-center'>
                    <el.icon className='h-5 w-5 text-gray-400' />
                    <span className='ml-xs hidden text-sm font-medium text-gray-600 xl:block'>
                      {el.title}
                    </span>
                  </div>
                  {el.numNotifications > 0 && (
                    <span className='flex h-5 w-5 items-center justify-center rounded-full bg-purple-200 p-1 text-xs font-medium text-purple-700'>
                      {el.numNotifications}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
        <div className='grid gap-4'>
          {TOGGLE_DEV_FEATURES && (
            <div className='mt-4 grid grid-cols-1 gap-2'>
              {accounts?.map((el, idx) => {
                if (el.id === authContext.accountId) return null
                return <DevAccountItem key={`account-key-${el.id}-${idx}`} account={el} />
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
