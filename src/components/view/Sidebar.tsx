import { ExpandLess, ExpandMore, Group, GroupAdd,Home, Logout, Notes, Person } from '@mui/icons-material'
import { Collapse, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import { grey } from '@mui/material/colors'
import React, { useMemo, useState } from 'react'
import { LoaderIcon } from 'react-hot-toast'
import { FormattedMessage } from 'react-intl'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import notedLogo from '../../assets/logo/noted_logo.png'
import { useAuthContext } from '../../contexts/auth'
import { useCreateGroup, useListGroups } from '../../hooks/api/groups'
import { useListInvites } from '../../hooks/api/invites'
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
  numNotification?: number;
}

function createChildItems(
  children: IChildItems[],
  currentLocation: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createGroupQ: any,
): JSX.Element[] {
  const childrenLenght = children.length

  return children.map(({ name, url }, idx) => {
    if (name === 'button_create_group') {
      return (<Button
        key={name}
        variant='outlined'
        color='primary'
        className='mb-1'
        startIcon={!createGroupQ.isLoading && <GroupAdd style={{ color: '#2a777d' }} />}
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
            <LoaderIcon className='mr-4' style={{ width: '20px', height: '20px' }} /> 
            <Typography variant='h6' fontSize='16px'>
              <FormattedMessage id='GROUP.creatingGroup' />
            </Typography>
          </>
        ) : (
          <Typography variant='h6' fontSize='16px'>
            <FormattedMessage id='GROUP.createGroup' />
          </Typography>
        )}
      </Button>
      )
    }
    return (<Link
      key={url}
      to={url ? url : '/'}
      className={`ml-8 ${idx !== childrenLenght - 1 && 'mb-1'} ${idx === 0 && 'mt-1'} flex items-center justify-between rounded-md p-1 pl-2 hover:bg-gray-100 ${
        url && currentLocation.includes(url) ? 'bg-gray-100' : ''
      }`}>
      <Typography variant='h6' sx={{ color: grey[700] }} fontSize='16px'>
        {name}
      </Typography>
    </Link>)
  })
}

function createParentItems(
  items: INavbarItem[],
  currentLocation: string,
  collapseCallback: (tradKey: LocaleTranslationKeys) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createGroupQ: any,
  activeCollapse?: LocaleTranslationKeys | null,
): JSX.Element[] {
  return items.map(({ tradKey, url, icon, children, childrenStatus, numNotification }) => {
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
                  <ExpandLess className='ml-auto' /> 
                  : <ExpandMore className='ml-auto' />)}
            </a>
            {childrenStatus === 'success' && children ?
              <Collapse in={shouldCollapse}>
                <div className='flex flex-col'>
                  {createChildItems(children, currentLocation, createGroupQ)}
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
            {numNotification && numNotification > 0 && (
              <span className='flex h-5 w-5 items-center justify-center rounded-full bg-purple-200 p-1 text-xs font-medium text-purple-700'>
                {numNotification}
              </span>
            )}
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
  const listInvitesQ = useListInvites({ recipientAccountId: authContext.accountId })
  const listGroupsQ = useListGroups({ accountId: authContext.accountId })
  const [activeCollapse, setActiveCollapse] =
		useState<LocaleTranslationKeys | null>('GENERIC.groups')
  const createGroupQ = useCreateGroup()

  const handleCollapseClick = (tradKey: LocaleTranslationKeys): void => {
    setActiveCollapse((oldTradKey) =>
      oldTradKey === tradKey ? null : tradKey,
    )
  }

  const buttonCreateGroup: IChildItems = {name: 'button_create_group', url: ''}

  const navBarContent = useMemo(
    (): INavbarItem[] => {
      return [{
        tradKey: 'GENERIC.home',
        url: '/home',
        icon: <Home />,
      },
      {
        tradKey: 'GENERIC.groups',
        icon: <Group />,
        url: '/groups',
        children: listGroupsQ?.data?.groups ? [...listGroupsQ.data.groups.map((el) => ({name: el.name, url: `/group/${el.id}`})), buttonCreateGroup] : [buttonCreateGroup],
        childrenStatus: listGroupsQ.status,
      },
      {
        tradKey: 'GENERIC.notes',
        icon: <Notes />,
        url: '/notes',
        children: [],
      },
      {
        tradKey: 'GENERIC.profile',
        icon: <Person />,
        url: '/profile',
        numNotification: listInvitesQ.isSuccess && listInvitesQ.data.invites
          ? listInvitesQ.data.invites.length
          : 0
      },]}, [listGroupsQ, listInvitesQ]
  )
  const menuItems = useMemo(
    (): JSX.Element => (
      <>
        {createParentItems(
          navBarContent,  
          location.pathname,
          handleCollapseClick,
          createGroupQ,
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
              <Logout />
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
