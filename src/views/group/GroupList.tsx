import React from 'react'

import ViewSkeleton from '../../components/view/ViewSkeleton'
import { useOurIntl } from '../../i18n/TextComponent'

const GroupList: React.FC = () => {
  const { formatMessage } = useOurIntl()

  return (<ViewSkeleton title={formatMessage({ id: 'GENERIC.home' })} panels={['group-activity']}>
oui
  </ViewSkeleton>)
}

export default GroupList
