import React from 'react'

import ViewSkeleton from '../../components/view/ViewSkeleton'
import { useOurIntl } from '../../i18n/TextComponent'

const NoteListOutGroup: React.FC = () => {
  const { formatMessage } = useOurIntl()

  return (<ViewSkeleton title={formatMessage({ id: 'NOTE.myNotes' })} panels={['group-activity']}>
    note list out group
  </ViewSkeleton>)
}

export default NoteListOutGroup
