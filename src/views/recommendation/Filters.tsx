import MoreVertIcon from '@mui/icons-material/MoreVert'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import React from 'react'

import { StyledMenu } from '../../components/Menu/StyledMenu'
import { useRecoModeContext } from '../../contexts/recommendation'
import {FormatMessage } from '../../i18n/TextComponent'

const RecommendationFilters = () => {
  const recoModeContext = useRecoModeContext()
  const [selectedOption, setSelectedOption] = React.useState(recoModeContext.recoMode == null ? 'note' : recoModeContext.recoMode)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    recoModeContext.changeRecoMode(selectedOption)
    setAnchorEl(null)
  }
  
  return (
    <div className='relative inline-block cursor-pointer text-right'>
      <div>
        <IconButton
          aria-label='more'
          id='long-button'
          aria-controls={open ? 'long-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup='true'
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <StyledMenu
          id='demo-customized-menu'
          MenuListProps={{
            'aria-labelledby': 'demo-customized-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          {/* TODO: make a justify between for the li */}
          <MenuItem
            onClick={() => {
              setSelectedOption('block')
              handleClose()}}
          >
            <FormatMessage id='PANEL.companion,buton1' />            
            {selectedOption === 'block' && (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M16.707 4.293a1 1 0 0 1 0 1.414L8.414 14l-3.707-3.707a1 1 0 0 1 1.414-1.414L8 11.586l7.293-7.293a1 1 0 0 1 1.414 0z'
                  clipRule='evenodd'
                />
              </svg>
            )}
          </MenuItem>
          <MenuItem onClick={() => {
            setSelectedOption('note')
            handleClose()}}>
            <FormatMessage id='PANEL.companion,buton2' />
            {selectedOption === 'note' && (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M16.707 4.293a1 1 0 0 1 0 1.414L8.414 14l-3.707-3.707a1 1 0 0 1 1.414-1.414L8 11.586l7.293-7.293a1 1 0 0 1 1.414 0z'
                  clipRule='evenodd'
                />
              </svg>
            )}
          </MenuItem>
        </StyledMenu>
      </div>
    </div>
  )
}

export default RecommendationFilters