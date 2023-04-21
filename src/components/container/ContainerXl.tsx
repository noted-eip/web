import React, { HTMLAttributes } from 'react'

const ContainerXl: React.FC<HTMLAttributes<HTMLInputElement>> = () => {
  return (<div className='mx-auto max-w-7xl px-6 md:px-12 xl:px-6'>
    <slot />
  </div>)
}

export default ContainerXl