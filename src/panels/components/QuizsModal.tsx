import { TrophyIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Box, Button, Checkbox, CircularProgress, Dialog, DialogContent, DialogTitle, Slide } from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'
import React from 'react'

import { V1Quiz } from '../../protorepo/openapi/typescript-axios'


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
        <DialogTitle>{`Votre score est de ${score}/${nbQuestions}`}</DialogTitle>
      </DialogContent>
      <DialogContent className='my-2 flex justify-center'>
        <Button className='' onClick={onClose}>{'Fermer'}</Button>
      </DialogContent>
    </DialogContent>)
  )
}

const LoadingQuizsModal: React.FC<{onClose: () => void}> = (props) => {
  const { onClose } = props
  return (
    <DialogContent>
      <DialogContent>
        <DialogTitle>{'Loading...'}</DialogTitle>
        <Button className='' onClick={onClose}>
          <Box sx={{ display: 'flex' }}>
            <XMarkIcon />
          </Box>
        </Button>
      </DialogContent>
      <DialogContent className='my-8 flex justify-center'>
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      </DialogContent>
    </DialogContent>
  )
}

const QuizsModal: React.FC<{ open: boolean, onClose: () => void, noteId: string, selectedQuiz: V1Quiz | undefined, isLoading: boolean }> = (props) => {

  const { open, onClose, selectedQuiz, isLoading } = props
  const [selectedQuestion, setSelectedQuestion] = React.useState<number>(0)
  const [selectedAnswer, setSelectedAnswer] = React.useState<number>(-1)
  const [goodAnswer, setGoodAnswer] = React.useState<string>('')
  const [isAnswerValidated, setIsAnswerValidated] = React.useState<boolean>(false)
  const [score, setScore] = React.useState<number>(0)
  const [displayResult, setDisplayResult] = React.useState<boolean>(false)


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
        <LoadingQuizsModal onClose={onClose} /> :
        displayResult ?
          <ResultQuizsModal onClose={onClose} score={score} nbQuestions={selectedQuiz?.questions?.length || 0} />
          :
          (<React.Fragment>
            <DialogTitle className='m-4 flex justify-center text-xl'>{selectedQuiz?.questions?.[selectedQuestion].question}</DialogTitle>
            {answers?.map((ans, idx) => (
              <Button
                className='m-8 p-2 font-bold'
                size='large'
                color={isAnswerValidated && ans == goodAnswer ? 'success' : isAnswerValidated && ans != goodAnswer ? 'error' : 'primary' }
                key={idx} onClick={() => {!isAnswerValidated ? onSelectedAnswer(idx) : null}}> 
                <Checkbox checked={idx == selectedAnswer} disabled={isAnswerValidated}/>
                {ans}
              </Button>
            ))}

            <DialogTitle className='m-4 self-center text-base'>{`Question ${selectedQuestion + 1} / ${selectedQuiz?.questions?.length}`}</DialogTitle>
            <div className='m-4 flex justify-center'>
              {isAnswerValidated == false  ?
                <Button onClick={handleValidateAnwser}>{'Verifier'}</Button>
                :
                <Button onClick={handleNextQuestion}>{'Suivant'}</Button>
              }
            </div>
          </React.Fragment>)
      }
    </Dialog>

  )

}

export default QuizsModal