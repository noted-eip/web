import React, { InputHTMLAttributes, useState } from 'react'

type OldInputProps = {
  label?: string
  isInvalid?: boolean
  isInvalidBlur?: boolean
  trailingText?: string
  leadingText?: string
  errorMessage?: string
  tooltip?: string
}

const OldInput: React.FC<InputHTMLAttributes<HTMLInputElement> & OldInputProps> = ({
  label,
  isInvalid,
  isInvalidBlur,
  trailingText,
  leadingText,
  errorMessage,
  tooltip,
  ...props
}) => {
  const [focus, setFocus] = useState(false)
  const [showError, setShowError] = useState(false)
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

  const container = (
    <div className='w-full'>
      <div
        className={`${baseContainerStyles} ${shadowStyles} ${backgroundStyles} ${borderStyles} ${
          props.disabled ? 'opacity-50' : ''
        }`}
      >
        {leadingText ? (
          <div className='border-r border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 dark:border-gray-500 dark:bg-gray-200 dark:text-gray-300 lg:text-base'>
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
          <div className='border-l border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 dark:border-gray-500 dark:bg-gray-200 dark:text-gray-300 lg:text-base'>
            {trailingText}
          </div>
        ) : null}
      </div>
      {isInvalid || (isInvalidBlur && showError) ? (
        <div className='h-4'>
          <span className='mx-2 my-1 text-xs text-red-500'>
            {errorMessage || tooltip}
          </span>
        </div>
      ) : tooltip && focus ? (
        <div className='h-4'>
          <span className='mx-2 my-1 text-xs text-gray-500'>{tooltip}</span>
        </div>
      ) : null}
    </div>
  )

  if (label) {
    return (
      <label className='flex flex-col text-sm'>
        <span className='mb-2 block font-medium text-gray-900 dark:text-white'>{label}</span>
        {container}
      </label>
    )
  }
  return container
}

export default OldInput
