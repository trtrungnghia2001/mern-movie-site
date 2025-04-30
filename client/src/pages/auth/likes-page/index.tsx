import LoaderComponent from '@/components/container/loader-component'
import PaginateComponent from '@/components/container/paginate-component'
import MovieCard from '@/components/MovieCard'
import ENV_CONFIG from '@/configs/env.config'
import { useLikeStore } from '@/features/like/stores/like.store'
import useSearchParamsValue from '@/hooks/useSearchParamsValue'
import { ophimGetMovieDetailApi } from '@/services/ophim.api'
import { IMovie, IMovieDetail } from '@/types/ophim.type'
import { useQuery } from '@tanstack/react-query'

const LikesPage = () => {
  const { searchParams, handleSearchParams } = useSearchParamsValue({
    data_type: ENV_CONFIG.DATA_TYPE,
  })
  const { getLikes } = useLikeStore()

  const dataResult = useQuery({
    queryKey: ['like', searchParams.toString()],
    queryFn: async () => {
      const data = await getLikes(searchParams.toString())
      const comics = await Promise.all(
        data?.data?.results?.map(async (like) => {
          const response = await ophimGetMovieDetailApi(like.data_id)
          const item: IMovieDetail = response?.data?.item
          return item
        }),
      )
      return {
        comics,
        data,
      }
    },
  })

  return (
    <>
      {dataResult.isLoading && <LoaderComponent />}
      <div className="space-y-8">
        {dataResult?.data && dataResult?.data?.comics?.length > 0 && (
          <div className="grid gap-4 gap-y-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {dataResult?.data?.comics?.map((item) => {
              return (
                <MovieCard key={item?.slug} data={item as unknown as IMovie} />
              )
            })}
          </div>
        )}
        {dataResult.data?.comics?.length === 0 && (
          <div>Không tìm thấy kết quả nào.</div>
        )}
        {!dataResult.isLoading && dataResult.data && (
          <PaginateComponent
            forcePage={
              Number(dataResult?.data?.data?.data.pagination._page) - 1
            }
            pageCount={dataResult?.data?.data?.data.pagination.total_pages}
            onPageChange={(page) =>
              handleSearchParams('_page', (page.selected + 1).toString())
            }
          />
        )}
      </div>
    </>
  )
}

export default LikesPage
