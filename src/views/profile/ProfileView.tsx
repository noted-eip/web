import React from 'react'
import ViewSkeleton from '../../components/view/ViewSkeleton'
import {useGetAccount} from '../../hooks/api/accounts'
import {useAuthContext} from '../../contexts/auth'

const ProfileView: React.FC = () => {
  const authorContext = useAuthContext()
  const getAccountQ = useGetAccount({account_id: authorContext.userID})

  console.log(getAccountQ)
  const profileBody = (
    <div className="col-span-12 md:border-solid md:border-l md:border-black md:border-opacity-25 h-full pb-12 md:col-span-10">
      <div className="px-4 pt-4">
        <form action="#" className="flex flex-col space-y-8">

          <div className="form-item">
            <label className="text-xl ">Nom</label>
            <input type="text" defaultValue={getAccountQ && getAccountQ.data?.data.account.name} className="w-full appearance-none text-black rounded shadow py-1 px-2  mr-2 focus:outline-none focus:shadow-outline focus:border-blue-200" disabled />
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
