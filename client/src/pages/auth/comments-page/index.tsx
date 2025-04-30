import LoaderComponent from '@/components/container/loader-component'
import PaginateComponent from '@/components/container/paginate-component'
import ENV_CONFIG from '@/configs/env.config'
import CommentCard from '@/features/comment/components/CommentCard'
import { useCommentStore } from '@/features/comment/stores/comment.store'
import useSearchParamsValue from '@/hooks/useSearchParamsValue'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

const CommentsPage = () => {
  const { searchParams, handleSearchParams } = useSearchParamsValue({
    data_type: ENV_CONFIG.DATA_TYPE,
  })
  const { getCommentsByUser, comments } = useCommentStore()
  const getCommentsByUserResult = useQuery({
    queryKey: ['comments', 'user', searchParams.toString()],
    queryFn: async () => {
      return await getCommentsByUser(searchParams.toString())
    },
  })
  return (
    <>
      {getCommentsByUserResult.isLoading && <LoaderComponent />}
      <div className="space-y-4">
        {comments?.map((item) => (
          <CommentCard key={item._id} data={item} isAuth />
        ))}
        {comments.length === 0 && <div>Không tìm thấy kết quả nào.</div>}
        {!getCommentsByUserResult.isLoading &&
          getCommentsByUserResult.data &&
          comments?.length > 0 && (
            <PaginateComponent
              forcePage={
                Number(getCommentsByUserResult?.data?.data?.pagination?._page) -
                1
              }
              pageCount={
                getCommentsByUserResult?.data?.data?.pagination?.total_pages
              }
              onPageChange={(page) =>
                handleSearchParams('_page', (page.selected + 1).toString())
              }
            />
          )}
      </div>
    </>
  )
}

export default CommentsPage
