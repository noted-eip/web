import React from 'react'

import bachirPhoto from '../../../assets/team_photos/bachir.jpg'
import balthazarPhoto from '../../../assets/team_photos/balthazar.png'
import diegoPhoto from '../../../assets/team_photos/diego.jpg'
import edouardPhoto from '../../../assets/team_photos/edouard.jpeg'
import gabrielPhoto from '../../../assets/team_photos/Gabi.jpg'
import kilianPhoto from '../../../assets/team_photos/Kilian.jpg'
import maximePhoto from '../../../assets/team_photos/maxime.jpg'

type TTeam = {
  name: string
  role: string
  desc: string
  imgSrc: string
}

const TeamLanding: React.FC = () => {
  const teamArr: TTeam[] = [
    {
      name: 'Edouard Sengeissen',  role: 'Respo Deadlines and docs', desc: 'Backend and devops developer', imgSrc: edouardPhoto
    },
    {
      name: 'Gabriel Medoukali',  role: 'Respo Deadlines and docs', desc: 'Backend and devops developer', imgSrc: gabrielPhoto
    },
    {
      name: 'Balthazar Roque',  role: 'Respo Front', desc: 'Mobile developer', imgSrc: balthazarPhoto
    },
    {
      name: 'Maxime Dodin',  role: 'Respo Presentation', desc: 'Backend and devops developer', imgSrc: maximePhoto
    },
    {
      name: 'Diego Rojas',  role: 'Dev', desc: 'Fronted, backend and devops developer', imgSrc: diegoPhoto
    },
    {
      name: 'Bachir Benzaoui',  role: 'Dev', desc: 'Backend and devops developer', imgSrc: bachirPhoto
    },
    {
      name: 'Killian Fleury',  role: 'Dev', desc: 'Frontend developer', imgSrc: kilianPhoto
    }
  ]
  

  return (
    <div className='text-gray-600 dark:text-gray-300' id='team'>
      <div className='mx-auto max-w-7xl px-6 md:px-12 xl:px-6'>
        <div className='mb-20 space-y-4 px-6 md:px-0'>
          <h2 className='text-center text-2xl font-bold text-gray-800 dark:text-white md:text-4xl'>
            {'L\'équipe'}
          </h2>
        </div>
        <div className='grid gap-x-8 gap-y-4 lg:grid-cols-3'>
          {
            teamArr.map((el) => {
              return (
                <div className='aspect-auto rounded-3xl border border-gray-400 bg-white p-8 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none' key={el.name}>
                  <div className='flex gap-4'>
                    <img className='h-12 w-12 rounded-full' src={el.imgSrc} alt={el.name} width='200' height='200' loading='lazy' />
                    <div>
                      <h6 className='text-lg font-medium text-gray-700 dark:text-white'>{el.name}</h6>
                      <p className='text-sm text-gray-500 dark:text-gray-300'>{el.role}</p>
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