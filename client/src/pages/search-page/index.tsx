import PaginateComponent from '@/components/container/paginate-component'
import InputSearch from '@/components/form/input-search'
import MovieCard from '@/components/MovieCard'
import MovieCardSkeleton from '@/components/MovieCardSkeleton'
import MovieFilterGroup from '@/components/MovieFilterGroup'
import useSearchParamsValue from '@/hooks/useSearchParamsValue'
import {
  ophimGetCategoriesApi,
  ophimGetCountriesApi,
  ophimGetListMovieApi,
  ophimGetSearchMovieApi,
} from '@/services/ophim.api'
import { IMovie, OphimListMoveType } from '@/types/ophim.type'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useLocation, useParams } from 'react-router-dom'

const SearchPage = () => {
  const { slug } = useParams()
  const location = useLocation()
  const pathnames = useMemo(
    () => location.pathname.split('/').filter((item) => item !== '') || [],
    [location.pathname],
  )

  const { searchParams, handleSearchParams } = useSearchParamsValue()
  const getDataResult = useQuery({
    queryKey: ['search', slug, searchParams.toString()],
    queryFn: async () => {
      if (slug) {
        // console.log({ slug })
        // console.log(searchParams.toString())

        if (pathnames?.[0] === `danh-muc`) {
          return await ophimGetListMovieApi(
            slug as OphimListMoveType,
            searchParams.toString(),
          )
        }
        if (pathnames?.[0] === `the-loai`) {
          return await ophimGetCategoriesApi(slug, searchParams.toString())
        }
        if (pathnames?.[0] === `quoc-gia`) {
          return await ophimGetCountriesApi(slug, searchParams.toString())
        }
      }

      return await ophimGetSearchMovieApi(searchParams.toString())
    },
  })

  return (
    <div className="space-y-4">
      {/* filter */}
      {![`tim-kiem`, `quoc-gia`, `the-loai`].includes(pathnames?.[0]) && (
        <MovieFilterGroup
          slug={slug as string}
          searchParams={searchParams}
          handleSearchParams={handleSearchParams}
        />
      )}

      {/* content */}
      {[`quoc-gia`, `the-loai`].includes(pathnames?.[0]) && (
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-color-border h-0.5"></div>
          <h2>{getDataResult.data?.data?.seoOnPage?.titleHead}</h2>
          <div className="flex-1 bg-color-border h-0.5"></div>
        </div>
      )}

      {/* content */}
      {[`tim-kiem`].includes(pathnames?.[0]) && (
        <>
          <div className="sm:hidden">
            <InputSearch />
          </div>
          <div className="text-color-text-secondary-1">
            <h4>{getDataResult.data?.data?.seoOnPage?.titleHead}</h4>
            <div>{getDataResult.data?.data?.seoOnPage?.descriptionHead}</div>
          </div>
        </>
      )}

      {/* results */}
      {getDataResult.isLoading && (
        <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array(30)
            .fill(0)
            .map((_, index) => (
              <MovieCardSkeleton key={index} />
            ))}
        </div>
      )}

      {/* no results */}
      {getDataResult.data?.data?.items?.length === 0 && (
        <div>Không tìm thấy kết quả nào.</div>
      )}

      {/* paginate */}
      {!getDataResult.isLoading &&
        getDataResult.data?.data?.items?.length > 0 && (
          <>
            <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {getDataResult.data?.data?.items?.map((item: IMovie) => (
                <MovieCard key={item._id} data={item} />
              ))}
            </div>
            <PaginateComponent
              forcePage={
                Number(
                  getDataResult.data?.data?.params?.pagination?.currentPage,
                ) - 1
              }
              pageCount={Math.ceil(
                getDataResult.data?.data?.params?.pagination?.totalItems /
                  getDataResult.data?.data?.params?.pagination
                    ?.totalItemsPerPage,
              )}
              onPageChange={(e) =>
                handleSearchParams('page', (e.selected + 1).toString())
              }
            />
          </>
        )}
    </div>
  )
}

export default SearchPage
