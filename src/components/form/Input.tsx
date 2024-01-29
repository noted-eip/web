import { createTheme } from '@mui/material'
import { grey } from '@mui/material/colors'
import React, { InputHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export const formTheme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: '0.375rem',
          padding: '3px',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: grey[200],
            },
            '&:hover fieldset': {
              borderColor: grey[400],
            },
            '&.Mui-focused fieldset': {
              borderColor: grey[400],
            },
          },
        },
      },
    },
  },
})

const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = (props) => {
  const { className, ...remainingProps } = props
  return (
    <input
      className={twMerge(
        'block h-9 w-full rounded-md border-gray-300 p-3 text-sm shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50',
        className
      )}
      {...remainingProps}
    />
  )
}

export default Input
