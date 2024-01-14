import { AcademicCapIcon, BoltIcon, PencilIcon } from '@heroicons/react/24/solid'
import { QuestionAnswer } from '@mui/icons-material'

import GroupActivityPanel from '../panels/GroupActivityPanel'
import NoteRecommendationsPanel from '../panels/NoteRecommendationsPanel'
import QuizLeaderboardPanel from '../panels/QuizsLeaderBoardPanel'
import NoteQuizsPanel from '../panels/QuizsPanels'
import { V1Block,V1Widget } from '../protorepo/openapi/typescript-axios'

export const panelMetadata = {
  'group-activity': {
    displayName: 'PANEL.activity',
    icon: BoltIcon,
    component: GroupActivityPanel,
  },
  'note-recommendations': {
    displayName: 'PANEL.companion',
    icon: PencilIcon,
    component: NoteRecommendationsPanel,
  },
  'note-quizs': {
    displayName: 'PANEL.quizs',
    icon: QuestionAnswer,
    component: NoteQuizsPanel,
  },
  'quiz-leaderboard': {
    displayName: 'PANEL.leaderboard',
    icon: AcademicCapIcon,
    component: QuizLeaderboardPanel,
  },
}

export const findArrayWidgetsFromString = ( widgetsSrc: V1Widget[] | undefined, data: string ): V1Widget[] => {
  const widgetsRes: V1Widget[] = []
  const lenght: number = widgetsSrc?.length !== undefined ? widgetsSrc?.length : 0

  for (let i = 0; i < lenght; i++) {
    if (widgetsSrc !== undefined) {
      const currentWidget = widgetsSrc[i]
      const keyword = currentWidget.websiteWidget?.keyword !== undefined ? currentWidget.websiteWidget?.keyword : ''
      if (data.includes(keyword)) {
        widgetsRes.push(widgetsSrc[i])
      }
    }
  }

  return widgetsRes
}

export const blockToString = ( block: V1Block ): string => {
  switch (block.type) {
    case 'TYPE_HEADING_1':
      return block.heading === undefined ? '' : block.heading
    case 'TYPE_HEADING_2':
      return block.heading === undefined ? '' : block.heading
    case 'TYPE_HEADING_3':
      return block.heading === undefined ? '' : block.heading
    case 'TYPE_PARAGRAPH':
      return block.paragraph === undefined ? '' : block.paragraph
    case 'TYPE_BULLET_POINT':
      return block.bulletPoint === undefined ? '' : block.bulletPoint
    case 'TYPE_NUMBER_POINT':
      return block.numberPoint === undefined ? '' : block.numberPoint
    case 'TYPE_MATH':
      return block.math === undefined ? '' : block.math
    default:
  }
  return ''
}