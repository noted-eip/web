import React from 'react'
import {
  RenderElementProps,
} from 'slate-react'

export const EditorElement: React.FC<RenderElementProps> = ({
  element,
  attributes,
  children
}) => {
  switch (element.type) {
    case 'TYPE_HEADING_1':
      return (
        <h1
          className='pb-2 pt-4 text-2xl font-medium text-gray-800 first:pt-0'
          {...attributes}
        >
          {children}
        </h1>
      )
    case 'TYPE_HEADING_2':
      return (
        <h2
          className='pb-2 pt-3 text-xl font-medium text-gray-800 first:pt-0'
          {...attributes}
        >
          {children}
        </h2>
      )
    case 'TYPE_HEADING_3':
      return (
        <h3
          className='py-2 text-lg font-medium normal-case text-gray-800 first:pt-0'
          {...attributes}
        >
          {children}
        </h3>
      )
    case 'TYPE_BULLET_LIST':
      return (
        <ul
          className='list-inside list-disc py-1 text-sm first:pt-0'
          {...attributes}
        >
          {children}
        </ul>
      )
    case 'TYPE_NUMBER_LIST':
      return (
        <ul
          className='list-inside list-decimal py-1 text-sm first:pt-0'
          {...attributes}
        >
          {children}
        </ul>
      )
    case 'TYPE_LIST_ITEM':
      return (
        <li className='px-2 py-1 text-sm first:pt-0' {...attributes}>
          {children}
        </li>
      )
    case 'TYPE_PARAGRAPH':
      return (
        <p className='py-1 text-sm text-slate-800 first:pt-0' {...attributes}>
          {children}
        </p>
      )
    default:
      return (
        <p className='py-1 text-sm text-slate-800 first:pt-0' {...attributes}>
          {children}
        </p>
      )
  }
}
