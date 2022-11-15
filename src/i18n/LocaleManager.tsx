import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {IntlProvider} from 'react-intl'
import {LocaleMessages} from './types'
import {
  getBrowserLocales,
  isASupportedLocale,
  loadTranslation,
} from './localeUtils'
import frTranslation from './lang/fr'

interface ILocaleInformation {
  locale: string;
  messages: LocaleMessages;
}

const LocaleManager: React.FC<React.ReactNode> = (/*{children}*/) => {
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
        defaultLocale="en"
      >
        {/*{children}*/}
        <button
          onClick={(): void => {
            changeLocale('en')
          }}
        >
          Switch to english
        </button>
        <button
          onClick={(): void => {
            changeLocale('fr')
          }}
        >
          Switch to french
        </button>
        {/* // DEBUG TODO: remove the buttons for testing different locales
				<Container fluid>
					<Row className="justify-content-center">
						<Col xs="auto">
							<br />
							<br />
							<Button
								onClick={(): void => {
									changeLocale('en');
								}}
							>
								Switch to english
							</Button>
							<Button
								onClick={(): void => {
									changeLocale('fr');
								}}
							>
								Switch to french
							</Button>
							<br />
						</Col>
					</Row>
				</Container> */}
      </IntlProvider>
    </>
  )
}

export default LocaleManager
