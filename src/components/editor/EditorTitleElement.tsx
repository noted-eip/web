import React from 'react'
import { RenderElementProps } from 'slate-react'

const EditorTitleElement: React.FC<RenderElementProps> = (props) => {
  return <p className='min-w-[48px] text-lg font-medium text-gray-700' {...props.attributes}>
    {props.children}
  </p>
}

export default EditorTitleElement
