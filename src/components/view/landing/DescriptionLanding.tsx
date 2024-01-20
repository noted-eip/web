import React from 'react'

import noteLogo from '../../../assets/icon/note.svg'
import shareLogo from '../../../assets/icon/share.svg'
import notedHome from '../../../assets/noted_front_page.jpg'
import { FormatMessage, useOurIntl } from '../../../i18n/TextComponent'

type TDesc = {
  title: string
  desc: string
  imgSrc: string
  color: string
}

const DescriptionLanding: React.FC = () => {
  const { formatMessage } = useOurIntl()
  const descArr: TDesc[] = [
    {
      title: formatMessage({ id: 'DESCRIPTION.title1' }),  desc: formatMessage({ id: 'DESCRIPTION.title1.desc' }), imgSrc: noteLogo, color: 'indigo'
    },
    {
      title: formatMessage({ id: 'DESCRIPTION.title2' }),  desc: formatMessage({ id: 'DESCRIPTION.title2.desc' }), imgSrc: shareLogo, color: 'teal'
    }
  ]

  return (
    <div className='pt-20' id='description'>
      <div className='mx-auto max-w-7xl px-6 md:px-12 xl:px-6'>
        <div className='flex-row-reverse justify-between space-y-6 text-gray-600 md:flex md:gap-6 md:space-y-0 lg:items-center lg:gap-12'>
          <div className='border border-black md:basis-5/12 lg:w-1/2'>
            <img
              src={notedHome}
              alt='image'
              loading='lazy'
              width=''
              height=''
              className='w-full'
            />
          </div>
          <div className='md:basis-7/12 lg:w-1/2'>
            <h2 className='text-3xl font-bold text-gray-800 md:text-4xl'>
              <FormatMessage id='DESCRIPTION' />
            </h2>
            <p className='my-8 text-gray-600'>
              <FormatMessage id='DESCRIPTION.descP1' />
              <br /> <br />
              <FormatMessage id='DESCRIPTION.descP2' />
            </p>
            <div className='space-y-4 divide-y divide-gray-100'>
              {descArr.map((el) => {
                const colorStyleImage = `bg-${el.color}-100`
                return (
                  <div className='mt-8 flex gap-4 md:items-center' key={el.title}>
                    <div className={`flex h-12 w-12 gap-4 rounded-full ${colorStyleImage}`}>
                      <img src={el.imgSrc} alt='note logo' height='16.5px' width='20.5px' className='m-auto h-6 w-6 text-indigo-500' />
                    </div>
                    <div className='w-5/6'>
                      <h4 className='text-lg font-semibold text-gray-700'>
                        {el.title}
                      </h4>
                      <p className='text-gray-500'>
                        {el.desc}
                      </p>
                    </div> 
                  </div> 
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DescriptionLanding