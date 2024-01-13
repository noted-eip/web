import { Container, Paper } from '@mui/material'
import React, { ReactNode } from 'react'

interface ContainerMdProps {
  children: ReactNode;
}

const ContainerMd: React.FC<ContainerMdProps> = ({ children }) => {
  return (
    <Container component='div' maxWidth='sm'>
      <Paper elevation={3} square={false} sx={{ p: 6, border: '1px solid #536470' }}>
        {children}
      </Paper>
    </Container>
  )
}

export default ContainerMd
