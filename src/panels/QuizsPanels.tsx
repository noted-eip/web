import { BookOpenIcon } from '@heroicons/react/24/outline'
import { Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'

import Notification from '../components/notification/Notification'
import PanelSkeleton from '../components/view/PanelSkeleton'
import { FormatMessage } from '../i18n/TextComponent'
import QuizsModal from './components/QuizsModal'
import { useQuizsPanel } from './useQuizsPanel'
const ListQuizs: React.FC = () => {
  const { 
    noteId, 
    quizList, 
    generateQuizHandler, 
    toggleQuizModal, 
    openQuizModal, 
    quitQuizModal, 
    setSelectedQuiz,
    selectedQuiz, 
  } = useQuizsPanel()

  //Can find note ? 
  if (noteId == null) {
    return (
      <div className='my-4 text-center text-sm text-gray-400'>
        <FormatMessage id='PANEL.quizs.notFound' />
      </div>)
  }
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
        <List className='m-4 space-y-2 overflow-y-scroll'>
          {
            quizList?.data.quizs?.map((quiz, idx) => {
              return (
                <ListItem key={quiz.id}>
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
      <Notification />
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
