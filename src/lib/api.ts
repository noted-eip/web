import jwt_decode from 'jwt-decode'
import { QueryClient } from 'react-query'
import { DefaultApiFactory } from '../protorepo/openapi/typescript-axios'
import { API_BASE } from './env'

const openapiClient = DefaultApiFactory(undefined, API_BASE, undefined)

const apiQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

const decodeToken = (token: string): { uid: string; role: string | undefined } => {
  const decodedToken = jwt_decode(token) as { uid: string; role: string | undefined }
  if (decodedToken && decodedToken.uid) {
    return decodedToken
  }
  throw new Error('token cannot be decoded, missing fields')
}

export { apiQueryClient, openapiClient, decodeToken }
