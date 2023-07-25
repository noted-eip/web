import React, { FunctionComponent } from 'react'
import ReactDOM from 'react-dom'

export interface ModalProps {
  isShown: boolean;
  hide: () => void;
  headerText: string;
}

// TODO: what is the good type ?
const Modals: FunctionComponent<ModalProps> = ({
  isShown,
  hide,
  headerText,
}) => {
  const modal = (
    <div data-tabindex='-1' aria-hidden='false' className='fixed  z-50 w-full overflow-x-hidden overflow-y-hidden md:inset-0 h-[calc(100%-1rem)] max-h-full'>
      <div className='mx-auto my-[10%] relative w-full max-w-2xl max-h-full'>
        <div className='relative bg-white rounded-lg shadow dark:bg-gray-700'>
          <div className='flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600'>
            <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
              {headerText}
            </h3>
            <button type='button' className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white' onClick={hide}>
              <svg aria-hidden='true' className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'><path fillRule='evenodd' d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd'></path></svg>
              <span className='sr-only'>Close modal</span>
            </button>
          </div>
          <div className='p-6 space-y-6'>
            <p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>
              Les présentes CGU ou Conditions Générales d’Utilisation encadrent juridiquement l’utilisation des services du site noted.
            </p>
            <p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>
              Constituant le contrat entre la société Noted, l’Utilisateur, l’accès au site doit être précédé de l’acceptation de ces CGU. L’accès à cette plateforme signifie l’acceptation des présentes CGU.
            </p>
            <p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>
              Pour la création du compte de l’Utilisateur, la collecte des informations au moment de l’inscription sur le site est nécessaire et obligatoire. Conformément à la loi n°78-17 du 6 janvier relative à l’informatique, aux fichiers et aux libertés, la collecte et le traitement d’informations personnelles s’effectuent dans le respect de la vie privée.
            </p>
            <p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>
              Les marques, logos ainsi que les contenus du site noted (illustrations graphiques, textes…) sont protégés par le Code de la propriété intellectuelle et par le droit d’auteur.
            </p>
            <p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>
              Noted dispose du droit d’exercer une modération à priori sur les publications et peut refuser leur mise en ligne sans avoir à fournir de justification.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return isShown ? ReactDOM.createPortal(modal, document.body) : null
}



export default Modals