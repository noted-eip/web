import { useLocation } from 'react-router-dom'

const useNoteIdFromUrl = () => {
  const location = useLocation()
  return location.pathname.split('/')[4]
}
const useGroupIdFromUrl = () => {
  const location = useLocation()
  return location.pathname.split('/')[2]
}

export {useGroupIdFromUrl, useNoteIdFromUrl}