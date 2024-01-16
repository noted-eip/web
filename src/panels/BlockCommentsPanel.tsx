import { Delete } from '@mui/icons-material'
import {  TextField } from '@mui/material'
import Lottie from 'lottie-react'
import React from 'react'
import toast from 'react-hot-toast'

import processAnim from '../assets/animations/process.json'
import PanelSkeleton from '../components/view/PanelSkeleton'
import { TAuthContext, useAuthContext } from '../contexts/auth'
import {useBlockContext} from '../contexts/block'
import { useGetAccount } from '../hooks/api/accounts'
import { useCreateBlockCommentInCurrentGroupNote, useDeleteBlockCommentInCurrentGroupNote, useListBlockCommentsRequest } from '../hooks/api/blocks'
import { useGroupIdFromUrl, useNoteIdFromUrl} from '../hooks/url'
import { FormatMessage, useOurIntl } from '../i18n/TextComponent'
import { BlockComment} from '../protorepo/openapi/typescript-axios'


type MessageContext = {
  noteId: string,
  blockId: string
}
const Message: React.FC<{ comment: BlockComment, ctx: MessageContext, authContext: TAuthContext, refresh: () => void }> = (props) => {
  const comment = props.comment
  const context = props.ctx
  const authContext = props.authContext
  const author = useGetAccount({ accountId: comment.authorId as string })
  const deleteCommentQ = useDeleteBlockCommentInCurrentGroupNote(
    {
      onSuccess: () => {
        toast.success('Comment deleted')
      },
      onError: (e) => {
        toast.error(e.response?.data.error as string)
      }
    }
  )

  
  return (
    <div key={comment.id} className='rounded-md border border-blue-100 bg-gray-50 bg-gradient-to-br p-4 hover:bg-gray-100 hover:shadow-inner'>
      <div className='flex flex-col'>
        <div className='flex justify-between'>
          <p className='font-bold'>{author.data?.account.name}</p>
          {
            author.data?.account.id === authContext.accountId && 
            <Delete 
              className='flex cursor-pointer justify-end'
              onClick={() => 
              { 
                deleteCommentQ.mutate({noteId: context.noteId, blockId: context.blockId as string, commentId: comment.id as string })
                props.refresh()
              }              
              }/>
          }
        </div>

        <p className='font-normal'>{comment.content}</p>
      </div>
    </div>
  )
}

const ListMessages: React.FC = () => {
  const groupId = useGroupIdFromUrl()
  const noteId = useNoteIdFromUrl()
  const blockContext = useBlockContext()
  const authContext = useAuthContext()
  const createBlockCommentM = useCreateBlockCommentInCurrentGroupNote()
  const listBlockCommentM = useListBlockCommentsRequest({ groupId: groupId, noteId: noteId, blockId: blockContext.blockId as string })
  const { formatMessage } = useOurIntl()

  if (noteId == null) {
    return (
      <div className='my-4 text-center text-sm text-gray-400'>
        <p>{'Your current note haven\'t been found'}</p>
      </div>)
  }

  if (blockContext.blockId === null) {
    return  (<div className='flex h-screen items-center justify-center'>
      <FormatMessage id='PANEL.comments.noblock' />
    </div>)
  }

  const list = listBlockCommentM.data?.comments
  const refreshList = () => {listBlockCommentM.refetch()}

  if (listBlockCommentM.isLoading) {
    return  (<div className='h-screen text-center'>
      <FormatMessage id='PANEL.comments.loading' />
      <Lottie
        animationData={processAnim}
        loop
        autoplay
        className='h-full w-full'
      />
    </div>)

  }

  return(
    <div className='h-full overflow-y-scroll lg:px-lg lg:pb-lg xl:px-xl xl:pb-xl'>
      <div className='space-y-2'>
        {
          list?.map((comment) => 
            <Message 
              key={comment.id} 
              authContext={authContext} 
              comment={comment}
              ctx={{noteId: noteId, blockId: blockContext.blockId as string}}
              refresh={refreshList}
            />
          )
        }
      </div>
      <TextField 
        id='outlined-basic' 
        label={formatMessage({ id: 'PANEL.comments.comment' })}
        variant='filled' 
        className='w-full py-10' 
        inputProps={{
          onKeyDown: (e:React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            if (e.key === 'Enter') {
              createBlockCommentM.mutate({noteId: noteId, blockId: blockContext.blockId as string, content: e.currentTarget.value})
              refreshList()
            }
          },
        }}/>
    </div>
  )
}

const BlockCommentsPanel: React.FC = () => {  
  return (
    <PanelSkeleton>
      <ListMessages />
    </PanelSkeleton>
  )
}

export default BlockCommentsPanel
