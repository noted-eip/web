import {useLocation} from 'react-router-dom'
import React from 'react'
import {useGetNote} from '../../hooks/api/notes'
import {GetNoteRequest} from '../../types/api/notes'

const NotesViewEdit: React.FC = () => {
  const location = useLocation()
  // très moche
  const note_id: GetNoteRequest = {note_id: location.pathname.split('/')[4]}
  const getNoteQ = useGetNote(note_id)

  return (<div>
    {getNoteQ?.data && <><p>Title: {getNoteQ?.data?.data.note.title}</p>
      <p>created_at: {getNoteQ?.data?.data.note.created_at}</p>
      <p>modified_at: {getNoteQ?.data?.data.note.modified_at}</p>
      <br />
      {getNoteQ?.data?.data.note.blocks?.map((e, idx) => {

        return (<div key={e.id}>
          <br />
          <h2 className="justify-items-center">{e.heading}</h2>
          {e.paragraph}
        </div>)
      })}
    </>}
  </div>)
}

export default NotesViewEdit