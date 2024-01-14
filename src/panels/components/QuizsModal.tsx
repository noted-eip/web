import { TrophyIcon } from '@heroicons/react/24/outline'
import { Box, Button, Checkbox, CircularProgress, Dialog, DialogContent, DialogTitle, Slide } from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'
import React from 'react'

import { FormatMessage } from '../../i18n/TextComponent'
import { V1Quiz } from '../../protorepo/openapi/typescript-axios'
import { useQuizsModal } from './useQuizsModal'


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction='up' ref={ref} {...props} />
})

export interface QuizsModalProps {
  onClose: () => void
  open: boolean
  selectedQuiz: V1Quiz | undefined
  isLoaded: boolean
  noteId: string
}

const ResultQuizsModal: React.FC<{onClose: () => void, score: number, nbQuestions: number}> = (props) => {
  const { onClose, score, nbQuestions } = props
  return (
    (<DialogContent>
      <DialogContent className='my-2 flex justify-center'>
        <Box sx={{ display: 'flex', width: '80px' }}>
          <TrophyIcon />
        </Box>
      </DialogContent>
      <DialogContent className='my-2 flex justify-center'>
        <DialogTitle>
          <FormatMessage id={'QUIZS.score' }/>
          {` ${score} / ${nbQuestions}`}
        </DialogTitle>
      </DialogContent>
      <DialogContent className='my-2 flex justify-center'>
        <Button className='' onClick={onClose}>
          <FormatMessage id={'QUIZS.button.quit' }/>
        </Button>
      </DialogContent>
    </DialogContent>)
  )
}

const LoadingQuizsModal: React.FC = () => {
  return (
    <DialogContent>
      <DialogTitle>
        <FormatMessage id={'QUIZS.noQuiz' }/>
      </DialogTitle>
      <DialogContent className='my-8 flex justify-center'>
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      </DialogContent>
    </DialogContent>
  )
}

const QuizsModal: React.FC<{ open: boolean, onClose: () => void, noteId: string, selectedQuiz: V1Quiz | undefined, isLoading: boolean }> = (props) => {

  const { open, onClose, selectedQuiz, noteId, isLoading } = props
  const { 
    displayResult,
    answers,
    isAnswerValidated,
    selectedQuestion,
    selectedAnswer,
    goodAnswer,
    score,
    handleNextQuestion,
    handleValidateAnwser,
    onSelectedAnswer
  } = useQuizsModal(noteId, selectedQuiz)


  return (
    <Dialog
      PaperProps={{
        className: 'p-8',
        sx: {
          width: '80%',
        }
      }}
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-describedby='alert-dialog-slide-description'
    >
      {isLoading || selectedQuiz?.questions == undefined ?
        <LoadingQuizsModal/> :
        displayResult ?
          <ResultQuizsModal onClose={onClose} score={score} nbQuestions={selectedQuiz?.questions?.length || 0} />
          :
          (<React.Fragment>
            <DialogTitle className='m-4 flex justify-center text-xl'>{selectedQuiz?.questions?.[selectedQuestion].question}</DialogTitle>
            {answers?.map((ans, idx) => (
              <Button
                className='m-8 p-2 font-bold'
                size='large'
                color={isAnswerValidated && goodAnswer.includes(ans) ? 'success' : isAnswerValidated && !goodAnswer.includes(ans) ? 'error' : 'primary' }
                key={idx} onClick={() => {!isAnswerValidated ? onSelectedAnswer(idx) : null}}> 
                <Checkbox checked={selectedAnswer.includes(idx)} disabled={isAnswerValidated}/>
                {ans}
              </Button>
            ))}

            <DialogTitle className='m-4 self-center text-base'>{`Question ${selectedQuestion + 1} / ${selectedQuiz?.questions?.length}`}</DialogTitle>
            <div className='m-4 flex justify-center'>
              {isAnswerValidated == false  ?
                <Button onClick={handleValidateAnwser}>
                  <FormatMessage id={'QUIZS.button.check' }/>
                </Button>
                :
                <Button onClick={handleNextQuestion}>
                  <FormatMessage id={'QUIZS.button.next' }/>
                </Button>
              }
            </div>
          </React.Fragment>)
      }
    </Dialog>

  )

}

export default QuizsModal