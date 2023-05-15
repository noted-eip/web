import React from 'react'

const ContactLanding: React.FC = () => {
  return (
    <div id='contact'>
      <div className='mx-auto max-w-7xl px-6 md:px-12 xl:px-6'>
        <section className='mb-32 text-gray-800'>
          <div className='flex justify-center'>
            <div className='text-center md:max-w-xl lg:max-w-3xl'>
              <h2 className='mb-12 px-6 text-3xl font-bold'>Contact</h2>
            </div>
          </div>
          <div className='flex flex-wrap'>
            {/* <div className='mb-12 w-full shrink-0 grow-0 basis-auto px-3 lg:mb-0 lg:w-5/12 lg:px-6'>
              <form>
                <div className=' mb-6'>
                  <input type='text' className='m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-black focus:bg-white focus:text-gray-700 focus:outline-none'
                    placeholder='Name' />
                </div>
                <div className=' mb-6'>
                  <input type='email' className='m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-black focus:bg-white focus:text-gray-700 focus:outline-none'
                    placeholder='Email address' />
                </div>
                <div className=' mb-6'>
                  <textarea className='m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-black focus:bg-white focus:text-gray-700 focus:outline-none'
                    rows={3} placeholder='Message'></textarea>
                </div>
                <button type='submit' className='w-full rounded bg-black px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-black hover:shadow-lg focus:bg-black focus:shadow-lg focus:outline-none focus:ring-0 active:bg-black active:shadow-lg'>Send</button>
              </form>
            </div> */}
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
                      <p className='mb-1 font-bold'>Chef Noted</p>
                      <p className='text-gray-500'>maxime.dodin@epitech.eu</p>
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