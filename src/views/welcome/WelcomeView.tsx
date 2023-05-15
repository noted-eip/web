import React from 'react'

import ContactLanding from '../../components/view/landing/ContactLanding'
import DescriptionLanding from '../../components/view/landing/DescriptionLanding'
import HeaderLanding from '../../components/view/landing/HeaderLanding'
import TeamLanding from '../../components/view/landing/TeamLanding'
import TimelineLanding from '../../components/view/landing/TimelineLanding'

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
