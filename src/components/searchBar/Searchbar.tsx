import { ThemeProvider } from '@emotion/react'
import { Autocomplete, createTheme, TextField } from '@mui/material'
import { grey } from '@mui/material/colors'
import React from 'react'


const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: '0.375rem',
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

const Searchbar: React.FC<{
  options: string[];
  placeholder: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleInput: (e: any) => void;
  style?: React.CSSProperties;
}> = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <Autocomplete
        freeSolo
        disableClearable
        options={props.options}
        open={false}
        style={props.style}
        renderInput={(params) => <TextField {...params}
          fullWidth
          variant='outlined'
          size='small'
          placeholder={props.placeholder}
          onSelect={props.handleInput}
        />}
      />
    </ThemeProvider>
  )
}
  
  
export default Searchbar
  