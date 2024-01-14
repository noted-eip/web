import { BookOpenIcon } from '@heroicons/react/24/outline'
import { Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

import PanelSkeleton from '../components/view/PanelSkeleton'
import { useGenerateQuiz, useListQuizs } from '../hooks/api/recommendations'
import { useNoteIdFromUrl } from '../hooks/url'
import { FormatMessage } from '../i18n/TextComponent'
import { V1GenerateQuizResponse, V1Quiz } from '../protorepo/openapi/typescript-axios'
import QuizsModal from './components/QuizsModal'

const ListQuizs: React.FC = () => {
  const noteId = useNoteIdFromUrl()

  const [toggleQuizModal, setToggleQuizModal] = useState(false)
  const quitQuizModal = () => setToggleQuizModal(false)
  const openQuizModal = () => setToggleQuizModal(true)
  const quizList = useListQuizs({ noteId: noteId })

  const [selectedQuiz, setSelectedQuiz] = useState<V1Quiz | undefined>(undefined)

  //Can find note ? 
  if (noteId == null) {
    return (
      <div className='my-4 text-center text-sm text-gray-400'>
        <FormatMessage id='PANEL.quizs.notFound' />
      </div>)
  }

  const generateQuizHandler = useGenerateQuiz({
    onSuccess: (data: V1GenerateQuizResponse) => {
      setSelectedQuiz(data.quiz)
    },
    onError: (e) => {
      toast.error(e.response?.data.error as string)
    }
  })


  // Generate quizz and check loading state
  return (
    <React.Fragment>
      {toggleQuizModal ? <QuizsModal open={toggleQuizModal} onClose={quitQuizModal} noteId={noteId} selectedQuiz={selectedQuiz} isLoading={generateQuizHandler.isLoading} /> : null}
      <div className='my-4 flex items-center justify-center'>
        <Button
          variant='contained'
          color='primary'
          size='large'
          onClick={() => {
            generateQuizHandler.mutate({ noteId: noteId })
            openQuizModal()
          }}
        >
          <FormatMessage id='PANEL.quizs.generate' />
        </Button>
      </div>
      {quizList.isSuccess ?
        <List>
          {
            quizList?.data.quizs?.map((quiz, idx) => {
              return (
                <ListItem disablePadding key={quiz.id}>
                  <ListItemButton onClick={() => {setSelectedQuiz(quiz), openQuizModal()}}>
                    <ListItemText primary={'Quiz ' + idx} />
                    <ListItemIcon className='flex h-12 w-12 justify-center'>
                      <BookOpenIcon color='primary' className='w-8'/>
                    </ListItemIcon>
                  </ListItemButton>
                </ListItem>
              )
            })
          }
        </List>
        :
        <div className='my-4 text-center text-sm text-gray-400'>
          <p>
            <FormatMessage id='PANEL.quizs.notFound' />
          </p>
        </div>
      }
    </React.Fragment>
  )
}


const NoteQuizsPanel: React.FC = () => {
  return (
    <PanelSkeleton>
      <ListQuizs />
    </PanelSkeleton>
  )
}

export default NoteQuizsPanel
