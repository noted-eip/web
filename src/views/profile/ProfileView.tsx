import { ArrowPathIcon, ChatBubbleOvalLeftEllipsisIcon,CheckIcon } from '@heroicons/react/24/outline'
import {CodeBracketIcon, ExclamationTriangleIcon, InboxIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { Dropdown } from '@mui/base/Dropdown'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Button from '@mui/material/Button'
import Menu, { MenuProps } from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import { alpha,styled } from '@mui/material/styles'
import { getAnalytics, logEvent } from 'firebase/analytics'
import React, { useState } from 'react'

import LoaderIcon from '../../components/icons/LoaderIcon'
import ViewSkeleton from '../../components/view/ViewSkeleton'
import { useAuthContext } from '../../contexts/auth'
import { LangageContext } from '../../contexts/langage'
import { useDeleteMyAccount, useGetAccount, useRegisterToMobileBeta, useUpdateMyAccount } from '../../hooks/api/accounts'
import { useGetGroup } from '../../hooks/api/groups'
import { useAcceptInvite, useDenyInvite, useListInvites } from '../../hooks/api/invites'
import useClickOutside from '../../hooks/click'
import { FormatMessage, useOurIntl } from '../../i18n/TextComponent'
import { TOGGLE_DEV_FEATURES } from '../../lib/env'
import { V1Account, V1GroupInvite } from '../../protorepo/openapi/typescript-axios'

const ProfileViewAccountSection: React.FC = () => {
  const authContext = useAuthContext()
  const [editName, setEditName] = React.useState(false)
  const [newName, setNewName] = React.useState<string | undefined>(undefined)
  const updateAccountQ = useUpdateMyAccount()
  const getAccountQ = useGetAccount({accountId: authContext.accountId})
  const newNameInputRef = React.createRef<HTMLInputElement>()

  useClickOutside(newNameInputRef, () => {
    setEditName(false)
  })

  React.useEffect(() => {
    if (newName === undefined || !editName) {
      setNewName(getAccountQ.isSuccess ? getAccountQ.data.account.name : '')
    }
  }, [getAccountQ])

  const onChangeName = (e) => {
    e.preventDefault()
    updateAccountQ.mutate({body: {name: newName} as V1Account})
    setEditName(false)
  }

  return (
    <div className='rounded-md border border-gray-100 bg-gray-50 bg-gradient-to-br p-4'>
      <div className='flex items-center'>
        <div className='group mr-4 h-16 w-16 rounded-md bg-gradient-radial from-teal-300 to-green-200'>
          <div className='hidden h-full w-full cursor-pointer items-center justify-center rounded-md bg-[rgba(255,255,255,0.2)] group-hover:flex'>
            <ArrowPathIcon className='hidden h-6 w-6 stroke-2 text-gray-500 group-hover:block' />
          </div>
        </div>
        <div className='flex flex-col'>
          {getAccountQ.isSuccess ? (
            <React.Fragment>
              <div
                className='group flex h-8 cursor-pointer items-center'
                onClick={() => {
                  setEditName(true)
                }}
              >
                {editName ? (
                  <form onSubmit={onChangeName}>
                    <input
                      ref={newNameInputRef}
                      autoFocus
                      className='ml-[-5px] w-48 rounded border-gray-200 bg-white px-1 py-0 font-medium'
                      type='text'
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                    <button type='submit' />
                  </form>
                ) : (
                  <React.Fragment>
                    <p className='font-medium'>{getAccountQ.data?.account.name}</p>
                    <PencilIcon className='ml-2 hidden h-4 w-4 stroke-2 text-gray-400 group-hover:block' />
                  </React.Fragment>
                )}
              </div>
              <div>
                <p className='text-gray-700'>{getAccountQ?.data.account.email}</p>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className='skeleton h-4 w-48'></div>
              <div className='skeleton mt-4 h-4 w-64'></div>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  )
}

const InviteListItem: React.FC<{ invite: V1GroupInvite }> = (props) => {
  const getGroupQ = useGetGroup({ groupId: props.invite.groupId as string })
  const denyInviteQ = useDenyInvite()
  const acceptInviteQ = useAcceptInvite()

  const analytics = getAnalytics()
  
  if (!TOGGLE_DEV_FEATURES) {
    logEvent(analytics, 'page_view', {
      page_title: 'profile'
    })
  }
  return (
    <div className='my-2 grid h-12 grid-cols-3'>
      <div className='flex items-center'>
        <div className='h-9 w-9 rounded-md bg-gradient-to-br from-orange-300 to-red-300' />
        <div className='pl-3 text-sm font-medium text-gray-800'>
          {getGroupQ.isSuccess ? (
            getGroupQ.data.group.name
          ) : (
            <div className='skeleton h-4 w-16' />
          )}
        </div>
      </div>
      <div className='flex items-center text-sm'>
        {getGroupQ.isSuccess ? (
          <p className='text-sm text-gray-500'>{getGroupQ.data.group.description}</p>
        ) : (
          <div className='skeleton h-4 w-48' />
        )}
      </div>
      <div className='flex items-center justify-end'>
        {getGroupQ.isSuccess && (
          <Stack direction='row' spacing={2}>
            <Button 
              variant='outlined'
              color='error'
              size='small'
              disabled={denyInviteQ.isLoading || acceptInviteQ.isLoading}
              onClick={() => denyInviteQ.mutate({ groupId: props.invite?.groupId as string, inviteId: props.invite.id })}
              endIcon={
                denyInviteQ.isLoading ?
                  <LoaderIcon className='h-5 w-5' />
                  :
                  <XMarkIcon className='h-5 w-5 stroke-[3px] text-red-700 transition-all group-hover:scale-[120%] group-disabled:text-gray-700' />
              }
            >
              <FormatMessage id='PROFILE.invite.deny' />              
            </Button>
            <Button
              variant='outlined'
              color='success'
              size='small'
              disabled={denyInviteQ.isLoading || acceptInviteQ.isLoading}
              onClick={() => acceptInviteQ.mutate({ groupId: props.invite.groupId as string, inviteId: props.invite.id })}
              endIcon={
                acceptInviteQ.isLoading ?
                  <LoaderIcon className='h-5 w-5' />
                  :
                  <CheckIcon className='h-5 w-5 stroke-[3px] text-green-700 transition-all group-hover:scale-[120%] group-disabled:text-gray-700' />
              }
            >
              <FormatMessage id='PROFILE.invite.accept' />            
            </Button>
          </Stack>
        )}
      </div>
    </div>
  )
}

const ProfileViewPendingInvitesSection: React.FC = () => {
  const authContext = useAuthContext()
  const listInvitesQ = useListInvites({ recipientAccountId: authContext.accountId })

  return (
    <div className='mt-4 w-full rounded-md border border-gray-100 bg-gray-50'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-[#efefef] p-5'>
        <div className='flex items-center'>
          <InboxIcon className='mr-2 h-5 w-5 text-gray-600' />
          <p className='text-base font-medium text-gray-600'>
            <FormatMessage id='GROUP.Empty.title2' />
          </p>
        </div>
      </div>

      {/* List */}
      <div className='grid w-full grid-cols-1 gap-4 px-5'>
        {listInvitesQ.isSuccess ? (
          !listInvitesQ.data.invites?.length ? (
            <div className='my-4 text-center text-sm text-gray-400'>
              <FormatMessage id='PROFILE.invite.desc' />
            </div>
          ) : (
            listInvitesQ.data.invites?.map((el, idx) => (
              <InviteListItem key={`group-member-list-${el.id}-${idx}`} invite={el} />
            ))
          )
        ) : (
          <div>
            <div className='skeleton my-6 h-6 w-full' />
            <div className='skeleton mb-6 h-6 w-full' />
          </div>
        )}
      </div>
    </div>
  )
}

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}))

const ProfileChangeLangage: React.FC = () => {
  const context = React.useContext(LangageContext)
  const analytics = getAnalytics()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    
    setAnchorEl(null)
  }
  
  if (!TOGGLE_DEV_FEATURES) {
    logEvent(analytics, 'page_view', {
      page_title: 'settings'
    })
  }

  return (
    <div className='relative mt-4 w-full rounded-md border border-gray-100 bg-gray-50'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-[#efefef] p-5'>
        <div className='flex items-center'>
          <CodeBracketIcon className='mr-2 h-5 w-5 text-gray-600' />
          <p className='text-base font-medium text-gray-600'>              
            <FormatMessage id='PROFILE.langage.title' />
          </p>
        </div>
      </div>
      <div className='grid grid-cols-[40%_60%] p-5'>
        <div className='relative'>
          <p className='text-xs text-gray-600'>
            <FormatMessage id='PROFILE.langage.desc' />
          </p>
        </div>
        <div className='flex items-center justify-end'>
          {/* BALISE */}
          <Dropdown>
            <Button
              id='demo-customized-button'
              aria-controls={open ? 'demo-customized-menu' : undefined}
              aria-haspopup='true'
              aria-expanded={open ? 'true' : undefined}
              variant='outlined'
              disableElevation
              onClick={handleClick}
              endIcon={<KeyboardArrowDownIcon />}
            >
              {context?.langage === 'fr' ? 'Français' : 'English'}
            </Button>
            <StyledMenu
              id='demo-customized-menu'
              MenuListProps={{
                'aria-labelledby': 'demo-customized-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={() => {
                context?.changeLangage(context?.langage === 'en' ? 'fr' : 'en')
                handleClose()}}>
                {context?.langage === 'en' ? <FormatMessage id='PROFILE.langage.fr' /> : <FormatMessage id='PROFILE.langage.en' /> }
              </MenuItem>
            </StyledMenu>
          </Dropdown>
          {/* BALISE */}
        </div>
      </div>
    </div>
  )
}

const ProfileViewFeedbackSection: React.FC = () => {
  return (
    <div className='relative mt-4 w-full rounded-md border border-gray-100 bg-gray-50'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-[#efefef] p-5'>
        <div className='flex items-center'>
          <ChatBubbleOvalLeftEllipsisIcon className='mr-2 h-5 w-5 text-gray-600' />
          <p className='text-base font-medium text-gray-600'>
            <FormatMessage id='PROFILE.feedback.title' />
          </p>
        </div>
      </div>

      <div className='grid grid-cols-[40%_60%] p-5' >
        <div className='relative'>
          <p className='text-xs text-gray-600'>
            <FormatMessage id='PROFILE.feedback.desc' />
          </p>
        </div>
        <div className='flex items-center justify-end'>
          <Button variant='outlined'>
            <FormatMessage id='PROFILE.feedback.button' />
          </Button>
        </div>
      </div>
    </div>
  )
}

const ProfileViewDangerZoneSection: React.FC = () => {
  const deleteAccountQ = useDeleteMyAccount()

  return (
    <div className='mt-4 w-full rounded-md border border-gray-100 bg-gray-50'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-[#efefef] p-5'>
        <div className='flex items-center'>
          <ExclamationTriangleIcon className='mr-2 h-5 w-5 text-red-700' />
          <p className='text-base font-medium text-red-700'>
            <FormatMessage id='PROFILE.delete.title1' />
          </p>
        </div>
      </div>

      <div className='grid grid-cols-[40%_60%] p-5'>
        <div>
          <p className='mb-2 text-sm font-medium text-gray-800'>
            <FormatMessage id='PROFILE.delete.title2' />
          </p>
          <p className='text-xs text-gray-600'>
            <FormatMessage id='PROFILE.delete.desc' />
          </p>
        </div>
        <div className='flex items-center justify-end'>
          <Button variant='outlined' color='error' onClick={() => {deleteAccountQ.mutate(undefined)}}>
            <FormatMessage id='PROFILE.delete.button' />
          </Button>
        </div>
      </div>
    </div>
  )
}

const ProfileViewBetaSection: React.FC = () => {
  const { formatMessage } = useOurIntl()
  const authContext = useAuthContext()
  const getAccountQ = useGetAccount({accountId: authContext.accountId})
  const [sent, setSent] = useState(false)
  const registerToMobileBetaQ = useRegisterToMobileBeta()

  return (
    <div className='relative mt-4 w-full rounded-md border border-gray-100 bg-gray-50'>
      {/* Header */}
      <span className='absolute right-auto top-0 left-3 -translate-y-1/2 -translate-x-1/2 -rotate-12 rounded-full bg-red-400 p-0.5 px-2 text-center text-xs font-medium leading-none text-white outline outline-red-100 dark:bg-blue-900 dark:text-blue-200'>
        BETA
      </span>
      <div className='flex items-center justify-between border-b border-[#efefef] p-5'>
        <div className='flex items-center'>
          <CodeBracketIcon className='mr-2 h-5 w-5 text-gray-600' />
          <p className='text-base font-medium text-gray-600'>
            <FormatMessage id='PROFILE.beta.title' />
          </p>
        </div>
      </div>

      <div className='grid grid-cols-[40%_60%] p-5'>
        <div className='relative'>
          <p className='mb-2 text-sm font-medium text-gray-800'>
            <FormatMessage id='PROFILE.beta.subTitle' />
          </p>
          <p className='text-xs text-gray-600'>
            <FormatMessage id='PROFILE.beta.desc' />
          </p>
          <p className='text-xxs text-gray-500'>
            <FormatMessage id='PROFILE.beta.subDesc' />
          </p>
        </div>
        <div className='flex items-center justify-end'>
          {getAccountQ.isSuccess ? (getAccountQ.data?.account.isInMobileBeta === false ? (
            <Button variant='outlined'
              onClick={() => {
                registerToMobileBetaQ.mutate(undefined)
                setSent(true)
              }}
            >
              <FormatMessage id='PROFILE.beta.button' />
            </Button>
          ) : (sent ? formatMessage({id: 'PROFILE.beta.buttonResTrue'}) : formatMessage({id: 'PROFILE.beta.buttonResFalse'}))) :             
            (<React.Fragment>
              <div className='skeleton h-8 w-24'></div>
            </React.Fragment>)
          }
        </div>
      </div>
    </div>
  )
}

// TODO: ca branle quoi la
// function hrefFunction() {
//   window.open('https://docs.google.com/forms/d/e/1FAIpQLSdkkpJ6Y_sXB74Hpr1kXHVn2nQF37ktCVX7vtdUTUnJhfWsZw/viewform?usp=pp_url&entry.368849087=Compr%C3%A9hensible&entry.708712048=Bien&entry.1430431403=Bien&entry.402690215=Tr%C3%A8s+utile&entry.1070466955=Oui', '_blank')
// }

const ProfileView: React.FC = () => {
  const { formatMessage } = useOurIntl()

  return (
    <ViewSkeleton title={formatMessage({id: 'GENERIC.profile'})} panels={['group-activity']}>
      <div className='mx-lg mb-lg w-full xl:mx-xl xl:mb-xl'>
        <ProfileViewAccountSection />
        <ProfileViewPendingInvitesSection />
        <ProfileChangeLangage />
        <ProfileViewFeedbackSection />
        <ProfileViewDangerZoneSection />
        <ProfileViewBetaSection />
      </div>
    </ViewSkeleton>
  )
}

export default ProfileView
