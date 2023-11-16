import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {IntlProvider} from 'react-intl'

import { LangageContext } from '../contexts/langage'
import { TOGGLE_DEV_FEATURES } from '../lib/env'
import frTranslation from './lang/fr'
import {
  getBrowserLocales,
  isASupportedLocale,
  loadTranslation,
} from './localeUtils'
import {LocaleMessages} from './types'

interface ILocaleInformation {
  locale: string;
  messages: LocaleMessages;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LocaleManager: React.FC<any> = ({children}) => {
  const context = React.useContext(LangageContext)
  const browserLocales = useMemo(getBrowserLocales, [getBrowserLocales])
  const [localeInfo, setLocaleInfo] = useState<ILocaleInformation>({
    locale: 'fr',
    messages: frTranslation,
  })

  const changeLocale = useCallback(
    async (locale: string): Promise<boolean> => {
      try {
        const translation = await loadTranslation(locale)

        setLocaleInfo({
          locale,
          messages: translation,
        })
      } catch (error) {
        console.error(error)
        return false
      }
      return true
    },
    [setLocaleInfo],
  )

  useEffect((): void => {
    if (context?.langage === 'fr') {
      changeLocale('fr')
    } else if (context?.langage === 'en') {
      changeLocale('en')
    }}, [context?.langage])

  useEffect((): void => {
    for (let i = 0; i < browserLocales.length; i++) {
      if (isASupportedLocale(browserLocales[i])) {
        changeLocale(browserLocales[i]).then((res) => {
          if (!res)
            console.error(
              `Unable to change the language using the browser locales (${browserLocales.join(
                ', ',
              )}): Currently trying to change to "${browserLocales[i]}".`,
            )
        })
        return
      }
    }
  }, [browserLocales, changeLocale])

  return (
    <>
      <IntlProvider
        messages={localeInfo.messages}
        locale={localeInfo.locale}
        defaultLocale='en'
      >
        {TOGGLE_DEV_FEATURES && <div className='flex items-center justify-center'>
          <button
            className='my-2 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-600 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
            onClick={(): void => {
              changeLocale('en')
            }}
          >
          Switch to english
          </button>
          <button
            className='my-2 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-600 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
            onClick={(): void => {
              changeLocale('fr')
            }}
          >
          Switch to french
          </button>
        </div>}
        {children}
      </IntlProvider>
    </>
  )
}

export default LocaleManager
