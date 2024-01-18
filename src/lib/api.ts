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

type module_type = 'connection' | 'creation' | 'validation' | 'export' | 'quiz' | 'invite'

export const beautifyError = (error: string | undefined, module: module_type, formatMessage: any) : string => {
  if (!error) {
    return formatMessage({ id: 'ERROR.unknown' })
  }

  switch (module) {
    case 'connection':
      if (error.includes('wrong password or email')) {
        return formatMessage({ id: 'ERROR.connection.input_invalid' })
      }
      if (error.includes('google')) {
        return formatMessage({ id: 'ERROR.connection.created_with_google' })
      }
      return formatMessage({ id: 'ERROR.connection.input_does_not_match' })
    case 'creation':
      if (error.includes('already exists')) {
        return formatMessage({ id: 'ERROR.creation.already_exist' })
      }
      return formatMessage({ id: 'ERROR.creation.input_invalid' })
    case 'validation':
      return formatMessage({ id: 'ERROR.validation.token_does_not_match' })
    case 'export':
      return formatMessage({ id: 'ERROR.export.something_wrong' })
    case 'quiz':
      return formatMessage({ id: 'ERROR.quiz.something_wrong' })
    case 'invite':
      if (error.includes('not found')) {
        return formatMessage({ id: 'ERROR.invite.already_exist' })
      }
      console.log('test ' + error)
      return formatMessage({ id: 'ERROR.invite.something_wrong' })
    default:
      return formatMessage({ id: 'ERROR.unknown' })
  }
}