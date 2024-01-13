import { Notes, Settings } from '@mui/icons-material'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { getAnalytics, logEvent } from 'firebase/analytics'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useGroupContext } from '../../contexts/group'
import { useOurIntl } from '../../i18n/TextComponent'
import { TOGGLE_DEV_FEATURES } from '../../lib/env'

const GroupViewMenu: React.FC<React.PropsWithChildren & { activeTab: string }> = (props) => {
  const analytics = getAnalytics()
  const { formatMessage } = useOurIntl()
  const navigate = useNavigate()
  const groupContext = useGroupContext()
  const options = [
    {
      name: formatMessage({id: 'GENERIC.notes'}),
      path: '',
      icon: <Notes />,
    },
    {
      name: formatMessage({id: 'GROUP.settings'}),
      path: 'settings',
      icon: <Settings />,
    },
  ]

  if (!TOGGLE_DEV_FEATURES) {
    logEvent(analytics, 'page_view', {
      page_title: 'group_home_page'
    })
  }
  return (
    <div className='flex items-center justify-between'>
      {props.children}
      <Tabs
        value={props.activeTab}
        onChange={(event, val) => {
          navigate(`/group/${groupContext.groupId}/${val}`)}}
        textColor='secondary'
        indicatorColor='secondary'
        aria-label='secondary tabs example'
      >
        {options.map((el, idx) => {
          return <Tab
            key={`group-view-menu-tab-${el}-${idx}-option`}
            value={el.path}
            label={el.name}
            icon={el.icon}
            iconPosition='start'
          />
        })}
      </Tabs>
    </div>
  )
}

export default GroupViewMenu
