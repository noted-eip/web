import { getAnalytics, logEvent } from 'firebase/analytics'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { TOGGLE_DEV_FEATURES } from '../../lib/env'

const NotFoundView: React.FC = () => {
  const navigate = useNavigate()
  const analytics = getAnalytics()
  
  if (!TOGGLE_DEV_FEATURES) {
    logEvent(analytics, 'page_view', {
      page_title: 'not_found'
    })
  }
  React.useEffect(() => {
    navigate('/')
  })

  return null
}

export default NotFoundView
