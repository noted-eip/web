import { Box, Grid } from '@mui/material'
import Lottie from 'lottie-react'
import React, { ReactNode } from 'react'

import errorAnim from '../../assets/animations/error.json'
import loginAnim from '../../assets/animations/login.json'
import notedLogo from '../../assets/logo/noted_logo.png'
import ContainerMd from '../../components/container/ContainerMd'

interface AuthenticationProps {
  animName: string;
  children: ReactNode;
}

const Authentication: React.FC<AuthenticationProps> = ({ animName, children  }) => {
  return (
    <Grid container component='main' sx={{ height: '100vh' }}>
      {/* Image à droite */}
      <Grid item xs={false} sm={4} md={5} lg={6}>
        <Lottie
          animationData={animName === 'login' ? loginAnim : errorAnim}
          loop
          autoplay
          className='h-full w-full object-cover'
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
          <img src={notedLogo} alt='Logo' style={{ maxWidth: '140px', marginBottom: '4rem' }} />

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
