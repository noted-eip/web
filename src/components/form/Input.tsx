import React, { InputHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = (props) => {
  const { className, ...remainingProps } = props
  return <input className={twMerge('text-sm p-3 h-9 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50', className)} {...remainingProps} />
}

export default Input
