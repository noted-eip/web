import jwt_decode from 'jwt-decode'
import { QueryClient } from 'react-query'

import { DefaultApiFactory } from '../protorepo/openapi/typescript-axios'
import { API_BASE } from './env'

const openapiClient = DefaultApiFactory(undefined, API_BASE, undefined)

const apiQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 3 * 60 * 1000,
    },
  },
})

const decodeToken = (token: string): { aid: string } => {
  const decodedToken = jwt_decode(token) as { aid: string }
  if (decodedToken && decodedToken.aid) {
    return decodedToken
  }
  throw new Error('token cannot be decoded, missing fields')
}

export { apiQueryClient, decodeToken,openapiClient }
