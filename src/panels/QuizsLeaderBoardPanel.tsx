import { FireIcon } from '@heroicons/react/24/solid'
import React
  from 'react'

import LoaderIcon from '../components/icons/LoaderIcon'
import PanelSkeleton from '../components/view/PanelSkeleton'
import { useGetAccount } from '../hooks/api/accounts'
import { useGetCurrentGroup } from '../hooks/api/groups'
import { FormatMessage } from '../i18n/TextComponent'
import { V1GroupMember } from '../protorepo/openapi/typescript-axios'

function percentage(partialValue, totalValue) {
  return (100 * partialValue) / totalValue
}

const ProgressBar: React.FC<{ bgcolor, completed }> = (props) => {
  const { completed } = props

  const containerStyles = {
    height: 20,
    width: '100%',
    backgroundColor: '#e0e0de',
    borderRadius: 50,
    marginLeft: 2,
    marginRight: 18,
    marginBottom: 18,
    marginTop: 18,
  }

  const fillerStyles = {
    height: '100%',
    width: `${completed}%`,
    background: 'linear-gradient(to right, #6a1b9a, #b71c1c)',
    borderRadius: 'inherit',
    textAlign: 'right' as const
  }

  const labelStyles = {
    padding: 5,
    color: 'white',
    fontWeight: 'semi-bold'
  }

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        <span style={labelStyles}>{`${completed}%`}</span>
      </div>
    </div>
  )
}

const LeaderboardListMember: React.FC<{ member: V1GroupMember, withIcon: boolean }> = (props) => {

  const account = useGetAccount({ accountId: props.member.accountId })
  const score = percentage(props.member.score, props.member.totalQuiz)


  if (account.isLoading) {
    return (
      <div className='cursor-pointer rounded-md border border-gray-100 bg-gray-50 bg-gradient-to-br p-4 hover:bg-gray-100 hover:shadow-inner'>
        <LoaderIcon className='mr-3 h-6 w-6 text-gray-400' />
        <FormatMessage id='PANEL.leaderboard.loading' />
      </div>
    )
  }

  return (
    <div
      className='cursor-pointer rounded-md border border-gray-100 bg-gray-50 bg-gradient-to-br p-4 hover:bg-gray-100 hover:shadow-inner'
    >
      <div className='flex flex-col'>
        <div className='flex flex-row'>
          <p className='self-start font-normal'>{account.data?.account.name}</p>
          {props.withIcon ? (
            <FireIcon className='h-6 w-6 p-1 text-gray-400' />
          ) : null}
        </div>
        <ProgressBar bgcolor='#6a1b9a' completed={score | 0} />
      </div>
    </div>
  )
}

const LeaderboardListMembers: React.FC = () => {
  const currentGroup = useGetCurrentGroup()
  const members = currentGroup.data?.group.members?.filter((member) => {
    return member.totalQuiz ? member.totalQuiz > 0 : false
  }).sort((a : V1GroupMember, b : V1GroupMember) => {
    return percentage(b.score, b.totalQuiz) - percentage(a.score, a.totalQuiz)
  })

  return (
    <div className='space-y-2'>
      {currentGroup.isSuccess ? (
        !members ? (
          <div className='my-4 text-center text-sm text-gray-400'>
            <FormatMessage id='PANEL.leaderboard.none' />
          </div>
        ) : (
          members.map((member, idx) => (
            <LeaderboardListMember withIcon={idx == 0} key={idx} member={member} />
          ))
        )
      ) : (
        <div className='my-4 text-center text-sm text-gray-400'>
          <FormatMessage id='PANEL.leaderboard.loading' />
        </div>
      )}
    </div>
  )
}

const QuizLeaderboardPanel: React.FC = () => {

  return (
    <PanelSkeleton>
      <LeaderboardListMembers/>
    </PanelSkeleton>
  )
}

export default QuizLeaderboardPanel