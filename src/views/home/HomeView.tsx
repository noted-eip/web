import React from 'react'

import ViewSkeleton from '../../components/view/ViewSkeleton'
import { useOurIntl } from '../../i18n/TextComponent'

const HomeView: React.FC = () => {
  const { formatMessage } = useOurIntl()

  return (<ViewSkeleton title={formatMessage({ id: 'GENERIC.home' })} panels={['group-activity']}>
    home view
  </ViewSkeleton>)
}

export default HomeView
