import jwt_decode from 'jwt-decode'
import { QueryClient } from 'react-query'

const apiQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

const decodeToken = (token: string): {uid: string, role: string} => {
  const decodedToken = jwt_decode(token) as {uid: string, role: string}
  if (decodedToken && decodedToken.uid && decodedToken.role) {
    return decodedToken
  }
  throw new Error('token cannot be decoded, missing fields')
}

export { apiQueryClient, decodeToken }
