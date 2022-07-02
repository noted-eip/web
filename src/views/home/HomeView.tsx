import React from 'react'
import Input from '../../components/form/Input'

const HomeView: React.FC = () => {
  const [text, setText] = React.useState('')
  const [invalid, setInvalid] = React.useState(false)

  return (
    <div className='flex justify-center items-center w-screen h-screen'>
      <div>
        <Input value={text} tooltip='Example tooltip' label='Message' errorMessage='Way too long!' isInvalid={invalid} onChange={(e) => {
          setText(e.target.value)
          setInvalid(e.target.value.length > 5)
        }} />
      </div>
    </div>
  )
}

export default HomeView
