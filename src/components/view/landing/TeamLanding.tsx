import React from 'react'

import bachirPhoto from '../../../assets/team_photos/bachir.jpg'
import balthazarPhoto from '../../../assets/team_photos/balthazar.png'
import diegoPhoto from '../../../assets/team_photos/diego.jpg'
import edouardPhoto from '../../../assets/team_photos/edouard.jpeg'
import gabrielPhoto from '../../../assets/team_photos/Gabi.jpg'
import kilianPhoto from '../../../assets/team_photos/Kilian.jpg'
import maximePhoto from '../../../assets/team_photos/maxime.jpg'

const TeamLanding: React.FC = () => {
  return (
    <div className='text-gray-600 dark:text-gray-300' id='team'>
      <div className='mx-auto max-w-7xl px-6 md:px-12 xl:px-6'>
        <div className='mb-20 space-y-4 px-6 md:px-0'>
          <h2 className='text-center text-2xl font-bold text-gray-800 dark:text-white md:text-4xl'>
            {'L\'équipe'}
          </h2>
        </div>
        <div className='grid gap-x-8 gap-y-4 lg:grid-cols-3'>
          <div className='aspect-auto rounded-3xl border border-gray-400 bg-white p-8 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none'>
            <div className='flex gap-4'>
              <img className='h-12 w-12 rounded-full' src={edouardPhoto} alt='user avatar' width='200' height='200' loading='lazy' />
              <div>
                <h6 className='text-lg font-medium text-gray-700 dark:text-white'>Edouard Sengeissen</h6>
                <p className='text-sm text-gray-500 dark:text-gray-300'>Respo Deadlines and docs</p>
              </div>
            </div>
            <p className='mt-8'>Backend and devops developer.</p>
          </div>
          <div className='aspect-auto rounded-3xl border border-gray-400 bg-white p-8 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none'>
            <div className='flex gap-4'>
              <img className='h-12 w-12 rounded-full' src={gabrielPhoto} alt='user avatar' width='200' height='200' loading='lazy' />
              <div>
                <h6 className='text-lg font-medium text-gray-700 dark:text-white'>Gabriel Medoukali</h6>
                <p className='text-sm text-gray-500 dark:text-gray-300'>Respo Back</p>
              </div>
            </div>
            <p className='mt-8'>Backend and devops developer.</p>
          </div>
          <div className='aspect-auto rounded-3xl border border-gray-400 bg-white p-8 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none'>
            <div className='flex gap-4'>
              <img className='h-12 w-12 rounded-full' src={balthazarPhoto} alt='user avatar' width='200' height='200' loading='lazy' />
              <div>
                <h6 className='text-lg font-medium text-gray-700 dark:text-white'>Balthazar Roque</h6>
                <p className='text-sm text-gray-500 dark:text-gray-300'>Respo Front</p>
              </div>
            </div>
            <p className='mt-8'>Mobile developer.</p>
          </div>
          <div className='aspect-auto rounded-3xl border border-gray-400 bg-white p-8 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none'>
            <div className='flex gap-4'>
              <img className='h-12 w-12 rounded-full' src={maximePhoto} alt='user avatar' width='200' height='200' loading='lazy' />
              <div>
                <h6 className='text-lg font-medium text-gray-700 dark:text-white'>Maxime Dodin</h6>
                <p className='text-sm text-gray-500 dark:text-gray-300'>Respo Presentation</p>
              </div>
            </div>
            <p className='mt-8'>Backend and devops developer.</p>
          </div>
          <div className='aspect-auto rounded-3xl border border-gray-400 bg-white p-8 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none'>
            <div className='flex gap-4'>
              <img className='h-12 w-12 rounded-full' src={diegoPhoto} alt='user avatar' width='200' height='200' loading='lazy' />
              <div>
                <h6 className='text-lg font-medium text-gray-700 dark:text-white'>Diego Rojas</h6>
                <p className='text-sm text-gray-500 dark:text-gray-300'>Dev</p>
              </div>
            </div>
            <p className='mt-8'>Fronted, backend and devops developer.</p>
          </div>
          <div className='aspect-auto rounded-3xl border border-gray-400 bg-white p-8 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none'>
            <div className='flex gap-4'>
              <img className='h-12 w-12 rounded-full' src={bachirPhoto} alt='user avatar' width='200' height='200' loading='lazy' />
              <div>
                <h6 className='text-lg font-medium text-gray-700 dark:text-white'>Bachir Benzaoui</h6>
                <p className='text-sm text-gray-500 dark:text-gray-300'>Dev</p>
              </div>
            </div>
            <p className='mt-8'>Backend and devops developer.</p>
          </div>
          <div className='aspect-auto rounded-3xl border border-gray-400 bg-white p-8 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none'>
            <div className='flex gap-4'>
              <img className='h-12 w-12 rounded-full' src={kilianPhoto} alt='user avatar' width='200' height='200' loading='lazy' />
              <div>
                <h6 className='text-lg font-medium text-gray-700 dark:text-white'>Killian Fleury</h6>
                <p className='text-sm text-gray-500 dark:text-gray-300'>Dev</p>
              </div>
            </div>
            <p className='mt-8'>Frontend developer.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamLanding