import jwt_decode from 'jwt-decode'
import { QueryClient } from 'react-query'

const API_BASE = 'http://localhost:3000'

const apiQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

type TDecodedToken = {
  uid: string
  role: string
}

const decodeToken = (token: string): TDecodedToken => {
  const decodedToken = jwt_decode(token) as TDecodedToken
  if (decodedToken && decodedToken.uid && decodedToken.role) {
    return decodedToken
  }
  throw new Error('token cannot be decoded, missing fields')
}

export { apiQueryClient, decodeToken, API_BASE }
