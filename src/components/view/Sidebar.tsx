import { ExpandLess, ExpandMore, Group, Home, Logout, Notes, Person } from '@mui/icons-material'
import { Collapse, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import React, { useMemo, useState } from 'react'
import { LoaderIcon } from 'react-hot-toast'
import { FormattedMessage } from 'react-intl'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import notedLogo from '../../assets/logo/noted_logo.png'
import { useAuthContext } from '../../contexts/auth'
import { useListGroups } from '../../hooks/api/groups'
import { LocaleTranslationKeys } from '../../i18n/types'

interface IChildItems {
  name: string;
  url: string;
}

interface INavbarItem {
  tradKey: LocaleTranslationKeys;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any;
  url: string;
  children?: IChildItems[];
  childrenStatus?: string;
}

function createChildItems(
  children: IChildItems[],
  currentLocation: string,
): JSX.Element[] {
  return children.map(({ name, url }) => {
    return (<Link
      key={url}
      to={url ? url : '/'}
      className={`ml-8 flex items-center justify-between rounded-md p-3 hover:bg-gray-100 ${
        url && currentLocation.includes(url) ? 'bg-gray-100' : ''
      }`}    >
      {name}
    </Link>)
  })
}

function createParentItems(
  items: INavbarItem[],
  currentLocation: string,
  collapseCallback: (tradKey: LocaleTranslationKeys) => void,
  activeCollapse?: LocaleTranslationKeys | null,
): JSX.Element[] {
  return items.map(({ tradKey, url, icon, children, childrenStatus }) => {
    const shouldCollapse =
			activeCollapse === tradKey ||
			(activeCollapse === undefined && url && currentLocation.includes(url)) ? true : false
    if (activeCollapse === undefined && shouldCollapse === true) {
      collapseCallback(tradKey)
    }
    return (
      <nav key={tradKey} className='mb-2'>
        {childrenStatus ? (
          <>
            <a
              onClick={(): void => collapseCallback(tradKey)}
              role='button'
              className={`flex items-center justify-between rounded-md p-3 hover:bg-gray-100 ${
                url && currentLocation.includes(url) ? 'bg-gray-100' : ''
              }`}
            >
              <div className='flex items-center'>
                {icon != null && icon}
                <Typography variant='h6' sx={{ color: grey[700] }} ml={1}>
                  <FormattedMessage id={tradKey} />
                </Typography>
              </div>
              {childrenStatus === 'loading' ? 
                <LoaderIcon className='h-5 w-5' style={{ color: grey[700] }} /> 
                : (shouldCollapse ? 
                  <ExpandLess className='ml-auto h-5 w-5' sx={{ color: grey[700] }}/> 
                  : <ExpandMore className='ml-auto h-5 w-5' sx={{ color: grey[700] }}/>)}
            </a>
            {childrenStatus === 'success' && children ?
              <Collapse in={shouldCollapse}>
                <div>
                  <div className='flex flex-col'>
                    {createChildItems(children, currentLocation)}
                  </div>
                </div>
              </Collapse> : (childrenStatus === 'loading' ? <></> : 
                childrenStatus === 'error' && (
                  <Typography variant='h6' color='error' ml={1}>
              error
                  </Typography>))
            }
          </>
        ) : (
          <Link
            to={url ? url : '/'}
            className={`flex items-center justify-between rounded-md p-3 hover:bg-gray-100 ${
              url && currentLocation.includes(url) ? 'bg-gray-100' : ''
            }`}
          >
            <div className='flex items-center'>
              {icon != null && icon}
              <Typography variant='h6' sx={{ color: grey[700] }} ml={1}>
                <FormattedMessage id={tradKey} />
              </Typography>
              
            </div>
          </Link>
        )}
      </nav>
    )
  })
}

export const Sidebar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const authContext = useAuthContext()
  const listGroupsQ = useListGroups({ accountId: authContext.accountId })
  const [activeCollapse, setActiveCollapse] =
		useState<LocaleTranslationKeys | null>()

  const handleCollapseClick = (tradKey: LocaleTranslationKeys): void => {
    setActiveCollapse((oldTradKey) =>
      oldTradKey === tradKey ? null : tradKey,
    )
  }

  const navBarContent = useMemo(
    (): INavbarItem[] => {
      return [{
        tradKey: 'GENERIC.home',
        url: '/',
        icon: <Home className='h-5 w-5' sx={{ color: grey[700] }} />,
      },
      {
        tradKey: 'GENERIC.groups',
        icon: <Group className='h-5 w-5' sx={{ color: grey[700] }} />,
        url: '/groups',
        children: listGroupsQ?.data?.groups ? listGroupsQ.data.groups.map((el) => ({name: el.name, url: `/group/${el.id}`})) : [],
        childrenStatus: listGroupsQ.status,
      },
      {
        tradKey: 'GENERIC.notes',
        icon: <Notes className='h-5 w-5' sx={{ color: grey[700] }} />,
        url: '/notes',
        children: [],
      },
      {
        tradKey: 'GENERIC.profile',
        icon: <Person className='h-5 w-5' sx={{ color: grey[700] }} />,
        url: '/profile',
      },]}, [listGroupsQ]
  )
  const menuItems = useMemo(
    (): JSX.Element => (
      <>
        {createParentItems(
          navBarContent,
          location.pathname,
          handleCollapseClick,
          activeCollapse,
        )}
      </>
    ),
    [location, activeCollapse, navBarContent],
  )

  return (
    <div className='hidden h-screen flex-col border-r border-gray-300 md:flex md:w-[215px]'>
      <div className='flex h-full w-full flex-col'>
        {/* Logo */}
        <div className='mt-xl flex h-[36px] min-h-[36px] items-center justify-center lg:mx-lg lg:mb-lg xl:mx-xl xl:mb-xl'>
          <img src={notedLogo} alt='Logo' style={{ maxWidth: '50px', marginRight: '12px' }} onClick={() => navigate('/')}/>
          <span className='text-xl font-bold text-gray-800'>Noted</span>
        </div>
        {/* Top */}
        <div className='flex h-full flex-col justify-center md:px-md md:pb-md lg:px-lg lg:pb-lg'>
          <div className='mt-4'>
            {menuItems}
          </div>
          {/* Bottom */}
          <div className='mt-auto'>
            <button
              className='flex items-center justify-between rounded-md p-3 hover:bg-gray-100'
              onClick={() => authContext.logout()}
            >
              <Logout className='h-5 w-5' sx={{ color: grey[700] }} />
              <Typography variant='h6' sx={{ color: grey[700] }} ml={1}>
                <FormattedMessage id='GENERIC.logout' />
              </Typography>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
