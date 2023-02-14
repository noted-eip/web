import React from 'react'

const NotesViewEdit: React.FC = () => {
  return <div>TODO</div>
  // const location = useLocation()
  // const noteId = location.pathname.split('/')[4]
  // const getNoteQ = useGetNote({ note_id: noteId })

  // return (
  //   <div>
  //     {getNoteQ?.data && (
  //       <>
  //         <p>Title: {getNoteQ?.data?.data.note.title}</p>
  //         <p>created_at: {getNoteQ?.data?.data.note.created_at}</p>
  //         <p>modified_at: {getNoteQ?.data?.data.note.modified_at}</p>
  //         <br />
  //         {getNoteQ?.data?.data.note.blocks?.map((e) => {
  //           return (
  //             <div key={e.id}>
  //               <br />
  //               <h2 className='justify-items-center'>{e.heading}</h2>
  //               {e.paragraph}
  //             </div>
  //           )
  //         })}
  //       </>
  //     )}
  //   </div>
  // )
}

export default NotesViewEdit
