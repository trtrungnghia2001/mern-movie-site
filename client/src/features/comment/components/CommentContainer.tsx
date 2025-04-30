import React, { memo, useMemo } from 'react'
import CommentForm from './CommentForm'
import { useCommentStore } from '../stores/comment.store'
import { useInfiniteQuery } from '@tanstack/react-query'
import useSearchParamsValue from '@/hooks/useSearchParamsValue'
import CommentCard from './CommentCard'
import ENV_CONFIG from '@/configs/env.config'
import axiosInstance from '@/configs/axios.config'
import { IComment } from '../types/comment.type'
import { IResponseList } from '@/types/list.type'
import { IAxiosResponseSuccess } from '@/types/response.type'

const CommentContainer = ({
  data_id,
  data_type,
}: {
  data_id: string
  data_type: string
}) => {
  const { searchParams } = useSearchParamsValue({
    data_id,
    data_type: ENV_CONFIG.DATA_TYPE,
  })

  const { comments } = useCommentStore()

  const getCommentsResult = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ['comments', data_id, searchParams.toString()],
    queryFn: async ({ pageParam }) => {
      const url = `comment/get-comments?_page=${pageParam}&_skip=${
        commentsData.length
      }&${searchParams.toString()}`

      const response = (
        await axiosInstance.get<IAxiosResponseSuccess<IResponseList<IComment>>>(
          url,
        )
      ).data

      return response
    },
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (
        lastPage.data.pagination._page > lastPageParam ||
        lastPage.data.pagination.total_pages === 1 ||
        lastPage.data.results.length < lastPage.data.pagination._limit
      ) {
        return null
      }

      return lastPageParam + 1
    },
  })

  const commentFetch = useMemo(() => {
    return getCommentsResult.data?.pages.flatMap((item) => item?.data?.results)
  }, [getCommentsResult.data])

  const commentsData = useMemo(() => {
    return comments?.filter((comment) => comment?.data_id === data_id) || []
  }, [comments, data_id])

  const total_comments = useMemo(() => {
    const total_rows =
      getCommentsResult.data?.pages?.[0]?.data.pagination.total_rows || 0

    return total_rows + commentsData.length
  }, [getCommentsResult.data, commentsData])

  return (
    <>
      {/* {getCommentsResult.isLoading && getRepliesResult.isLoading && (
        <LoaderComponent />
      )} */}
      <div className="space-y-4">
        <h4 className="pl-3 border-l-[3px] border-l-blue-500 leading-5">
          Bình luận ({total_comments})
        </h4>
        <CommentForm data_id={data_id} data_type={data_type} />
        {commentFetch?.map((item) => (
          <CommentCard key={item?._id} data={item} />
        ))}
        {getCommentsResult.isFetchingNextPage && <p>Loading...</p>}

        {!getCommentsResult.isFetchingNextPage &&
          getCommentsResult.hasNextPage && (
            <button onClick={() => getCommentsResult.fetchNextPage()}>
              View more
            </button>
          )}
      </div>
    </>
  )
}

export default memo(CommentContainer)
