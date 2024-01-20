import React from 'react'

import balthazarPhoto from '../../../assets/team_photos/balthi.jpg'
import edouardPhoto from '../../../assets/team_photos/edouard.jpeg'
import gabrielPhoto from '../../../assets/team_photos/gabriel.jpg'
import kilianPhoto from '../../../assets/team_photos/killian.jpg'
import maximePhoto from '../../../assets/team_photos/maxime.jpg'
import { FormatMessage, useOurIntl } from '../../../i18n/TextComponent'

type TTeam = {
  name: string
  role: string
  desc: string
  imgSrc: string
}

const TeamLanding: React.FC = () => {
  const { formatMessage } = useOurIntl()
  const teamArr: TTeam[] = [
    {
      name: 'Edouard Sengeissen',  role: formatMessage({ id: 'TEAM.roleRespBack' }), desc: formatMessage({ id: 'TEAM.descBackDevops' }), imgSrc: edouardPhoto
    },
    {
      name: 'Gabriel Medoukali',  role: formatMessage({ id: 'TEAM.roleRespDeadDocs' }), desc: formatMessage({ id: 'TEAM.descBackDevops' }), imgSrc: gabrielPhoto
    },
    {
      name: 'Balthazar Roque',  role: formatMessage({ id: 'TEAM.rolePersona' }), desc: formatMessage({ id: 'TEAM.descMobile' }), imgSrc: balthazarPhoto
    },
    {
      name: 'Maxime Dodin',  role: formatMessage({ id: 'TEAM.roleRespPres' }), desc: formatMessage({ id: 'TEAM.descBackDevops' }), imgSrc: maximePhoto
    },
    {
      name: 'Killian Fleury',  role: formatMessage({ id: 'TEAM.roleRespFront' }), desc: formatMessage({ id: 'TEAM.descFront' }), imgSrc: kilianPhoto
    }
  ]
  

  return (
    <div className='text-gray-600' id='team'>
      <div className='mx-auto max-w-7xl px-6 md:px-12 xl:px-6'>
        <div className='mb-20 space-y-4 px-6 md:px-0'>
          <h2 className='text-center text-2xl font-bold text-gray-800 md:text-4xl'>
            <FormatMessage id='TEAM' />
          </h2>
        </div>
        <div className='grid gap-x-8 gap-y-4 lg:grid-cols-3'>
          {
            teamArr.map((el) => {
              return (
                <div className='aspect-auto rounded-3xl border border-gray-400 bg-white p-8 shadow-2xl shadow-gray-600/10' key={el.name}>
                  <div className='flex gap-4'>
                    <img className='h-12 w-12 rounded-full' src={el.imgSrc} alt={el.name} width='200' height='200' loading='lazy' />
                    <div>
                      <h6 className='text-lg font-medium text-gray-700'>{el.name}</h6>
                      <p className='text-sm text-gray-500'>{el.role}</p>
                    </div>
                  </div>
                  <p className='mt-8'>{el.desc}</p>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default TeamLanding