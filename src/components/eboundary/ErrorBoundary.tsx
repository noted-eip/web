import React from 'react'

class ErrorBoundary extends React.Component<
React.PropsWithChildren,
{ hasError: boolean }
> {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='flex h-full w-full items-center justify-center bg-red-300 font-medium'>
          Something terrible happened in that component
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
