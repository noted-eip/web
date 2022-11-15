import React from 'react'
import {fakeNotes} from './fakeNotesData'
import groupLogo from './multiple-users-silhouette.png'

const NotesView: React.FC = () => {
  const notes = fakeNotes

  return (<div className='flex bg-gray-800 text-center text-white'>
    <div
      className="group relative w-full justify-center py-2 px-4 text-xl font-medium"
    >
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        <img className='flex-auto' src={groupLogo} alt='group icon'
          height='20px' width='20px'></img>
      </span>
      {notes.groupName}
    </div>
    <div className='flex-auto w-20'>{notes.notesNbr} notes</div>
    <div className='flex-auto w-20'>{notes.creationDate}</div>
    <div className='flex-auto w-40'>{notes.modifiedDate}</div>
  </div>)
}

export default NotesView