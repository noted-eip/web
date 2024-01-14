import { useState } from 'react'
import toast from 'react-hot-toast'

import { useGenerateQuiz,useListQuizs } from '../hooks/api/recommendations'
import { useNoteIdFromUrl } from '../hooks/url'
import { V1GenerateQuizResponse,V1Quiz } from '../protorepo/openapi/typescript-axios'

export const useQuizsPanel = () => {
  const noteId = useNoteIdFromUrl()

  const [toggleQuizModal, setToggleQuizModal] = useState(false)
  const quitQuizModal = () => setToggleQuizModal(false)
  const openQuizModal = () => setToggleQuizModal(true)
  const quizList = useListQuizs({ noteId: noteId })
  
  const [selectedQuiz, setSelectedQuiz] = useState<V1Quiz | undefined>(undefined)
  
  const generateQuizHandler = useGenerateQuiz({
    onSuccess: (data: V1GenerateQuizResponse) => {
      setSelectedQuiz(data.quiz)
    },
    onError: (e) => {
      toast.error(e.response?.data.error as string)
    }
  })

  return {
    setSelectedQuiz,
    noteId,
    toggleQuizModal,
    quitQuizModal,
    openQuizModal,
    quizList,
    selectedQuiz,
    generateQuizHandler,
  }
}  