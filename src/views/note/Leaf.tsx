import React from 'react'
import { RenderLeafProps } from 'slate-react'

export const Leaf: React.FC<RenderLeafProps> = ({
  attributes, 
  children, 
  leaf
}) => {

  if (leaf.bold !== undefined) { 
    if (leaf.bold.state) {
      children = <strong>{children}</strong>
    }
  }

  if (leaf.italic !== undefined) { 
    if (leaf.italic.state) {
      children = <em>{children}</em>
    }
  }

  if (leaf.underline !== undefined) {
    if (leaf.underline.state) {
      children = <u>{children}</u>
    }
  }

  if (leaf.color !== undefined) {
    if (leaf.color.state) {
      children = 
    <p style={{ color: `rgba(${leaf.color.color?.r ?? 0}, ${leaf.color.color?.g ?? 0}, ${leaf.color.color?.b ?? 0}, ${leaf.color.color?.a ?? 1})`}}>
      {children}
    </p>
    }
  }

  if (leaf.bgColor !== undefined) {
    if (leaf.bgColor.state) {
      children = 
    <p style={{ display: 'inline-block', background: `rgba(${leaf.bgColor.color?.r ?? 255}, ${leaf.bgColor.color?.g ?? 255}, ${leaf.bgColor.color?.b ?? 255}, ${leaf.bgColor.color?.a ?? 1})`, borderRadius: '5px', padding: '2px' }}>
      {children}
    </p>
    }
  }

  return <span {...attributes}>{children}</span>
}
