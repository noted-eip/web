import { TextField } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import * as React from 'react'

import { FormatMessage } from '../../i18n/TextComponent'

const ConfirmationPanel: React.FC<{onValidate: any, title: any, content?: any}> = (props) => {
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
    console.log('je ferme la modal')
    setOpen(false)
  }


  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <div className='py-4'>
          <div className='border-b-2 p-4 text-lg font-semibold'>
            <FormatMessage id={title} />
          </div>
          {content && <div className='border-b-2 bg-orange-200 p-4 font-medium'>
            <FormatMessage id={content}/>
          </div>}
          <div className='flex border-white p-4 pb-2 font-medium'>
            <FormatMessage id={'CONFIRMATION.form.desc0'}/>
            <div className='px-1 font-bold'> <FormatMessage id={'CONFIRMATION.form.desc1'}/> </div>
            <FormatMessage id={'CONFIRMATION.form.desc3'}/>
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
          {/* : null} */}
          <div className='flex place-content-center p-2'>
            {enable ? 
              <button onClick={onValidate} className='rounded border border-red-500 bg-red-100 py-2 px-4 font-semibold text-red-700 hover:border-transparent hover:bg-red-300 hover:text-white'>
                <FormatMessage id={'CONFIRMATION.button'} /> <FormatMessage id={title} />
              </button>
              : <button disabled className='rounded border border-red-100 bg-transparent py-2 px-4 font-semibold text-red-300'>
                <FormatMessage id={'CONFIRMATION.button'} /> <FormatMessage id={title} />
              </button>    
            }

          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default ConfirmationPanel