import React from 'react'

import { useTrackScore } from '../../hooks/api/members'
import { V1Quiz } from '../../protorepo/openapi/typescript-axios'


function areArraysEqualSets(a1, a2) {
  const superSet = {}
  for (const i of a1) {
    const e = i + typeof i
    superSet[e] = 1
  }

  for (const i of a2) {
    const e = i + typeof i
    if (!superSet[e]) {
      return false
    }
    superSet[e] = 2
  }

  for (const e in superSet) {
    if (superSet[e] === 1) {
      return false
    }
  }

  return true
}


export const useQuizsModal = (noteId: string, selectedQuiz: V1Quiz | undefined) => {
  const [selectedQuestion, setSelectedQuestion] = React.useState<number>(0)
  const [selectedAnswer, setSelectedAnswer] = React.useState<number[]>([])
  const [goodAnswer, setGoodAnswer] = React.useState<string[]>([])
  const [isAnswerValidated, setIsAnswerValidated] = React.useState<boolean>(false)
  const [score, setScore] = React.useState<number>(0)
  const [displayResult, setDisplayResult] = React.useState<boolean>(false)
  const trackScore = useTrackScore()

  const onSelectedAnswer = (idx: number) => {
    setGoodAnswer(selectedQuiz?.questions?.[selectedQuestion].solutions || [])
    if (selectedAnswer.includes(idx)) {
      setSelectedAnswer(selectedAnswer.filter((item) => item !== idx))
      return
    }
    setSelectedAnswer([...selectedAnswer, idx])
  }

  const handleNextQuestion = () => {
    setIsAnswerValidated(false)
    setSelectedAnswer([])
    if (selectedQuestion + 1 < (selectedQuiz?.questions?.length || 0)) {
      setSelectedQuestion(selectedQuestion + 1)
    } else {
      setDisplayResult(true)
      trackScore.mutate(
        {score: score, responses: selectedQuiz?.questions?.length || 0, note_id: noteId},
      )
    }
    setGoodAnswer(selectedQuiz?.questions?.[selectedQuestion].solutions || [])
  }

  const handleValidateAnwser = () => {
    setGoodAnswer(selectedQuiz?.questions?.[selectedQuestion].solutions || [])
    setIsAnswerValidated(true)

    const selectedAnswersValue = selectedQuiz?.questions?.[selectedQuestion].answers?.filter((_, idx) => selectedAnswer.includes(idx))
    if (areArraysEqualSets(goodAnswer, selectedAnswersValue)) {
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