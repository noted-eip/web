import { Menu, Transition } from '@headlessui/react'
import { ArrowPathIcon, ChatBubbleOvalLeftEllipsisIcon,CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, CodeBracketIcon, ExclamationTriangleIcon, InboxIcon, PencilIcon } from '@heroicons/react/24/solid'
import { getAnalytics, logEvent } from 'firebase/analytics'
import React, { Fragment, useState } from 'react'

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
          <React.Fragment>
            <button
              disabled={denyInviteQ.isLoading || acceptInviteQ.isLoading}
              className='group flex cursor-pointer items-center rounded-full bg-red-100 p-1 px-3 text-xs font-medium text-red-700 hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-700'
              onClick={() => denyInviteQ.mutate({ groupId: props.invite?.groupId as string, inviteId: props.invite.id })}
            >
              <FormatMessage id='PROFILE.invite.deny' />
              {
                denyInviteQ.isLoading ?
                  <LoaderIcon className='ml-1 h-3 w-3' />
                  :
                  <XMarkIcon className='ml-1 h-3 w-3 stroke-[3px] text-red-700 transition-all group-hover:scale-[120%] group-disabled:text-gray-700' />
              }
              
            </button>
            <button
              disabled={denyInviteQ.isLoading || acceptInviteQ.isLoading}
              className='group ml-2 flex cursor-pointer items-center rounded-full bg-green-100 p-1 px-3 text-xs font-medium text-green-700 hover:bg-green-200 disabled:bg-gray-100 disabled:text-gray-700'
              onClick={() => acceptInviteQ.mutate({ groupId: props.invite.groupId as string, inviteId: props.invite.id })}
            >
              <FormatMessage id='PROFILE.invite.accept' />
              {
                acceptInviteQ.isLoading ?
                  <LoaderIcon className='ml-1 h-3 w-3' />
                  :
                  <CheckIcon className='ml-1 h-3 w-3 stroke-[3px] text-green-700 transition-all group-hover:scale-[120%] group-disabled:text-gray-700' />
              }
            </button>
          </React.Fragment>
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

  // >:(
  const onChangeName = (e:any) => {
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
          <button
            className='rounded-md border border-gray-300 bg-white p-2 px-3 text-sm text-red-600 transition-all duration-100 hover:border-red-600 hover:bg-red-600 hover:text-white'
            onClick={() => {deleteAccountQ.mutate(undefined)}}
          >
            <FormatMessage id='PROFILE.delete.button' />
          </button>
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

      <div className='grid grid-cols-[40%_60%] p-5'>
        <div className='relative'>
          <p className='text-xs text-gray-600'>
            <FormatMessage id='PROFILE.feedback.desc' />
          </p>
        </div>
        <div className='flex items-center justify-end'>
          <button
            className='rounded-md border border-gray-300 bg-white p-2 px-3 text-sm text-gray-600 transition-all duration-100 hover:border-gray-600 hover:bg-gray-600 hover:text-white'
            onClick={() => {hrefFunction()}}
          >
            <FormatMessage id='PROFILE.feedback.button' />
          </button>
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
          {getAccountQ.isSuccess ? (getAccountQ.data?.account.isInMobileBeta === false ? (<button
            className='rounded-md border border-gray-300 bg-white p-2 px-3 text-sm text-gray-600 transition-all duration-100 hover:border-gray-600 hover:bg-gray-600 hover:text-white'
            onClick={() => {
              registerToMobileBetaQ.mutate(undefined)
              setSent(true)
            }}
          >
            <FormatMessage id='PROFILE.beta.button' />
          </button>) : (sent ? formatMessage({id: 'PROFILE.beta.buttonResTrue'}) : formatMessage({id: 'PROFILE.beta.buttonResFalse'}))) :             
            (<React.Fragment>
              <div className='skeleton h-8 w-24'></div>
            </React.Fragment>)
          }
        </div>
      </div>
    </div>
  )
}

function hrefFunction() {
  window.open('https://docs.google.com/forms/d/e/1FAIpQLSdkkpJ6Y_sXB74Hpr1kXHVn2nQF37ktCVX7vtdUTUnJhfWsZw/viewform?usp=pp_url&entry.368849087=Compr%C3%A9hensible&entry.708712048=Bien&entry.1430431403=Bien&entry.402690215=Tr%C3%A8s+utile&entry.1070466955=Oui', '_blank')
}

const ProfileChangeLangage: React.FC = () => {
  const context = React.useContext(LangageContext)
  const analytics = getAnalytics()
  
  if (!TOGGLE_DEV_FEATURES) {
    logEvent(analytics, 'page_view', {
      page_title: 'settings'
    })
  }
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <div className='relative mt-4 w-full rounded-md border border-gray-100 bg-gray-50'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-[#efefef] p-5'>
        <div className='flex items-center'>
          <CodeBracketIcon className='mr-2 h-5 w-5 text-gray-600' />
          <p className='text-base font-medium text-gray-600'>              
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
              <Menu.Items className='absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black focus:outline-none'>
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
  )
}


const ProfileView: React.FC = () => {
  const { formatMessage } = useOurIntl()

  return (
    <ViewSkeleton title={formatMessage({id: 'GENERIC.profile'})} panels={['group-activity']}>
      <div className='mx-lg mb-lg w-full xl:mx-xl xl:mb-xl'>
        <ProfileViewAccountSection />
        <hr className='m-5 rounded border-2'></hr>
        <ProfileViewPendingInvitesSection />
        <ProfileViewDangerZoneSection />
        <hr className='m-5 rounded border-2'></hr>
        <ProfileViewFeedbackSection />
        <hr className='m-5 rounded border-2'></hr>
        <ProfileViewBetaSection />
        <hr className='m-5 rounded border-2'></hr>
        <ProfileChangeLangage />
      </div>
    </ViewSkeleton>
  )
}

export default ProfileView
