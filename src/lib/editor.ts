import { BaseEditor, Descendant, Editor, Element as SlateElement, Point, Range, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import { V1Block } from '../protorepo/openapi/typescript-axios'

export type NoteTitleElement = { type: 'TYPE_NOTE_TITLE'; children: SlateText[] }
export type ParagraphElement = { type: 'TYPE_PARAGRAPH'; children: SlateText[] }
export type HeadingOneElement = { type: 'TYPE_HEADING_1'; children: SlateText[] }
export type HeadingTwoElement = { type: 'TYPE_HEADING_2'; children: SlateText[] }
export type HeadingThreeElement = { type: 'TYPE_HEADING_3'; children: SlateText[] }
export type BulletListElement = { type: 'TYPE_BULLET_LIST'; children: ListItemElement[] }
export type NumberListElement = { type: 'TYPE_NUMBER_LIST'; children: ListItemElement[] }
export type ListItemElement = { type: 'TYPE_LIST_ITEM'; children: SlateText[] }

export type SlateText = { text: string }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: ParagraphElement | HeadingOneElement | HeadingTwoElement | HeadingThreeElement | BulletListElement | NumberListElement | ListItemElement
    Text: SlateText
  }
}

const SHORTCUTS = {
  '*': 'TYPE_LIST_ITEM',
  '-': 'TYPE_LIST_ITEM',
  '#': 'TYPE_HEADING_1',
  '##': 'TYPE_HEADING_2',
  '###': 'TYPE_HEADING_3',
}

export const withShortcuts = editor => {
  const { deleteBackward, insertText } = editor

  editor.insertText = text => {
    const { selection } = editor

    if (text.endsWith(' ') && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection
      const block = Editor.above(editor, {
        match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n),
      })
      const path = block ? block[1] : []
      const start = Editor.start(editor, path)
      const range = { anchor, focus: start }
      const beforeText = Editor.string(editor, range) + text.slice(0, -1)
      const type = SHORTCUTS[beforeText]

      if (type) {
        Transforms.select(editor, range)

        if (!Range.isCollapsed(range)) {
          Transforms.delete(editor)
        }

        const newProperties: Partial<SlateElement> = {
          type,
        }
        Transforms.setNodes<SlateElement>(editor, newProperties, {
          match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n),
        })

        if (beforeText === '*') {
          const list: NumberListElement = {type: 'TYPE_NUMBER_LIST', children: []}
          Transforms.wrapNodes(editor, list, {
            match: n =>
              !Editor.isEditor(n) &&
              SlateElement.isElement(n) &&
              n.type === 'TYPE_LIST_ITEM',
          })
        }

        if (beforeText === '-') {
          const list: BulletListElement = {type: 'TYPE_BULLET_LIST', children: []}
          Transforms.wrapNodes(editor, list, {
            match: n =>
              !Editor.isEditor(n) &&
              SlateElement.isElement(n) &&
              n.type === 'TYPE_LIST_ITEM',
          })
        }

        return
      }
    }

    insertText(text)
  }

  editor.deleteBackward = (...args) => {
    console.log('deleteText', args)
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      const match = Editor.above(editor, {
        match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n),
      })

      if (match) {
        const [block, path] = match
        const start = Editor.start(editor, path)

        if (!Editor.isEditor(block) && SlateElement.isElement(block) && block.type !== 'TYPE_PARAGRAPH' && Point.equals(selection.anchor, start)) {
          const newProperties: Partial<SlateElement> = {
            type: 'TYPE_PARAGRAPH',
          }
          Transforms.setNodes(editor, newProperties)

          if (block.type === 'TYPE_LIST_ITEM') {
            Transforms.unwrapNodes(editor, {
              match: n =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                n.type === 'TYPE_BULLET_LIST',
              split: true,
            })
            Transforms.unwrapNodes(editor, {
              match: n =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                n.type === 'TYPE_NUMBER_LIST',
              split: true,
            })
          }

          return
        }
      }

      deleteBackward(...args)
    }
  }

  return editor
}

export const noteBlocksToSlateElements = (blocks: V1Block[]): Descendant[] => {
  const slateElements: Descendant[] = []

  for (let i = 0; i < blocks.length; i++) {
    switch (blocks[i].type) {
      case 'TYPE_HEADING_1':
        slateElements.push({ type: 'TYPE_HEADING_1', children: [{ text: blocks[i].heading || '' }] })
        break
      case 'TYPE_HEADING_2':
        slateElements.push({ type: 'TYPE_HEADING_2', children: [{ text: blocks[i].heading || '' }] })
        break
      case 'TYPE_HEADING_3':
        slateElements.push({ type: 'TYPE_HEADING_3', children: [{ text: blocks[i].heading || '' }] })
        break
      case 'TYPE_PARAGRAPH':
        slateElements.push({ type: 'TYPE_PARAGRAPH', children: [{ text: blocks[i].paragraph || '' }] })
        break
      case 'TYPE_BULLET_POINT': {
        const bulletPoints: ListItemElement[] = []
        for (; i < blocks.length && blocks[i].type === 'TYPE_BULLET_POINT'; i++) {
          bulletPoints.push({ type: 'TYPE_LIST_ITEM', children: [{ text: blocks[i].bulletPoint || '' }] })
        }
        slateElements.push({ type: 'TYPE_BULLET_LIST', children: bulletPoints})
        break
      }
      case 'TYPE_NUMBER_POINT': {
        const numberPoints: ListItemElement[] = []
        for (; i < blocks.length && blocks[i].type === 'TYPE_NUMBER_POINT'; i++) {
          numberPoints.push({ type: 'TYPE_LIST_ITEM', children: [{ text: blocks[i].numberPoint || '' }] })
        }
        slateElements.push({ type: 'TYPE_NUMBER_LIST', children: numberPoints})
        break
      }
      case 'TYPE_CODE':
        console.warn('Block with type TYPE_CODE is not supported in the editor, it will be overwritten.')
        break
      case 'TYPE_IMAGE':
        console.warn('Block with type TYPE_IMAGE is not supported in the editor, it will be overwritten.')
        break
      case 'TYPE_MATH':
        console.warn('Block with type TYPE_MATH is not supported in the editor, it will be overwritten.')
        break
      default:
        console.warn(`Block with type ${blocks[i].type} is not known, it will be overwritten.`)
    }
  }

  console.log('input', blocks, 'output', slateElements)

  return slateElements
}
