import { Container, Paper } from '@mui/material'
import React, { ReactNode } from 'react'

interface ContainerMdProps {
  children: ReactNode;
}

const ContainerMd: React.FC<ContainerMdProps> = ({ children }) => {
  return (
    <Container component='div' maxWidth='sm'>
      <Paper elevation={3} sx={{ p: 6, border: '1px solid #536470', borderRadius: '8px', backgroundColor: '#FFFFFF' }}>
        {children}
      </Paper>
    </Container>
  )
  // return (<div>
  //   <div className='mx-auto flex flex-col items-center justify-center px-6 py-8 lg:py-0'>
  //     <div className='w-full rounded-lg border border-slate-300 bg-white p-6 shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md sm:p-8 md:mt-0'>
  //       {children}
  //     </div>
  //   </div>
  // </div>)
}

export default ContainerMd
