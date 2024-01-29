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
  const contextRef =  React.useRef<HTMLButtonElement>(null)
  
  React.useEffect(() => {
    const contextMenuEventHandler= (e) => {
      if (e.button === 2) {
        const targetElement = document.getElementById(props.targetId)
        if (targetElement && targetElement.contains(e.target)) {
          e.preventDefault()
          setContextData({ visible: true, posX: e.clientX, posY: e.clientY  - 130})
        } else if(contextRef.current && !contextRef.current.contains(e.target)){
          setContextData({ ...contextData, visible: false })
        }
      }
    }
  
    const offClickHandler= (e) => {
      if(contextRef.current){
        setContextData({ ...contextData, visible: false })
      }
    }
    
    // the event contextmenu is not available on all the browsers
    // on opera, its impossible to prevent the default context menu to appear when there is a right-click
    // so we display our context menu 20px above the default context menu
    document.addEventListener('mousedown', contextMenuEventHandler)
    document.addEventListener('click', offClickHandler)
    return () => {
      document.removeEventListener('mousedown', contextMenuEventHandler)
      document.removeEventListener('click', offClickHandler)
    }
  }, [contextData, props.targetId])
  
  return <button
    ref={contextRef} 
    className='absolute w-48 list-none rounded-md border border-gray-200 bg-white shadow-lg'
    style={{ display:`${contextData.visible ? 'block' : 'none'}`, left: contextData.posX, top: contextData.posY }}>
    <div>
      {props.options.map((option) => (
        <li
          key={`notes-list-grid-item-context-menu-${props.note.id}-${option.name}`}
          className='group m-1 flex cursor-pointer items-center rounded-md px-3 py-2 text-sm hover:bg-gray-50'
          onClick={() => option.onClick()}>
          <div className='mr-2'>
            {<option.icon className='h-5 w-5 stroke-2 text-gray-400 group-hover:text-gray-500' />}
          </div>
          <p className='text-gray-600 group-hover:text-black'>
            {option.name}
          </p>
        </li>
      ))}
    </div>
  </button>
}

export default NotesListGridItemContextMenu