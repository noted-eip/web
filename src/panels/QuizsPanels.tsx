import { Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import PanelSkeleton from '../components/view/PanelSkeleton'
import { useGenerateQuiz, useListQuizs } from '../hooks/api/recommendations'
import { useNoteIdFromUrl} from '../hooks/url'
import { FormatMessage } from '../i18n/TextComponent'
import { V1GenerateQuizResponse, V1Quiz, V1QuizQuestion } from '../protorepo/openapi/typescript-axios'

const QuizQuestion: React.FC<{ question: V1QuizQuestion }> = (props) => {
  const question = props.question?.question
  const answers = props.question?.answers
  const solutions = props.question?.solutions
  const [clickedQs, setClickedQ] = useState<number[]>([])

  useEffect(() => {
    // Reset clickedQs when the question prop changes
    setClickedQ([])
  }, [props.question])

  const selectedBg = (selected:boolean, right:boolean) => {
    if (selected) {
      return right ? 'bg-green-100' : 'bg-red-100'
    }
    return ''
  }

  return (
    <div className='mx-4 cursor-pointer rounded-md border border-blue-100 bg-gray-50 bg-gradient-to-br py-4 text-center'>
      <div className='flex flex-col'>
        <p className='font-bold'>{question}</p>
        {answers?.map((answer, idx) => (
          <p 
            onClick={() => {
              if (clickedQs.includes(idx) !== true) { 
                setClickedQ(clickedQs.concat(idx))
              }
            }
            }   
            key={question + '-' + idx} 
            className={`font-normal hover:shadow-inner ${selectedBg(clickedQs.includes(idx), solutions?.includes(answer) == true)}`}>{ answer }
          </p>
        ))}
      </div>
    </div>
  )
}


const GenerateWidget: React.FC<{goBack: () => void, quiz: V1Quiz }> = (props) => {
  const [index, setIndex] = React.useState(0)

  const quiz = props.quiz
  // End of a quiz
  if (index >= (quiz?.questions?.length as number)) { 
    props.goBack()
    return <></>
  }

  // Fetch current question
  const currentQuestion = quiz?.questions?.[index]
  if (currentQuestion == null) {
    return (
      <div className='my-4 text-center text-sm text-gray-400'>
        <p>
          <FormatMessage id='PANEL.quizs.notFound' />
        </p>
      </div>)
  }

  return (<div className='content-center items-center'>
    <QuizQuestion question={currentQuestion}/>
    <div className='flex items-center justify-center p-3'>
      <Button 
        variant='contained' 
        color='primary' 
        onClick={() => {
          setIndex(index + 1)
        }}
      >
        <FormatMessage id='PANEL.quizs.next' />
      </Button>
    </div>
  </div>)

}

const ListQuizs: React.FC<{goBack: () => void, chooseQuiz: (_:V1Quiz | undefined) => void }> = (props) => {
  const noteId = useNoteIdFromUrl()
  const chooseQuiz = props.chooseQuiz
  const quizList = useListQuizs({ noteId: noteId })
  const generateQuizHandler = useGenerateQuiz({
    onSuccess: (data: V1GenerateQuizResponse) => {
      chooseQuiz(data.quiz)
      quizList.refetch()
    },
    onError: (e) => {
      toast.error(e.response?.data.error as string)
    }
  })

  // Can find note ? 
  if (noteId == null) {
    return (
      <div className='my-4 text-center text-sm text-gray-400'>
        <FormatMessage id='PANEL.quizs.notFound' />
      </div>)
  }

  // Generate quizz and check loading state
  return (
    <div>
      <div className='flex justify-center items-center'>
        <Button
          className=''
          variant='contained' 
          color='primary' 
          onClick={() => {
            generateQuizHandler.mutate({ noteId: noteId })
          }}
        >
          <FormatMessage id='PANEL.quizs.generate' />
        </Button>
      </div>
      {quizList?.data?.quizs?.map((quiz, idx) => 
        <p 
          key={quiz.id} 
          className='text-center font-normal hover:shadow-inner' 
          onClick={() => chooseQuiz(quiz)}
        >
          { 'Quiz ' + idx }
        </p>
      )}
    </div>
  )
}


const NoteQuizsPanel: React.FC = () => {
  const [quiz, setQuiz] = useState<V1Quiz | undefined>(undefined)
  const goBack = () => setQuiz(undefined)

  return (
    <PanelSkeleton>
      { quiz === undefined ? 
        <ListQuizs goBack={goBack} chooseQuiz={setQuiz}/> : 
        <GenerateWidget goBack={goBack} quiz={quiz}/>
      }
    </PanelSkeleton>
  )
}

export default NoteQuizsPanel
