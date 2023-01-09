import { DocumentTextIcon, PlusIcon } from '@heroicons/react/24/outline'
import { FolderIcon } from '@heroicons/react/24/solid'
import React, {useState} from 'react'
import { useGroupContext } from '../../contexts/group'
import { useGetGroup } from '../../hooks/api/groups'
import GroupViewMenu from './GroupViewMenu'
import {useAuthContext} from '../../contexts/auth'
import {getNotes} from '../../hooks/api/notes'
import {GetNotesResponse} from '../../types/api/notes'
import {useNavigate} from 'react-router-dom'

const GroupViewNotesTab: React.FC = () => {
  const navigate = useNavigate()
  const authorContext = useAuthContext()
  const [notes, setNotes] = useState<GetNotesResponse[]>()
  getNotes(authorContext.userID).then((e) => setNotes(e.notes))
  const groupContext = useGroupContext()
  const getGroupQ = useGetGroup({ group_id: groupContext.groupID as string })

  return <div className='grid grid-rows-1 gap-4 w-full'>
    <GroupViewMenu activeTab={''}>
      {
        getGroupQ.isSuccess ?
          <div className='mr-4 flex bg-gray-100 h-7 rounded px-2'>      
            <div className='flex items-center'>
              <FolderIcon className='text-gray-500 h-4 w-4 mr-2' /><p className='text-sm text-gray-500 mr-1 hover:underline cursor-pointer decoration-2 decoration-blue-500'>{getGroupQ.data.data.group.name}</p>
            </div>
          </div>
          :
          <div className='skeleton w-56 h-7'></div>
      }
    </GroupViewMenu>
    <div className='w-full flex grid-cols-6'>
      <div className='w-48 h-48 items-center justify-center cursor-pointer p-2 border-dashed border-gray-300 border-2 rounded text-gray-600 flex flex-col'>
        <DocumentTextIcon className='text-gray-400 h-12 w-12 stroke-1 mb-4' />
        <div className='flex items-center text-gray-500'>
          <PlusIcon className='text-gray-500 h-5 w-5 mr-1' />New Note
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2 lg:grid-cols-3 lg:gap-3">
      { notes && notes.map((e) => {
        return  <div key={e.id} className='w-48 h-48 items-center justify-center cursor-pointer p-2 border-gray-300 border-2 rounded text-gray-600 flex flex-col'
          onClick={() => {
            navigate(`notes/${e.id}`)
          }
          }>
          <DocumentTextIcon className='text-gray-400 h-12 w-12 stroke-1 mb-4' />
          {e.title}
        </div>
      })}
    </div>
  </div>
}

export default GroupViewNotesTab
