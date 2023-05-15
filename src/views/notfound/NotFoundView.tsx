import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFoundView: React.FC = () => {
  const navigate = useNavigate()

  React.useEffect(() => {
    navigate('/')
  })

  return null
}

export default NotFoundView
