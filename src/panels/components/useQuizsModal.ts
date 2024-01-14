import React from 'react'

import { useTrackScore } from '../../hooks/api/members'
import { V1Quiz } from '../../protorepo/openapi/typescript-axios'


export const useQuizsModal = (noteId: string, selectedQuiz: V1Quiz | undefined) => {
  const [selectedQuestion, setSelectedQuestion] = React.useState<number>(0)
  const [selectedAnswer, setSelectedAnswer] = React.useState<number>(-1)
  const [goodAnswer, setGoodAnswer] = React.useState<string>('')
  const [isAnswerValidated, setIsAnswerValidated] = React.useState<boolean>(false)
  const [score, setScore] = React.useState<number>(0)
  const [displayResult, setDisplayResult] = React.useState<boolean>(false)
  const trackScore = useTrackScore()

  const onSelectedAnswer = (idx: number) => {
    setGoodAnswer(selectedQuiz?.questions?.[selectedQuestion].solutions?.[0] || '')
    setSelectedAnswer(idx)
  }

  const handleNextQuestion = () => {
    setIsAnswerValidated(false)
    setSelectedAnswer(-1)
    if (selectedQuestion + 1 < (selectedQuiz?.questions?.length || 0)) {
      setSelectedQuestion(selectedQuestion + 1)
    } else {
      setDisplayResult(true)
      trackScore.mutate(
        {score: score, responses: selectedQuiz?.questions?.length || 0, note_id: noteId},
      )
    }
    setGoodAnswer(selectedQuiz?.questions?.[selectedQuestion].solutions?.[0] || '')
  }

  const handleValidateAnwser = () => {
    setIsAnswerValidated(true)
    if (goodAnswer == selectedQuiz?.questions?.[selectedQuestion].answers?.[selectedAnswer]) {
      setScore(score + 1)
    }
  }

  const answers = selectedQuiz?.questions?.[selectedQuestion].answers 
  return {
    selectedQuestion,
    selectedAnswer,
    goodAnswer,
    isAnswerValidated,
    score,
    displayResult,
    onSelectedAnswer,
    handleNextQuestion,
    handleValidateAnwser,
    answers,
  }
}