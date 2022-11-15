import frTranslation from './lang/fr'
import {AvailableLang} from './lang/keys'
import {LocaleMessages} from './types'

function getBrowserLocales(): string[] {
  const completeLocales = navigator.languages || navigator.language || []
  const onlyLocales = completeLocales.map((elem) => elem.split(/[-_]/)[0])
  return Array.from(new Set(onlyLocales))
}

function isASupportedLocale(toCheck: string): boolean {
  const langages = Object.keys(AvailableLang)

  return langages.includes(toCheck)
}

function loadTranslation(locale: string): Promise<LocaleMessages> {
  return new Promise((resolve, reject) => {
    if (locale === 'fr') {
      resolve(frTranslation)
      return
    }
    try {
      import(`./lang/${locale}`)
        .then((module) => resolve(module.default))
        .catch(() =>
          reject(new Error(`Translation for locale "${locale}" not found.`)),
        )
    } catch {
      reject(new Error(`Translation for locale "${locale}" not found.`))
    }
  })
}

export {getBrowserLocales, loadTranslation, isASupportedLocale}
