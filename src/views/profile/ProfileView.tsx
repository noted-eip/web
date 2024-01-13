import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { PencilIcon } from '@heroicons/react/24/solid'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import InboxIcon from '@mui/icons-material/Inbox'
import InstallMobileIcon from '@mui/icons-material/InstallMobile'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import LanguageIcon from '@mui/icons-material/Language'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import SendIcon from '@mui/icons-material/Send'
import Button from '@mui/material/Button'
import { grey } from '@mui/material/colors'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { getAnalytics, logEvent } from 'firebase/analytics'
import React, { useState } from 'react'

import LoaderIcon from '../../components/icons/LoaderIcon'
import { StyledMenu } from '../../components/Menu/StyledMenu'
import ConfirmationPanel from '../../components/pop-up/confirmation-panel'
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
  const onChangeName = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    updateAccountQ.mutate({body: {name: newName} as V1Account})
    setEditName(false)
  }
  
  useClickOutside(newNameInputRef, () => {
    setEditName(false)
  })

  React.useEffect(() => {
    if (newName === undefined || !editName) {
      setNewName(getAccountQ.isSuccess ? getAccountQ.data.account.name : '')
    }
  }, [getAccountQ])

  
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
              disabled={denyInviteQ.isLoading || acceptInviteQ.isLoading}
              onClick={() => denyInviteQ.mutate({ groupId: props.invite?.groupId as string, inviteId: props.invite.id })}
              endIcon={
                denyInviteQ.isLoading ?
                  <LoaderIcon className='h-5 w-5' />
                  :
                  <ClearIcon color='error' />
              }
            >
              <FormatMessage id='PROFILE.invite.deny' />              
            </Button>
            <Button
              variant='outlined'
              color='success'
              disabled={denyInviteQ.isLoading || acceptInviteQ.isLoading}
              onClick={() => acceptInviteQ.mutate({ groupId: props.invite.groupId as string, inviteId: props.invite.id })}
              endIcon={
                acceptInviteQ.isLoading ?
                  <LoaderIcon className='h-5 w-5' />
                  :
                  <CheckIcon color='success' />
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
      <div className='flex items-center justify-between border-b border-[#efefef] px-5 py-3'>
        <div className='flex items-center'>
          <InboxIcon sx={{ color: grey[700] }} />
          <Typography variant='h6' sx={{ color: grey[700] }} ml={1}>
            <FormatMessage id='GROUP.Empty.title2' />
          </Typography>
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
      <div className='flex items-center justify-between border-b border-[#efefef] px-5 py-3'>
        <div className='flex items-center'>
          <LanguageIcon sx={{ color: grey[700] }} />
          <Typography variant='h6' sx={{ color: grey[700] }} ml={1}>
            <FormatMessage id='PROFILE.langage.title' />
          </Typography>
        </div>
      </div>
      <div className='grid grid-cols-[40%_60%] p-5'>
        <Typography variant='body2' sx={{ color: grey[600] }}>
          <FormatMessage id='PROFILE.langage.desc' />
        </Typography>
        <div className='flex items-center justify-end'>
          <div>
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
          </div>
        </div>
      </div>
    </div>
  )
}

const ProfileViewFeedbackSection: React.FC = () => {
  return (
    <div className='relative mt-4 w-full rounded-md border border-gray-100 bg-gray-50'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-[#efefef] px-5 py-3'>
        <div className='flex items-center'>
          <SendIcon sx={{ color: grey[700] }} />
          <Typography variant='h6' sx={{ color: grey[700] }} ml={1}>
            <FormatMessage id='PROFILE.feedback.title' />
          </Typography>
        </div>
      </div>

      <div className='grid grid-cols-[40%_60%] p-5' >
        <Typography variant='body2' sx={{ color: grey[600] }}>
          <FormatMessage id='PROFILE.feedback.desc' />
        </Typography>
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
  const [open, setOpen] = React.useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const onValidate = () => {
    deleteAccountQ.mutate(undefined)
  }


  return (
    <React.Fragment>
      {open ? <ConfirmationPanel onValidate={onValidate} title='PROFILE.delete.title2' content='PROFILE.delete.desc'/> : null}
      <div className='mt-4 w-full rounded-md border border-gray-100 bg-gray-50'>
        {/* Header */}
        <div className='flex items-center justify-between border-b border-[#efefef] px-5 py-3'>
          <div className='flex items-center'>
            <ReportProblemIcon sx={{ color: grey[700] }} />
            <Typography variant='h6' sx={{ color: grey[700] }} ml={1}>
              <FormatMessage id='PROFILE.delete.title1' />
            </Typography>
          </div>
        </div>
        <div className='grid grid-cols-[40%_60%] p-5'>
          <div>
            <Typography variant='body2' fontWeight='bold' sx={{ color: grey[800] }}>
              <FormatMessage id='PROFILE.delete.title2' />
            </Typography>
            <Typography variant='body2' sx={{ color: grey[600] }}>
              <FormatMessage id='PROFILE.delete.desc' />
            </Typography>
          </div>
          <div className='flex items-center justify-end'>
            <Button variant='outlined' color='error' onClick={handleOpen}>
              <FormatMessage id='PROFILE.delete.button' />
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
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
      <div className='flex items-center justify-between border-b border-[#efefef] px-5 py-3'>
        <div className='flex items-center'>
          <InstallMobileIcon sx={{ color: grey[700] }} />
          <Typography variant='h6' sx={{ color: grey[700] }} ml={1}>
            <FormatMessage id='PROFILE.beta.title' />
          </Typography>
        </div>
      </div>
      <div className='grid grid-cols-[40%_60%] p-5'>
        <div>
          <Typography variant='body2' fontWeight='bold' sx={{ color: grey[800] }}>
            <FormatMessage id='PROFILE.beta.subTitle' />
          </Typography>
          <Typography variant='body2' sx={{ color: grey[600] }}>
            <FormatMessage id='PROFILE.beta.desc' />
          </Typography>
          <Typography variant='body2' fontSize={12} sx={{ color: grey[400] }}>
            <FormatMessage id='PROFILE.beta.subDesc' />
          </Typography>
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
// TODO: est ce que ya eu des modifs dedans ouuuu ?
// const ProfileChangeLangage: React.FC = () => {
//   const context = React.useContext(LangageContext)
//   const analytics = getAnalytics()

//   if (!TOGGLE_DEV_FEATURES) {
//     logEvent(analytics, 'page_view', {
//       page_title: 'settings'
//     })
//   }
//   function classNames(...classes) {
//     return classes.filter(Boolean).join(' ')
//   }

//   return (
//     <div className='relative mt-4 w-full rounded-md border border-gray-100 bg-gray-50'>
//       {/* Header */}
//       <div className='flex items-center justify-between border-b border-[#efefef] p-5'>
//         <div className='flex items-center'>
//           <CodeBracketIcon className='mr-2 h-5 w-5 text-gray-600' />
//           <p className='text-base font-medium text-gray-600'>
//             <FormatMessage id='SETTINGS.langage.title' />
//           </p>
//         </div>
//       </div>
//       <div className='grid grid-cols-[40%_60%] p-5'>
//         <div className='relative inline-block text-left'>
//           <Menu as='div' className='relative inline-block text-left'>
//             <div>
//               <Menu.Button className='inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'>
//                 <FormatMessage id='SETTINGS.langage.options' />
//                 <ChevronDownIcon className='-mr-1 h-5 w-5 text-gray-400' aria-hidden='true' />
//               </Menu.Button>
//             </div>
//             <Transition
//               as={Fragment}
//               enter='transition ease-out duration-100'
//               enterFrom='transform opacity-0 scale-95'
//               enterTo='transform opacity-100 scale-100'
//               leave='transition ease-in duration-75'
//               leaveFrom='transform opacity-100 scale-100'
//               leaveTo='transform opacity-0 scale-95'
//             >
//               <Menu.Items className='absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black focus:outline-none'>
//                 <div className='py-1'>
//                   <Menu.Item>
//                     {({ active }) => (
//                       <a
//                         className={classNames(
//                           active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
//                           'block px-4 py-2 text-sm'
//                         )}
//                         onClick={() => {context?.changeLangage('fr')}}
//                       >
//                         <FormatMessage id='SETTINGS.langage.french' />
//                       </a>
//                     )}
//                   </Menu.Item>
//                   <Menu.Item>
//                     {({ active }) => (
//                       <a
//                         className={classNames(
//                           active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
//                           'block px-4 py-2 text-sm'
//                         )}
//                         onClick={() => {context?.changeLangage('en')}}
//                       >
//                         <FormatMessage id='SETTINGS.langage.english' />
//                       </a>
//                     )}
//                   </Menu.Item>
//                 </div>
//               </Menu.Items>
//             </Transition>
//           </Menu>
//         </div>
//       </div>
//     </div>
//   )
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