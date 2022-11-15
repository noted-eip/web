import React from 'react'
import {
  FormattedMessage as IntlFormattedMessage,
  useIntl as useReactIntl,
  IntlFormatters,
} from 'react-intl'
import {LocaleTranslationKeys} from './types'
import {IntlShape} from 'react-intl/src/types'

export interface FormattedMessageProps
  extends Omit<React.ComponentPropsWithoutRef<typeof IntlFormattedMessage>,
    'id'> {
  id: LocaleTranslationKeys;
}

export const FormatMessage: React.FC<FormattedMessageProps> = (props) => {
  return <IntlFormattedMessage {...props} />
}

type FormatMessageArgs = Parameters<IntlFormatters['formatMessage']>;

export const useOurIntl = (): Omit<IntlShape, 'formatMessage'> & {
  formatMessage: (
    descriptor: Omit<FormatMessageArgs[0], 'id'> & {
      id: LocaleTranslationKeys;
    },
    values?: FormatMessageArgs[1],
    options?: FormatMessageArgs[2],
  ) => string;
} => {
  const {formatMessage, ...rest} = useReactIntl()

  return {
    ...rest,
    formatMessage,
  }
}
