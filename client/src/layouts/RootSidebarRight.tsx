import MovieBannerSideItem from '@/components/MovieBannerSideItem'
import MovieCard from '@/components/MovieCard'
import MovieCardSkeleton from '@/components/MovieCardSkeleton'
import { yearsData } from '@/constants/option.constant'
import { ophimGetListMovieApi } from '@/services/ophim.api'
import { IMovie } from '@/types/ophim.type'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import React, { memo } from 'react'
import { NavLink } from 'react-router-dom'

const RootSidebarRight = () => {
  const getTopMovieResult = useQuery({
    queryKey: ['home', 'top-rated'],
    queryFn: async () =>
      await ophimGetListMovieApi('phim-moi', `sort_field=tmdb.vote_average`),
  })
  return (
    <section className="h-auto md:max-w-[250px] lg:max-w-[300px] xl:max-w-[360px] w-full p-4 lg:p-7 border-l border-color-border space-y-6">
      {/* top */}
      <article>
        {/* header */}
        <h4 className="text-color-text-secondary-1 pb-4">Năm phát hành</h4>
        <div className="md:max-h-[204px] lg:max-h-[280px] no-scrollbar overflow-y-auto grid gap-2 grid-cols-3 lg:grid-cols-4">
          {yearsData().map((item) => (
            <NavLink
              to={`/danh-muc/phim-moi?year=` + item}
              key={item}
              className={clsx(
                `inline-block px-4 py-1 rounded text-center text-13 bg-color-bg-item text-color-text-secondary-1 hover:text-white hover:bg-blue-500`,
              )}
            >
              {item}
            </NavLink>
          ))}
        </div>
      </article>

      <MovieBannerSideItem
        data={getTopMovieResult.data?.data?.items?.[16]}
        height={160}
      />

      {/* list */}
      <article className="md:max-h-[960px] lg:max-h-[1130px] no-scrollbar overflow-y-auto space-y-3">
        {getTopMovieResult.isLoading &&
          Array(10)
            .fill(0)
            .map((_, index) => (
              <MovieCardSkeleton key={index} layout="vertical" />
            ))}
        {!getTopMovieResult.isLoading &&
          getTopMovieResult.data?.data?.items?.map((item: IMovie) => (
            <MovieCard key={item._id} data={item} layout="horizontal" />
          ))}
      </article>
    </section>
  )
}

export default memo(RootSidebarRight)
