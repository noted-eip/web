import React from 'react'
import { useNavigate } from 'react-router-dom'

import { FormatMessage } from '../../../i18n/TextComponent'

const ContactLanding: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div id='contact'>
      <div className='mx-auto max-w-7xl px-6 md:px-12 xl:px-6'>
        <section className='mb-32 text-gray-800'>
          <div className='flex justify-center'>
            <div className='text-center md:max-w-xl lg:max-w-3xl'>
              <h2 className='mb-12 px-6 text-3xl font-bold'>
                <FormatMessage id='CONTACT' />
              </h2>
            </div>
          </div>
          <div className='flex flex-wrap'>
            <div className='w-full shrink-0 grow-0 basis-auto lg:w-7/12'>
              <div className='flex flex-wrap'>
                <div className='mb-12 w-full shrink-0 grow-0 basis-auto px-3 lg:w-6/12 lg:px-6'>
                  <div className='flex items-start'>
                    <div className='shrink-0'>
                      <div className='flex h-14 w-14 items-center justify-center rounded-md bg-black p-4 shadow-md'>
                        <svg aria-hidden='true' focusable='false' data-prefix='fas' data-icon='headset' className='w-5 text-white'
                          role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
                          <path fill='currentColor'
                            d='M192 208c0-17.67-14.33-32-32-32h-16c-35.35 0-64 28.65-64 64v48c0 35.35 28.65 64 64 64h16c17.67 0 32-14.33 32-32V208zm176 144c35.35 0 64-28.65 64-64v-48c0-35.35-28.65-64-64-64h-16c-17.67 0-32 14.33-32 32v112c0 17.67 14.33 32 32 32h16zM256 0C113.18 0 4.58 118.83 0 256v16c0 8.84 7.16 16 16 16h16c8.84 0 16-7.16 16-16v-16c0-114.69 93.31-208 208-208s208 93.31 208 208h-.12c.08 2.43.12 165.72.12 165.72 0 23.35-18.93 42.28-42.28 42.28H320c0-26.51-21.49-48-48-48h-32c-26.51 0-48 21.49-48 48s21.49 48 48 48h181.72c49.86 0 90.28-40.42 90.28-90.28V256C507.42 118.83 398.82 0 256 0z'>
                          </path>
                        </svg>
                      </div>
                    </div>
                    <div className='ml-6 grow'>
                      <p className='mb-1 font-bold'>
                        <FormatMessage id='CONTACT.title' />
                      </p>
                      <p className='text-gray-500'>maxime.dodin@epitech.eu</p>
                    </div>
                  </div>
                </div>
                <div className='mb-12 w-full shrink-0 grow-0 basis-auto px-3 lg:w-6/12 lg:px-6'>
                  <div className='flex items-start'>
                    <div className='shrink-0'>
                      <div
                        style={{
                          cursor: 'pointer',
                        }}
                        onClick={() => window.location.href = 'https://www.instagram.com/noted_org?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=='}
                        className='flex h-14 w-14 items-center justify-center rounded-md border border-black p-4 shadow-md'>
                        <svg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' width='100' height='100' viewBox='0 0 50 50'>
                          <path d='M 16 3 C 8.83 3 3 8.83 3 16 L 3 34 C 3 41.17 8.83 47 16 47 L 34 47 C 41.17 47 47 41.17 47 34 L 47 16 C 47 8.83 41.17 3 34 3 L 16 3 z M 37 11 C 38.1 11 39 11.9 39 13 C 39 14.1 38.1 15 37 15 C 35.9 15 35 14.1 35 13 C 35 11.9 35.9 11 37 11 z M 25 14 C 31.07 14 36 18.93 36 25 C 36 31.07 31.07 36 25 36 C 18.93 36 14 31.07 14 25 C 14 18.93 18.93 14 25 14 z M 25 16 C 20.04 16 16 20.04 16 25 C 16 29.96 20.04 34 25 34 C 29.96 34 34 29.96 34 25 C 34 20.04 29.96 16 25 16 z'></path>
                        </svg>
                      </div>
                    </div>
                    <div className='ml-6 grow'>
                      <p className='mb-1 font-bold'>
                        Instagram
                      </p>
                      <p className='text-gray-500'>noted_org</p>
                    </div>
                  </div>
                </div>
                <div className='mb-12 w-full shrink-0 grow-0 basis-auto px-3 lg:w-6/12 lg:px-6'>
                  <div className='flex items-start'>
                    <div className='shrink-0'>
                      <div
                        style={{
                          cursor: 'pointer',
                        }}
                        onClick={() => window.location.href = 'https://x.com/Noted_Org?s=20'}
                        className='flex h-14 w-14 items-center justify-center rounded-md border border-black p-4 shadow-md'>
                        <svg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' width='100' height='100' viewBox='0 0 50 50'>
                          <path d='M 5.9199219 6 L 20.582031 27.375 L 6.2304688 44 L 9.4101562 44 L 21.986328 29.421875 L 31.986328 44 L 44 44 L 28.681641 21.669922 L 42.199219 6 L 39.029297 6 L 27.275391 19.617188 L 17.933594 6 L 5.9199219 6 z M 9.7167969 8 L 16.880859 8 L 40.203125 42 L 33.039062 42 L 9.7167969 8 z'></path>
                        </svg>
                      </div>
                    </div>
                    <div className='ml-6 grow'>
                      <p className='mb-1 font-bold'>
                        X
                      </p>
                      <p className='text-gray-500'>@Noted_Org</p>
                    </div>
                  </div>                  
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ContactLanding