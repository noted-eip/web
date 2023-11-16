import { Box, Grid } from '@mui/material'
import React, { ReactNode } from 'react'

import notedLogo from '../../assets/logo/noted_logo.png'
import ContainerMd from '../../components/container/ContainerMd'

interface AuthenticationProps {
  children: ReactNode;
}
  
const Authentication: React.FC<AuthenticationProps> = ({ children }) => {
  return (
    <Grid container component='main' sx={{ height: '100vh' }}>
      {/* Image à droite */}
      <Grid item xs={false} sm={4} md={5} lg={6}>
        <Box
          sx={{
            backgroundImage: `url(${notedLogo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100%',
          }}
        />
      </Grid>
      {/* Logo et formulaire */}
      <Grid item xs={12} sm={8} md={7} lg={6}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          {/* Logo */}
          <img src={notedLogo} alt='Logo' style={{ maxWidth: '100px', marginBottom: '1rem' }} />

          {/* Formulaire */}
          <ContainerMd>
            {children}
          </ContainerMd>
        </Box>
      </Grid>
    </Grid>
  )
}

export default Authentication
