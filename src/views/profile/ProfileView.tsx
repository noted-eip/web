import React from 'react'
import ViewSkeleton from '../../components/view/ViewSkeleton'
import {useGetAccount, useUpdateAccount} from '../../hooks/api/accounts'
import {useAuthContext} from '../../contexts/auth'
import useClickOutside from '../../hooks/click'
import {PencilIcon} from '@heroicons/react/24/solid'

const ProfileView: React.FC = () => {
  const authorContext = useAuthContext()
  const [editName, setEditName] = React.useState(false)
  const [editEmail, setEditEmail] = React.useState(false)
  const [newName, setNewName] = React.useState<string | undefined>(undefined)
  const [newEmail, setNewEmail] = React.useState<string | undefined>(undefined)
  const updateAccountQ = useUpdateAccount()
  const getAccountQ = useGetAccount({account_id: authorContext.userID})
  const newNameInputRef = React.createRef<HTMLInputElement>()
  const newEmailInputRef = React.createRef<HTMLInputElement>()

  useClickOutside(newNameInputRef, () => {
    setEditName(false)
  })

  useClickOutside(newEmailInputRef, () => {
    setEditEmail(false)
  })

  React.useEffect(() => {
    if (newName === undefined || !editName) {
      setNewName(getAccountQ.isSuccess ? getAccountQ.data.data.account.name : '')
    }
    if (newEmail === undefined || !editEmail) {
      setNewEmail(getAccountQ.isSuccess ? getAccountQ.data.data.account.email : '')
    }
  }, [getAccountQ])

  const onChangeName = (e) => {
    e.preventDefault()
    console.log(newName)
    updateAccountQ.mutate({ account: { id: authorContext.userID as string, name: newName }, update_mask: 'name' })
    setEditName(false)
  }

  // const onChangeDescription = (e) => {
  //   e.preventDefault()
  //   updateAccountQ.mutate({ account: { id: authorContext.userID as string, description: newEmail }, update_mask: 'description' })
  //   setEditEmail(false)
  // }
  
  const profileBody = (
    <div className="col-span-12 md:border-solid md:border-l md:border-black md:border-opacity-25 h-full pb-12 md:col-span-10">
      <div className="px-4 pt-4">
        <form action="#" className="flex flex-col space-y-8">

          <div className="form-item">
            <label className="text-xl ">Nom</label>
            <React.Fragment>
              <div className='group flex items-center h-8 cursor-pointer text-black' onClick={() => {
                setEditName(true)
                setEditEmail(false)
              }}>
                {
                  editName ?
                    <form onSubmit={onChangeName}>
                      <input ref={newNameInputRef} autoFocus className='rounded border-gray-200 font-medium -ml-[5px] w-48 px-1 py-0 bg-white' type="text"
                        value={newName} onChange={(e) => setNewName(e.target.value)} />
                      <button type='submit' />
                    </form>
                    :
                    <React.Fragment>
                      <p className='font-medium'>{getAccountQ.data?.data.account.name}</p>
                      <PencilIcon className='hidden group-hover:block h-4 w-4 stroke-2 text-gray-400 ml-2' />
                    </React.Fragment>

                }
              </div>
            </React.Fragment>
            {/*<input type="text" defaultValue={getAccountQ && getAccountQ.data?.data.account.name} className="w-full appearance-none text-black rounded shadow py-1 px-2  mr-2 focus:outline-none focus:shadow-outline focus:border-blue-200" disabled />*/}
          </div>

          <div className="form-item">
            <label className="text-xl ">Email</label>
            <input type="text" defaultValue={getAccountQ && getAccountQ.data?.data.account.email} className="w-full appearance-none text-black rounded shadow py-1 px-2  mr-2 focus:outline-none focus:shadow-outline focus:border-blue-200" disabled />
          </div>


          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4">

            <div className="form-item w-full">
              <label className="text-xl ">Mot de passe</label>
              <input type="text" className="w-full appearance-none text-black  rounded shadow py-1 px-2 mr-2 focus:outline-none focus:shadow-outline focus:border-blue-200  " />
            </div>

            <div className="form-item w-full">
              <label className="text-xl ">Réinitialiser mot de passe</label>
              <input type="text" className="w-full appearance-none text-black  rounded shadow py-1 px-2 mr-2 focus:outline-none focus:shadow-outline focus:border-blue-200  " />
            </div>
          </div>

        </form>
      </div>
    </div>)

  // TODO: add a save button
  return <ViewSkeleton title='Profile' panels={['group-chat','group-activity']}>
    <div className='border-2 border-dashed border-gray-300 mb-lg xl:mb-xl h-[1024px] mx-lg xl:mx-xl w-full flex items-center justify-center text-gray-400'>{profileBody}</div>
  </ViewSkeleton>
}

export default ProfileView
