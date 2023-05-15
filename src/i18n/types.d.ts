import { TranslationKeys } from './lang/keys'
import { AvailableLang } from './lang/keys'

export type LocaleTranslationKeys = keyof typeof TranslationKeys;

export type LocaleNames = keyof typeof AvailableLang;

export type LocaleMessages = Partial<LocaleTypedMessages>;

export type LocaleTypedMessages =
	| Record<LocaleTranslationKeys, string>
	| Record<LocaleTranslationKeys, MessageFormatElement[]>;
