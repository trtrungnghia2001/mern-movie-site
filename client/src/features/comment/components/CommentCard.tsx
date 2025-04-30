import React, { memo, useEffect, useState } from 'react'
import { AiFillLike } from 'react-icons/ai'
import { IComment } from '../types/comment.type'
import { IMAGE_DEFAULT } from '@/constants/image.constant'
import { useCommentStore } from '../stores/comment.store'
import { useAuthStore } from '@/features/authentication/stores/auth.store'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import LoaderComponent from '@/components/container/loader-component'
import { Link } from 'react-router-dom'
import { queryClient } from '@/main'
import { IAxiosResponseSuccess } from '@/types/response.type'
import { IResponseList } from '@/types/list.type'

const CommentCard = ({
  data,
  isAuth,
}: {
  data: IComment
  isAuth?: boolean
}) => {
  const { likeComment, deleteComment } = useCommentStore()

  // delete
  const deleteCommentResult = useMutation({
    mutationFn: async () => {
      return await deleteComment(data)
    },
    onSuccess: (data) => {
      toast.success(data.message)

      queryClient.setQueryData(
        [
          `comments`,
          data.data.data_id,
          `data_id=${data.data.data_id}&data_type=${data.data.data_type}`,
        ],
        (oldData: {
          pages: IAxiosResponseSuccess<IResponseList<IComment>>[]
          pageParams: number[]
        }) => {
          const newData =
            oldData?.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                results: page.data.results.filter(
                  (item) => item?._id !== data?.data?._id,
                ),
              },
            })) ?? []

          return {
            pages: newData,
            pageParams: oldData?.pageParams ?? [],
          }
        },
      )
    },
    onError: (error) => {
      console.log({ error })

      toast.error(error.message)
    },
  })

  // like
  const [is_like, setIs_like] = useState(false)
  const [total_like, setTotal_like] = useState(0)
  const { user } = useAuthStore()
  useEffect(() => {
    setIs_like(() =>
      data?.likes?.includes(user?._id as string) ? true : false,
    )
    setTotal_like(data?.likes?.length)
  }, [data.likes])
  const likeCommentResult = useMutation({
    mutationFn: async () => {
      return await likeComment(data)
    },
    onSuccess: (data) => {
      toast.success(data.message)
      setIs_like(!is_like)
      setTotal_like(is_like ? total_like - 1 : total_like + 1)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <>
      {likeCommentResult.isPending && deleteCommentResult.isPending && (
        <LoaderComponent />
      )}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full overflow-hidden border">
          <img
            src={data?.user?.avatar || IMAGE_DEFAULT.avatar_notfound_image}
            loading="lazy"
            alt=""
          />
        </div>
        <div className="flex-1">
          <div>
            <h5 className="text-blue-500 mb-1">{data?.user?.name}</h5>
            {isAuth && (
              <>
                <span className="text-13">
                  {data?.parent_comment ? `reply` : `comment`} on the{' '}
                </span>
                <Link
                  to={`/movie/${data?.data_id}`}
                  className="text-blue-500 hover:underline text-13"
                >
                  {data?.data_id}
                </Link>
              </>
            )}
          </div>
          {/* message */}
          <div
            className="whitespace-pre mb-1"
            dangerouslySetInnerHTML={{ __html: data?.message }}
          ></div>
          {/* action */}
          <div className="text-xs text-color-text-secondary-1 flex items-center flex-wrap gap-2 mb-1">
            <button onClick={() => likeCommentResult.mutate()}>
              {is_like ? `Unlike` : `Like`}
            </button>
            {user?._id === data?.user?._id && (
              <>
                <button onClick={() => deleteCommentResult.mutate()}>
                  Delete
                </button>
              </>
            )}
            <div className="flex items-center">
              <AiFillLike />
              <span>{total_like}</span>
            </div>
            <span className="w-0.5 h-0.5 rounded-full bg-gray-500"></span>
            <span className="text-gray-500">
              {data?.createdAt &&
                Intl.DateTimeFormat('vn-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }).format(new Date(data?.createdAt))}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(CommentCard)
