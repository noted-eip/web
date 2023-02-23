import React from 'react'
import { RenderElementProps } from 'slate-react'

const EditorTitleElement: React.FC<RenderElementProps> = (props) => {
  return <p className='text-lg font-medium text-gray-700' {...props.attributes} >
    {props.children}
  </p>
}

export default EditorTitleElement
