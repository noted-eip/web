import { Menu } from '@headlessui/react'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import axios from 'axios'
import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { TAuthContext, useAuthContext } from '../../contexts/auth'
import { API_BASE } from '../../lib/env'


interface Props {
  noteId: string  | null;
  groupId: string | null;
}

interface ItemProps {
  active: boolean;
  label: string;
  format: string;
}

const NotesOptions = ( { noteId, groupId } : Props ) => {
  const [selectedOption, setSelectedOption] = React.useState('')
  const [hasExported, setHasExported] = React.useState(false)
  const url = `${API_BASE}/groups/${encodeURIComponent(groupId ?? '')}/note/${encodeURIComponent(noteId ?? '')}/export`
  const auth : TAuthContext = useAuthContext()

  const handleErrors = (ids: (string | null)[], selectedOption: string | null) => {
    if (ids.some(id => !id)) {
      throw new Error('ID is not defined')
    }
  
    if (!selectedOption) {
      throw new Error('No format selected')
    }
  }

  const handleExport = async () => {
    try {
      const ids = [noteId, groupId]
      handleErrors(ids, selectedOption)
      console.log('groupId : ', groupId)
      const response = await axios.get(url, {
        params: {
          format: selectedOption,
        },
        headers: {
          'Authorization': `Bearer ${await auth.token()}`
        },
        responseType: 'blob',
      })

      const extension = selectedOption === 'md' ? 'md' : 'pdf'
      const filename = `${uuidv4()}.${extension}`
      const mime = selectedOption === 'md' ? 'text/plain' : 'application/pdf'

      downloadFile(response.data, filename, mime)

      setHasExported(true)
      setSelectedOption('')
    } catch (error) {
      console.error(error)
    }
  }

  const downloadFile = (data: BlobPart, filename: string, mime: string) => {
    const blob = new Blob([data], { type: mime })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
  }


  const Item = ({ active, label, format }: ItemProps) => {
    return (
      <button
        className={`${
          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
        } flex w-full items-center rounded-md p-2 text-sm hover:bg-gray-100`}
        onClick={() => handleOptionSelect(format)}
      >
        <span className='mr-2'>{label}</span>
        {selectedOption.includes(format as never) && (
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
      </button>
    )
  }

  return (
    <div className='relative inline-block cursor-pointer text-left'>
      <Menu>
        {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
        {({ open }) => (
          <>
            <Menu.Button className='inline-flex w-full justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'>
              <MoreHorizIcon className='h-5 w-5' aria-hidden='true' />
            </Menu.Button>

            <Menu.Items
              className='absolute right-0 z-10 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
              static={hasExported}
            >
              <div className='p-1'>
                <Menu.Item>
                  {({ active }) => (
                    <Item active={active} label='Export in PDF' format='pdf' />
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Item
                      active={active}
                      label='Export in Markdown'
                      format='md'
                    />
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active && 'bg-indigo-500'
                      } flex w-full items-center rounded-md bg-indigo-600 p-2 text-sm text-white`}
                      onClick={handleExport}
                    >
                      <span className='mr-2'>
                        Export
                        {selectedOption.length > 0 &&
                          ' (' + selectedOption + ')'}
                      </span>
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </>
        )}
      </Menu>
    </div>
  )
}

export default NotesOptions