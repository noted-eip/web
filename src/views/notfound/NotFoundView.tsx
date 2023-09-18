import { getAnalytics, logEvent } from 'firebase/analytics'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFoundView: React.FC = () => {
  const navigate = useNavigate()
  const analytics = getAnalytics()
  
  logEvent(analytics, 'page_view', {
    page_title: 'not_found'
  })
  React.useEffect(() => {
    navigate('/')
  })

  return null
}

export default NotFoundView
