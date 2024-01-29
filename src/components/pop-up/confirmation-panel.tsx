import { TextField, ThemeProvider } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import React from 'react'

import { FormatMessage, useOurIntl } from '../../i18n/TextComponent'
import { LocaleTranslationKeys } from '../../i18n/types'
import { formTheme } from '../form/Input'

const ConfirmationPanel: React.FC<{onValidate: () => void, title: string, content?: string}> = ({onValidate, title, content }) => {
  const [open, setOpen] =  React.useState(true)
  const [enable, setEnable] =  React.useState(false)
  const { formatMessage } = useOurIntl()

  const handleType = (e: string) => {
    if (e == formatMessage({ id: 'CONFIRMATION.form.desc1' }) ) {
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
          <div className='border-b-2 p-4 text-lg font-semibold'>
            <FormatMessage id={title as LocaleTranslationKeys} />
          </div>
          {content && <div className='border-b-2 bg-orange-200 p-4 font-medium'>
            <FormatMessage id={content as LocaleTranslationKeys}/>
          </div>}
          <div className='flex border-white p-4 pb-2 font-medium'>
            <FormatMessage id='CONFIRMATION.form.desc0'/>
            <div className='px-1 font-bold'>
              <FormatMessage id='CONFIRMATION.form.desc1'/>
            </div>
            <FormatMessage id='CONFIRMATION.form.desc3'/>
          </div>
          <div className='mx-4 mb-2'>
            <ThemeProvider theme={formTheme}>
              <TextField
                fullWidth
                id='validationText'
                variant='outlined'
                size='small'
                placeholder={formatMessage({ id: 'PANEL.comments.comment' })}
                onChange={(e) => {
                  handleType(e.target.value)
                }}
              />
            </ThemeProvider>             
          </div>
          <div className='flex place-content-center border-t-2 p-2'>
            {enable ?
              <button onClick={onValidate} className='rounded border border-red-500 bg-red-100 py-2 px-4 font-semibold text-red-700 hover:border-transparent hover:bg-red-300 hover:text-white'>
                <FormatMessage id='CONFIRMATION.button' />
                <FormatMessage id={title as LocaleTranslationKeys} />
              </button>
              : <button disabled className='rounded border border-red-100 bg-transparent py-2 px-4 font-semibold text-red-300'>
                <FormatMessage id='CONFIRMATION.button' />
                <FormatMessage id={title as LocaleTranslationKeys} />
              </button>
            }

          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default ConfirmationPanel