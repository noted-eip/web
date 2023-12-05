import { Square2StackIcon, UserIcon } from '@heroicons/react/24/solid'
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  Typography,
} from '@mui/material'
import { Theme } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
import { styled } from '@mui/system'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import { useAuthContext } from '../../contexts/auth'
import { useDevelopmentContext } from '../../contexts/dev'
import { useGetAccount } from '../../hooks/api/accounts'
import { useListInvites } from '../../hooks/api/invites'
import { useOurIntl } from '../../i18n/TextComponent'
import { apiQueryClient } from '../../lib/api'
import { LS_GROUP_ID_KEY } from '../../lib/constants'
  
const StyledDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }: { theme: Theme; open: boolean }) => ({
  '& .MuiDrawer-paper': {
    width: '240px',
    boxSizing: 'border-box',
    ...(open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      width: '240px',
    }),
  },
}))
  
// const StyledLink = styled(Link)({
//   textDecoration: 'none',
//   color: 'inherit',
// })
  
export const NewSidebar: React.FC = () => {
  const { formatMessage } = useOurIntl()
  const authContext = useAuthContext()
  const currentPath = useLocation().pathname
  const listInvitesQ = useListInvites({ recipientAccountId: authContext.accountId })
  const getAccountQ = useGetAccount({ accountId: authContext.accountId })
  const accountsMap = useDevelopmentContext()?.accounts
  const [accounts, setAccounts] = React.useState<{ token: string; id: string }[]>()
  const theme = useTheme()
  
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
    }
  ]
  
  const handleLogout = () => {
    authContext.logout()
    window.localStorage.removeItem(LS_GROUP_ID_KEY)
    apiQueryClient.clear()
    window.location.assign('/')
  }
  
  return (
    <StyledDrawer theme={theme} variant='persistent' anchor='left' open>
      <Box m={3} mt={5} mb={2} display='flex' flexDirection='column' justifyContent='space-between'>
        {/* Logo */}
        {/* <Avatar variant='rounded' sx={{ width: 36, height: 36, backgroundColor: 'gray.200' }} /> */}
  
        {/* Account Indicator */}
        {/* <Box
            className='group flex items-center justify-between rounded-md border border-gray-200 p-1 lg:mt-lg xl:mt-xl'
            mt={2}
          >
            <Box display='flex' alignItems='center'>
              <Box
                mr={2}
                sx={{
                  display: 'none',
                  width: 28,
                  height: 28,
                  borderRadius: 'md',
                  backgroundImage: 'linear-gradient(to bottom right, teal 50%, green 50%)',
                  backgroundSize: 'cover',
                }}
              />
              {getAccountQ.isSuccess ? (
                <Typography variant='body2' color='text.primary'>
                  {getAccountQ.data.account.name}
                </Typography>
              ) : getAccountQ.isError ? (
                <Skeleton variant='text' width={120} height={16} />
              ) : (
                <Skeleton variant='text' width={120} height={16} />
              )}
            </Box>
            <IconButton
              size='small'
              sx={{ width: 32, height: 32, cursor: 'pointer' }}
              onClick={() => authContext.logout()}
            >
              <ArrowRightOnRectangleIcon sx={{ width: 16, height: 16, color: 'text.secondary' }} />
            </IconButton>
          </Box> */}
  
        {/* Navigation */}
        <List>
          {links.map((el, idx) => (
            <Link
              to={el.path}
              key={`sidebar-nav-${idx}`}
              className={`flex items-center justify-between rounded-md p-3 hover:bg-gray-100 ${
                currentPath === el.path ? 'bg-gray-100' : ''
              }`}
            >
              <ListItem
                className={`mt-sm flex justify-between  rounded-md p-2 hover:bg-gray-100 ${
                  currentPath === el.path ? 'bg-gray-100' : ''
                }`}
              >
                <Box display='flex' alignItems='center'>
                  <ListItemIcon sx={{ color: 'text.secondary', mr: 1 }}>
                    <el.icon className='h-5 w-5 text-gray-400' />
                  </ListItemIcon>
                  <Typography variant='body2' color='text.secondary'>
                    {el.title}
                  </Typography>
                </Box>
                {el.numNotifications > 0 && (
                  <Typography
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: 'full',
                      backgroundColor: 'purple.200',
                      color: 'purple.700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                    }}
                  >
                    {el.numNotifications}
                  </Typography>
                )}
              </ListItem>
            </Link>
          ))}
        </List>
      </Box>
  
      {/* Dev Features */}
      {/* {TOGGLE_DEV_FEATURES && (
          <Box mt={4}>
            <Typography variant='subtitle1' fontWeight='bold' mb={2}>
              Development Accounts
            </Typography>
            <List>
              {accounts.map((el, idx) => (
                <DevAccountItem key={`account-key-${el.id}-${idx}`} account={el} />
              ))}
            </List>
          </Box>
        )} */}
    </StyledDrawer>
  )
}
  