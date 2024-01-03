import { BaseEditor, Descendant, Editor, Element as SlateElement, Point, Range, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

import { BlockContext } from '../contexts/note'
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
          const list: NumberListElement = { type: 'TYPE_NUMBER_LIST', children: [] }
          Transforms.wrapNodes(editor, list, {
            match: n =>
              !Editor.isEditor(n) &&
              SlateElement.isElement(n) &&
              n.type === 'TYPE_LIST_ITEM',
          })
        }

        if (beforeText === '-') {
          const list: BulletListElement = { type: 'TYPE_BULLET_LIST', children: [] }
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

export const noteBlocksToContextBlocks = (blocks: V1Block[]): BlockContext[] => {
  const blocksContext: BlockContext[] = []

  for (let i = 0; i < blocks.length; i++) {
    switch (blocks[i].type) {
      case 'TYPE_HEADING_1':
        blocksContext.push({
          id: blocks[i].id,
          type: 'TYPE_HEADING_1',
          content: blocks[i]?.heading || '',
          index: i,
          isFocused: false
        })
        break
      case 'TYPE_HEADING_2':
        blocksContext.push({
          id: blocks[i].id,
          type: 'TYPE_HEADING_2',
          content: blocks[i]?.heading || '',
          index: i,
          isFocused: false
        })
        break
      case 'TYPE_HEADING_3':
        blocksContext.push({
          id: blocks[i].id,
          type: 'TYPE_HEADING_3',
          content: blocks[i]?.heading || '',
          index: i,
          isFocused: false
        })
        break
      case 'TYPE_PARAGRAPH':
        blocksContext.push({
          id: blocks[i].id,
          type: 'TYPE_PARAGRAPH',
          content: blocks[i]?.paragraph || '',
          index: i,
          isFocused: false
        })
        break
      default:
        console.warn(`Block with type ${blocks[i].type} is not known, it will be overwritten.`)
    }
  }

  return blocksContext

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
        for (; i < blocks.length && blocks[i].type === 'TYPE_BULLET_POINT';) {
          bulletPoints.push({ type: 'TYPE_LIST_ITEM', children: [{ text: blocks[i].bulletPoint || '' }] })
          if (i + 1 < blocks.length && blocks[i + 1].type === 'TYPE_BULLET_POINT') i++
          else break
        }
        slateElements.push({ type: 'TYPE_BULLET_LIST', children: bulletPoints })
        break
      }
      case 'TYPE_NUMBER_POINT': {
        const numberPoints: ListItemElement[] = []
        for (; i < blocks.length && blocks[i].type === 'TYPE_NUMBER_POINT';) {
          numberPoints.push({ type: 'TYPE_LIST_ITEM', children: [{ text: blocks[i].numberPoint || '' }] })
          if (i + 1 < blocks.length && blocks[i + 1].type === 'TYPE_NUMBER_POINT') i++
          else break
        }
        slateElements.push({ type: 'TYPE_NUMBER_LIST', children: numberPoints })
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

  return slateElements
}

export const slateElementsToNoteBlock = (elements: Descendant[]): V1Block => {
  const block: V1Block = {id: '', type: 'TYPE_PARAGRAPH'}

  for (let i = 0; i < elements.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const element = elements[i] as any

    if (element.type) {
      switch (element.type) {
        case 'TYPE_HEADING_1':
          block.type = 'TYPE_HEADING_1'
          block.heading = block.heading == undefined ? '' + element.children[0].text : block.heading + '\n' + element.children[0].text
          continue
        case 'TYPE_HEADING_2':
          block.type = 'TYPE_HEADING_2'
          block.heading = block.heading == undefined ? '' + element.children[0].text : block.heading + '\n' + element.children[0].text
          continue
        case 'TYPE_HEADING_3':
          block.type = 'TYPE_HEADING_3'
          block.heading = block.heading == undefined ? '' + element.children[0].text : block.heading + '\n' + element.children[0].text
          continue
        case 'TYPE_PARAGRAPH':
          block.type = 'TYPE_PARAGRAPH'
          block.paragraph = block.paragraph == undefined ? '' + element.children[0].text : block.paragraph + '\n' + element.children[0].text
          continue
        case 'TYPE_BULLET_LIST':
          block.type = 'TYPE_BULLET_POINT'
          block.bulletPoint = block.bulletPoint == undefined ? '' + element.children[0].text : block.bulletPoint + '\n' + element.children[0].text
          continue
        case 'TYPE_NUMBER_POINT':
          block.type = 'TYPE_NUMBER_POINT'
          block.numberPoint = block.numberPoint == undefined ? '' + element.children[0].text : block.numberPoint + '\n' + element.children[0].text
          continue
      }
    }
  }

  return block
}

export const noteBlockstoStringArray = (blocks: V1Block[] | undefined): string[] => {
  const arr: string[] = []

  if (blocks == undefined)
    return arr

  blocks.forEach((block) => {
    switch (block.type) {
      case 'TYPE_HEADING_1':
        arr.push(block == undefined ? 'undefined' : block.heading == undefined ? 'undefined' : block.heading)
        break
      case 'TYPE_HEADING_2':
        arr.push(block == undefined ? 'undefined' : block.heading == undefined ? 'undefined' : block.heading)
        break
      case 'TYPE_HEADING_3':
        arr.push(block == undefined ? 'undefined' : block.heading == undefined ? 'undefined' : block.heading)
        break
      case 'TYPE_PARAGRAPH':
        arr.push(block == undefined ? 'undefined' : block.paragraph == undefined ? 'undefined' : block.paragraph)
        break
      case 'TYPE_BULLET_POINT':
        arr.push(block == undefined ? 'undefined' : block.bulletPoint == undefined ? 'undefined' : block.bulletPoint)
        break
      case 'TYPE_NUMBER_POINT':
        arr.push(block == undefined ? 'undefined' : block.numberPoint == undefined ? 'undefined' : block.numberPoint)
        break
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
        console.warn(`Block with type ${block.type} is not known, it will be overwritten.`)
    }
  })

  return arr
} 

export const stringToNoteBlock = (content: string): V1Block => {
  const block: V1Block = {id: '', type: 'TYPE_PARAGRAPH'}

  block.paragraph = content

  return block
}

export const slateElementsToNoteBlocks = (elements: Descendant[]): V1Block[] => {
  const blocks: V1Block[] = []

  for (let i = 0; i < elements.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const element = elements[i] as any

    if (element.type) {
      switch (element.type) {
        case 'TYPE_HEADING_1':
          blocks.push({ type: 'TYPE_HEADING_1', heading: element.children[0].text } as V1Block)
          break
        case 'TYPE_HEADING_2':
          blocks.push({ type: 'TYPE_HEADING_2', heading: element.children[0].text } as V1Block)
          break
        case 'TYPE_HEADING_3':
          blocks.push({ type: 'TYPE_HEADING_3', heading: element.children[0].text } as V1Block)
          break
        case 'TYPE_PARAGRAPH':
          blocks.push({ type: 'TYPE_PARAGRAPH', paragraph: element.children[0].text } as V1Block)
          break
        case 'TYPE_BULLET_LIST':
          for (const child of element.children) {
            blocks.push({ type: 'TYPE_BULLET_POINT', bulletPoint: child.children[0].text } as V1Block)
          }
          break
        case 'TYPE_NUMBER_LIST':
          for (const child of element.children) {
            blocks.push({ type: 'TYPE_NUMBER_POINT', numberPoint: child.children[0].text } as V1Block)
          }
          break
      }
    }
  }

  return blocks
}

export const blocksAreEqual = (a: V1Block, b: V1Block): boolean => {
  switch (a.type) {
    case 'TYPE_HEADING_1':
      if (a.heading !== b.heading) {
        return false
      }
      break
    case 'TYPE_HEADING_2':
      if (a.heading !== b.heading) {
        return false
      }
      break
    case 'TYPE_HEADING_3':
      if (a.heading !== b.heading) {
        return false
      }
      break
    case 'TYPE_PARAGRAPH':
      if (a.paragraph !== b.paragraph) {
        return false
      }
      break
    case 'TYPE_BULLET_POINT':
      if (a.bulletPoint !== b.bulletPoint) {
        return false
      }
      break
    case 'TYPE_NUMBER_POINT':
      if (a.numberPoint !== b.numberPoint) {
        return false
      }
      break
    case 'TYPE_CODE':
      if (a.code?.lang !== b.code?.lang || a.code?.snippet !== b.code?.snippet) {
        return false
      }
      break
    case 'TYPE_IMAGE':
      if (a.image?.url !== b.image?.url || a.image?.caption !== b.image?.caption) {
        return false
      }
      break
    case 'TYPE_MATH':
      if (a.math !== b.math) {
        return false
      }
      break
    default:
  }
  return true
}


export const blockArraysAreEqual = (a: V1Block[], b: V1Block[]): boolean => {
  if (a.length !== b.length) {
    return false
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i].type !== b[i].type) {
      return false
    }

    switch (a[i].type) {
      case 'TYPE_HEADING_1':
      case 'TYPE_HEADING_2':
      case 'TYPE_HEADING_3':
      case 'TYPE_PARAGRAPH':
        if (a[i].paragraph !== b[i].paragraph) {
          return false
        }
        break
      case 'TYPE_BULLET_POINT':
        if (a[i].bulletPoint !== b[i].bulletPoint) {
          return false
        }
        break
      case 'TYPE_NUMBER_POINT':
        if (a[i].numberPoint !== b[i].numberPoint) {
          return false
        }
        break
      case 'TYPE_CODE':
        if (a[i].code?.lang !== b[i].code?.lang || a[i].code?.snippet !== b[i].code?.snippet) {
          return false
        }
        break
      case 'TYPE_IMAGE':
        if (a[i].image?.url !== b[i].image?.url || a[i].image?.caption !== b[i].image?.caption) {
          return false
        }
        break
      case 'TYPE_MATH':
        if (a[i].math !== b[i].math) {
          return false
        }
        break
      default:
    }
  }

  return true
}
