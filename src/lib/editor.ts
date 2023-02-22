import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

export type CustomElement = { type: 'paragraph'; children: SlateText[] }

export type SlateText = { text: string }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: SlateText
  }
}
