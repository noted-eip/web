import React from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import ViewSkeleton from '../../components/view/ViewSkeleton'
import { useGroupContext } from '../../contexts/group'
import GroupViewEmptyState from './GroupViewEmptyState'

const GroupView: React.FC = () => {
  const groupContext = useGroupContext()
  const navigate = useNavigate()
  const routerParams = useParams()
  const [isLoading, setIsLoading] = React.useState(true)

  // Synchronises the current group from the local storage
  // and the current group context.
  React.useEffect(() => {
    if (groupContext.groupID && !routerParams.groupId) {
      navigate(`/group/${groupContext.groupID}`)
    }
    if (routerParams.groupId && routerParams.groupId !== groupContext.groupID) {
      groupContext.changeGroup(routerParams.groupId)
    }
    setIsLoading(false)
  })

  if (isLoading) {
    return <div></div>
  }

  return (
    <ViewSkeleton title='Home' panels={['group-chat', 'group-activity']}>
      {groupContext.groupID ? (
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
