import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import * as React from 'react'

import { FormatMessage } from '../../i18n/TextComponent'

const ConfirmationPanel: React.FC<{onValidate: any, title: any, content: any}> = (props) => {
  const {
    onValidate,
    title,
    content,
  } = props
  const [open, setOpen] = React.useState(true)
  const [enable, setEnable] = React.useState(false)

  const handleType = (e: string) => {
    if (e === 'je comprends') {
      setEnable(true)
    } else {
      setEnable(false)
    }
  }
  const handleClose = () => {
    setOpen(false)
  }


  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <div className='py-4'>
          <div className='p-4 font-semibold'>
            <FormatMessage id={title} />
          </div>
          <div className='border-white-500 border-y-2 bg-orange-200 p-4 font-medium'>
            <FormatMessage id={content}/>
          </div>
          <div className='border-white-500 flex p-4 pb-2 font-medium'>
            Please type <div className='px-1 font-bold'> je comprends </div> to confirm.
          </div>
          <div className='border-b-2 px-2'>
            <TextField
              margin='normal'
              id='validationText'
              fullWidth
              size='small'
              variant='outlined'
              onChange={(e) => {
                handleType(e.target.value)
              }}
        
            />
          </div>
          <div className='flex place-content-center p-2'>
            {enable ? 
              <button onClick={onValidate} className='bg-red rounded border border-red-500 py-2 px-4 font-semibold text-red-700 hover:border-transparent hover:bg-red-400 hover:text-white'>
                Je comprend les conséquences, <FormatMessage id={title} />
              </button>
              : <button disabled className='rounded border border-red-100 bg-transparent py-2 px-4 font-semibold text-red-300'>
                Je comprend les conséquences, <FormatMessage id={title} />
              </button>    
            }

          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default ConfirmationPanel