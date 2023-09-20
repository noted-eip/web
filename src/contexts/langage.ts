import React from 'react'

type TLangageContext = {
  langage: string | null
  changeLangage: React.Dispatch<string | null>
}

export const LangageContext = React.createContext<TLangageContext | undefined>(undefined)