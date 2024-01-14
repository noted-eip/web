import Timeline from '@mui/lab/Timeline'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import React from 'react'

import { FormatMessage, useOurIntl } from '../../../i18n/TextComponent'

type TTimeline = {
  title: string
  desc: string
}

interface ITimelineCard {
  title: string
  desc: string
}

const TimelineCard: React.FC<ITimelineCard> = ({ title, desc }) => {
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <Card>
          <CardContent>
            <h4 className='text-lg font-semibold text-gray-700'>{title}</h4>
            <p className='text-gray-600'>{desc}</p>
          </CardContent>
        </Card>
      </TimelineContent>
    </TimelineItem>
  )
}

const TimelineLanding: React.FC = () => {
  const { formatMessage } = useOurIntl()
  const timelineArr: TTimeline[] = [
    {
      title: 'Test & Learn',  desc: formatMessage({ id: 'TIMELINE.desc1' })
    },
    {
      title: 'Managment and processes',  desc: formatMessage({ id: 'TIMELINE.desc2' })
    },
    {
      title: 'Fast Forward',  desc: formatMessage({ id: 'TIMELINE.desc3' })
    },
    {
      title: 'Beta & Growth Hacking',  desc: formatMessage({ id: 'TIMELINE.desc4' })
    },
    {
      title: 'Consolidation',  desc: formatMessage({ id: 'TIMELINE.desc5' })
    },
    {
      title: 'Lauch and Metrics',  desc: formatMessage({ id: 'TIMELINE.desc6' })
    }
  ]
  
  return (
    <div id='timeline'>
      <div className='mx-auto max-w-7xl px-6 md:px-12 xl:px-6'>
        <div className='md:w-2/3 lg:w-1/2'>
          <h2 className='my-8 text-2xl font-bold text-gray-700 dark:text-white md:text-4xl'>
            <FormatMessage id='TIMELINE' />
          </h2>
        </div>
        <div
          className='mt-16 grid overflow-hidden rounded-3xl border border-gray-400 text-gray-600 dark:divide-gray-700 dark:border-gray-700'
        >
          <Timeline position='alternate'>
            {timelineArr.map((el) => {
              return (
                <TimelineCard key={el.title} title={el.title} desc={el.desc} />
              // <div className='group relative bg-white transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 dark:bg-gray-800' key={el.title}>
              //   <div className='relative space-y-8 p-8'>
              //     <div className='space-y-2'>
              //       <h5
              //         className='text-xl font-semibold text-gray-700 transition dark:text-white'
              //       >
              //         {el.title}
              //       </h5>
              //       <p className='text-gray-600 dark:text-gray-300'>
              //         {el. desc}
              //       </p>
              //     </div>
              //   </div>
              // </div>
              )
            }) }
          </Timeline>
        </div>
      </div>
    </div>
  )
}

export default TimelineLanding