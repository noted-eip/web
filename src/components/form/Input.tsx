import React, { InputHTMLAttributes } from 'react'

type InputProps = {
  label?: string
  isInvalid?: boolean
  isInvalidBlur?: boolean
  trailingText?: string
  leadingText?: string
  errorMessage?: string
  tooltip?: string
}

const Input: React.FC<InputHTMLAttributes<HTMLInputElement> & InputProps> = ({
  label,
  isInvalid,
  isInvalidBlur,
  trailingText,
  leadingText,
  errorMessage,
  tooltip,
  ...props
}) => {
  const [focus, setFocus] = React.useState(false)
  const [showError, setShowError] = React.useState(false)
  const baseStyles = 'px-3 py-2 outline-none w-full lg:text-base'
  const baseContainerStyles = 'flex group rounded-lg overflow-hidden'
  const shadowStyles =
    isInvalid || (isInvalidBlur && showError)
      ? 'shadow-red-outline'
      : 'shadow-dropdown focus-within:shadow-blue-outline dark:shadow-dark-dropdown dark:focus-within:shadow-dark-blue-outline'
  const borderStyles =
    isInvalid || (isInvalidBlur && showError)
      ? 'border border-red-500'
      : 'border border-gray-300 dark:border-gray-500 focus-within:border-blue-500 dark:focus-within:border-blue-500'
  const backgroundStyles = 'bg-white dark:bg-gray-700'
  const textStyles = 'dark:text-white'

  const container = (<div className='w-[300px]'>
    <div
      className={`${baseContainerStyles} ${shadowStyles} ${backgroundStyles} ${borderStyles} ${props.disabled ? 'opacity-50' : ''
      }`}
    >
      {leadingText ? (
        <div className='px-3 py-2 lg:text-base text-gray-500 bg-gray-50 dark:bg-gray-light dark:text-gray-300 border-r border-gray-300 dark:border-gray-500'>
          {leadingText}
        </div>
      ) : null}
      <input
        className={`${baseStyles} ${backgroundStyles} ${textStyles}`}
        {...props}
        onFocus={() => {
          setFocus(true)
          if (showError && !isInvalidBlur) {
            setShowError(false)
          }
        }}
        onBlur={() => {
          setFocus(false)
          setShowError(true)
        }}
      />

      {trailingText ? (
        <div className='px-3 py-2 lg:text-base text-gray-500 bg-gray-50 dark:bg-gray-light dark:text-gray-300 border-l border-gray-300 dark:border-gray-500'>
          {trailingText}
        </div>
      ) : null}
    </div>
    <div className='h-4'>
      {isInvalid || (isInvalidBlur && showError) ? (
        <span className='mx-2 my-1 text-xs text-red-500'>
          {errorMessage || tooltip}
        </span>
      ) : tooltip && focus ? (
        <span className='mx-2 my-1 text-xs text-gray-500'>{tooltip}</span>
      ) : null}
    </div>
  </div>)

  if (label) {
    return (
      <label className='flex flex-col text-sm'>
        <span className='mb-1 ml-1 text-gray-600 dark:text-gray-400'>
          {label}
        </span>
        {container}
      </label>
    )
  }
  return container
}

export default Input
