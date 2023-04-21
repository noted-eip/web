import React from 'react'
import HeaderLanding from '../../components/view/landing/HeaderLanding'
import DescriptionLanding from '../../components/view/landing/DescriptionLanding'
import TimelineLanding from '../../components/view/landing/TimelineLanding'
import TeamLanding from '../../components/view/landing/TeamLanding'
import ContactLanding from '../../components/view/landing/ContactLanding'

const WelcomeView: React.FC = () => {
  return (
    <div className='bg-white dark:bg-gray-900'>
      <HeaderLanding />
      <main className='mb-40 space-y-20'>
        <DescriptionLanding />
        <TimelineLanding />
        <TeamLanding />
        <ContactLanding />
      </main>
    </div>
  )
}

export default WelcomeView
