import { useLocation } from 'react-router-dom'

export const useNoteIdFromUrl = () => {
  const location = useLocation()
  return location.pathname.split('/')[4]
}
