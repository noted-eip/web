import React from 'react'

import { V1Note } from '../../protorepo/openapi/typescript-axios'

type NotesLiNotesListGridItemContextMenuProps = {
  note: V1Note,
  targetId: string,
  options: {
    name: string,
    icon: (props: React.SVGProps<SVGSVGElement> & { title?: string | undefined; titleId?: string | undefined; }) => JSX.Element,
    onClick: () => void,
  }[],
}
  
const NotesListGridItemContextMenu: React.FC<NotesLiNotesListGridItemContextMenuProps> = (props) => {
  const [contextData, setContextData] =  React.useState({ visible:false, posX: 0, posY: 0})
  const contextRef =  React.useRef<HTMLDivElement>(null)
  
  React.useEffect(() => {
    const contextMenuEventHandler= (e) => {
      const targetElement = document.getElementById(props.targetId)
  
      if (targetElement && targetElement.contains(e.target)) {
        e.preventDefault()
        setContextData({ visible: true, posX: e.clientX, posY: e.clientY })
      } else if(contextRef.current && !contextRef.current.contains(e.target)){
        setContextData({ ...contextData, visible: false })
      }
    }
  
    const offClickHandler= () => {
      if(contextRef.current){
        setContextData({ ...contextData, visible: false })
      }
    }
  
    document.addEventListener('contextmenu', contextMenuEventHandler)
    document.addEventListener('click', offClickHandler)
    return () => {
      document.removeEventListener('contextmenu', contextMenuEventHandler)
      document.removeEventListener('click', offClickHandler)
    }
  }, [contextData, props.targetId])
  
  return <div ref={contextRef} className='absolute w-48 list-none rounded-md border border-gray-200 bg-white shadow-lg' style={{ display:`${contextData.visible ? 'block' : 'none'}`, left: contextData.posX, top: contextData.posY }}>
    <div className=''>
      {props.options.map((option) => (
        <li
          key={`notes-list-grid-item-context-menu-${props.note.id}-${option.name}`}
          className='group m-1 flex cursor-pointer items-center rounded-md px-3 py-2 text-sm hover:bg-gray-50'
          onClick={() => {option.onClick()}}>
          <div className='mr-2'>
            {<option.icon className='h-5 w-5 stroke-2 text-gray-400 group-hover:text-gray-500' />}
          </div>
          <p className='text-gray-600 group-hover:text-black'>
            {option.name}
          </p>
        </li>
      ))}
    </div>
  </div>
}

export default NotesListGridItemContextMenu