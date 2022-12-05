import React from 'react'
import {fakeGroup} from './fakeNotesData'
import {fakeNotes} from './fakeNotesData'
import NoteCard from '../../components/card/NoteCard'
import {Accordion} from '../../components/accordion/Accordion'
// import NoteRec from '../../components/card/NoteRec'

const NotesView: React.FC = () => {
  const notes = fakeGroup

  const noteList = fakeNotes

  // TODO: this is the header of the group detail page (based on the mobile figma)
  const notesHeaderUp = (
    <div className='flex border border-rounded rounded-full bg-gray-800 justify-center text-center text-white'>
      <div
        className="flex-auto group relative w-40 justify-center py-2 px-4 text-xl font-medium"
      >
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>
          </svg>

        </span>
        {notes.groupName}
      </div>
      <div className='flex-auto justify-center py-2 w-20'><span className="flex item-center"><svg
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
        className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"/>
      </svg>
      {notes.notesNbr} notes</span></div>
      <div className='flex-auto justify-center py-2 w-40'><span className="flex item-center"><svg
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
        className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      {notes.creationDate}</span></div>
      <div className='flex-auto justify-center py-2 w-40'><span className="flex item-center"><svg
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
        className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      {notes.modifiedDate}</span></div>
    </div>)

  const searchBar = (
    <form>
      <div className="flex">
        <div className="relative w-full">
          <input type="search" id="search-dropdown"
            className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg rounded-l-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
            placeholder="Rechercher notes" />
          <button type="submit"
            className="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <span className="sr-only">Search</span>
          </button>
        </div>
      </div>
    </form>)

  // TODO: this is the note list of the group detail page
  const colNotesView = (<div>
    <div className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2 lg:grid-cols-4 lg:gap-4">
      {noteList.map((e) => {
        return <NoteCard key={e.name} name={e.name} firstChars={e.firstChars}/>
      })}
    </div>
  </div>)

  const notesAccordion = (
    <div>
      <Accordion title="Oui" content="J'aime les chattes"/>
    </div>
  )

  // TODO: put the add button at the end (is it better to use a grid or a flex)
  return (<div className="m-3">
    {/*{notesHeaderUp}*/}
    <div className="flex item-center mb-2">
      <h2 className="flex-initial w-64 text-3xl text-left font-bold"> Mes notes </h2>
      <button className="flex space-x-2 items-center px-3 py-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md drop-shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
        </svg>
        <span className="text-[#1E1E1E]">Ajouter une nouvelle note</span>
      </button>
    </div>
    {searchBar}
    {/*{colNotesView}*/}
    {notesAccordion}
  </div>)
}

export default NotesView