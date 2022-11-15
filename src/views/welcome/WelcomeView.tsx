import React from 'react'
import {Link} from 'react-router-dom'

const WelcomeView: React.FC = () => {
  return (
    <div>
      <div>Welcome to Noted!</div>
      <Link to='/signin'>Go to the /signin page!</Link>
      <br/>
      <Link to='/signup'>Go to the /signup page!</Link>
      <br/>
      <Link to='/notes/:id'>Go to the /notes page!</Link>
    </div>
  )
}

export default WelcomeView
