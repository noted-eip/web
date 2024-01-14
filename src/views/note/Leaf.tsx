import React from 'react'
import { RenderLeafProps } from 'slate-react'

export const Leaf: React.FC<RenderLeafProps> = ({
  attributes, 
  children, 
  leaf
}) => {

  if (leaf.bold) {
    children = <strong>{children}</strong>
  }
      
  if (leaf.code) {
    children = <code>{children}</code>
  }
      
  if (leaf.italic) {
    children = <em>{children}</em>
  }
      
  if (leaf.underline) {
    children = <u>{children}</u>
  }

  /*if (leaf.color != undefined) {
    children = 
    <p style={{ display: 'inline-block', background: `rgba(${leaf.color.r}, ${leaf.color.g}, ${leaf.color.b}, ${leaf.color.a})`, borderRadius: '5px', padding: '2px' }}>
      {children}
    </p>
  }*/
      
  return <span {...attributes}>{children}</span>
}
