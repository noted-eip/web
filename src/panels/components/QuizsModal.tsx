import React from 'react'

import { V1Quiz } from '../../protorepo/openapi/typescript-axios'

export interface QuizsModalProps {
  onClose: () => void
  quizs: V1Quiz[]
}

const QuizsModal: React.FC<{onClose: () => void, quizs: V1Quiz[]}> = (props) => {

  const { onClose, quizs } = props
  return (
    <h1>Quiz</h1>
  )

}

export default QuizsModal