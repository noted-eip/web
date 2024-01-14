import React from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'

import ViewSkeleton from '../../components/view/ViewSkeleton'
import { useGroupContext } from '../../contexts/group'
import GroupViewEmptyState from './GroupViewEmptyState'
import GroupViewMenu from './GroupViewMenu'

const GroupView: React.FC = () => {
  const groupContext = useGroupContext()
  const navigate = useNavigate()
  const routerParams = useParams()
  const [isLoading, setIsLoading] = React.useState(true)

  // Synchronises the current group from the local storage
  // and the current group context.
  React.useEffect(() => {
    if (groupContext.groupId && !routerParams.groupId) {
      navigate(`/group/${groupContext.groupId}`)
    }
    if (routerParams.groupId && routerParams.groupId !== groupContext.groupId) {
      groupContext.changeGroup(routerParams.groupId)
    }
    setIsLoading(false)
  })

  if (isLoading) {
    return <div></div>
  }

  return (
    <ViewSkeleton element={<GroupViewMenu activeTab={location.pathname.endsWith('/settings') ? 'settings' : ''} />} panels={['group-activity']}>
      {groupContext.groupId ? (
        <div className='mx-lg mb-lg w-full xl:mx-xl xl:mb-xl'>
          <Outlet />
        </div>
      ) : (
        <GroupViewEmptyState />
      )}
    </ViewSkeleton>
  )
}

export default GroupView
