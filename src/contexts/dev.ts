import React from 'react'
import { LS_DEVELOPMENT_DATA_KEY } from '../lib/constants'

export type TAccountsMap = {
  [id: string]:
  | undefined
  | {
    token: string
  }
}

export type TDevelopmentContext = {
  accounts: TAccountsMap
  setAccounts: React.Dispatch<React.SetStateAction<TAccountsMap>>
}

export const addAccountToDevelopmentContext = (
  id: string,
  token: string,
  setAccounts: React.Dispatch<React.SetStateAction<TAccountsMap>>
) => {
  return setAccounts((old: TAccountsMap) => {
    const ret = { ...old }
    ret[id] = { token }
    window.localStorage.setItem(LS_DEVELOPMENT_DATA_KEY, JSON.stringify(ret))
    return ret
  })
}

export const removeAccountFromDevelopmentContext = (
  id: string,
  setAccounts: React.Dispatch<React.SetStateAction<TAccountsMap>>
) => {
  return setAccounts((old: TAccountsMap) => {
    const ret = { ...old }
    ret[id] = undefined
    window.localStorage.setItem(LS_DEVELOPMENT_DATA_KEY, JSON.stringify(ret))
    return ret
  })
}

export const DevelopmentContext = React.createContext<TDevelopmentContext | undefined>(
  undefined
)

export const useDevelopmentContext = () => {
  return React.useContext(DevelopmentContext)
}
