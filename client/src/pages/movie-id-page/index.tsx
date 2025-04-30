import { IMAGE_DEFAULT } from '@/constants/image.constant'
import { ophimGetImage, ophimGetMovieDetailApi } from '@/services/ophim.api'
import { IMovieDetail } from '@/types/ophim.type'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Rate } from 'antd'
import useSearchParamsValue from '@/hooks/useSearchParamsValue'
import MovieButtonShares from '@/components/MovieButtonShares'
import { useAuthStore } from '@/features/authentication/stores/auth.store'
import { useHistoryStore } from '@/features/history/stores/history.store'
import ENV_CONFIG from '@/configs/env.config'
import LoaderComponent from '@/components/container/loader-component'
import ButtonFavorite from '@/features/favorite/components/ButtonFavorite'
import axiosInstance from '@/configs/axios.config'
import { IAxiosResponseSuccess } from '@/types/response.type'
import { IComicMovieInfo } from '@/types/api.type'
import ButtonLike from '@/features/like/components/ButtonLike'
import MoviePlay from '@/components/MoviePlay'
import CommentContainer from '@/features/comment/components/CommentContainer'

const MovideIdPage = () => {
  const { slug } = useParams()
  const { searchParams, handleSearchParams } = useSearchParamsValue({
    server: `0`,
    episode: `0`,
  })

  const getMovieBySlugResult = useQuery({
    queryKey: ['movie', slug],
    queryFn: async () => await ophimGetMovieDetailApi(slug as string),
    enabled: !!slug,
  })
  const movieData = useMemo(() => {
    return getMovieBySlugResult.data?.data?.item as IMovieDetail
  }, [getMovieBySlugResult.data])

  const server = useMemo(
    () => searchParams.get('server') || '0',
    [searchParams, slug],
  )
  const episode = useMemo(
    () => searchParams.get('episode') || '0',
    [searchParams, slug],
  )

  const { isLoggedIn } = useAuthStore()
  const { addHistory } = useHistoryStore()
  const addHistoryResult = useQuery({
    queryKey: ['history', 'add', slug],
    queryFn: async () => {
      return await addHistory({
        data_id: slug as string,
        data_type: ENV_CONFIG.DATA_TYPE,
        episode: episode,
      })
    },
    enabled: !!(isLoggedIn && slug && episode),
  })
  const comicMovieInfoResult = useQuery({
    queryKey: ['comic', 'movie', slug],
    queryFn: async () => {
      const url = `comic-movie-info/` + slug + '/' + ENV_CONFIG.DATA_TYPE
      const response = await axiosInstance.get<
        IAxiosResponseSuccess<IComicMovieInfo>
      >(url)
      return response.data
    },
    enabled: !!slug,
  })

  if (!movieData) return <></>

  return (
    <>
      {addHistoryResult.isLoading && comicMovieInfoResult.isLoading && (
        <LoaderComponent />
      )}
      <div className="space-y-10 mb-16">
        {movieData?.episodes?.[Number(server)]?.server_data?.[Number(episode)]
          ?.link_embed && (
          <MoviePlay
            movieData={movieData}
            handleSearchParams={handleSearchParams}
            episode={episode}
            server={server}
          />
        )}

        {/* detail */}
        <article className="flex flex-col sm:flex-row items-start gap-5">
          {/* thumbnail */}
          <div className="w-full aspect-video sm:w-44 sm:aspect-thumbnail-1 overflow-hidden">
            <img
              src={ophimGetImage(movieData?.thumb_url)}
              alt={ophimGetImage(movieData?.thumb_url)}
              loading="lazy"
            />
          </div>
          {/* info */}
          <div className="flex-1 space-y-2 text-13">
            <h2>{movieData?.name}</h2>
            <div className="text-color-text-secondary-1 space-x-2">
              <span>{movieData?.origin_name}</span>
              <span>{movieData?.year}</span>
            </div>
            <div className="text-color-text-secondary-1 space-x-2">
              <span>
                {movieData?.created?.time &&
                  new Date(movieData?.created?.time).toDateString()}
              </span>
              <span>{movieData?.time}</span>
              <span>{movieData?.lang}</span>
              {movieData?.country?.map((item) => (
                <Link
                  className="hover:text-blue-500"
                  key={item?.slug}
                  to={`/quoc-gia/` + item?.slug}
                >
                  {item?.name}
                </Link>
              ))}
            </div>
            <div className="border-y border-color-border py-2 flex items-center gap-4">
              <span className="inline-block p-2 px-3.5 text-xl rounded bg-[rgb(41,41,41)]">
                {movieData?.tmdb?.vote_average?.toFixed(1)}
              </span>
              <div className="space-y-0.5">
                <Rate
                  className="text-sm text-blue-500"
                  disabled
                  value={
                    movieData?.tmdb?.vote_average &&
                    Math.floor(movieData?.tmdb?.vote_average)
                  }
                  count={10}
                />
                <div className="text-10">
                  {movieData?.tmdb?.vote_count} đánh giá
                </div>
              </div>
            </div>
            <div className="border-b border-color-border pb-2 flex flex-wrap gap-2">
              {movieData?.category?.map((item) => (
                <Link
                  key={item.slug}
                  to={`/the-loai/` + item?.slug}
                  className="hover:text-blue-500"
                >
                  {item?.name}
                </Link>
              ))}
            </div>
            {/* actions */}
            <div className="flex flex-wrap gap-2 text-xs">
              <ButtonFavorite
                isFavorite={
                  comicMovieInfoResult.data?.data?.isFavorite as boolean
                }
                data={{
                  data_id: slug as string,
                  data_type: ENV_CONFIG.DATA_TYPE,
                }}
              />
              <ButtonLike
                isLike={comicMovieInfoResult.data?.data?.isLike as boolean}
                data={{
                  data_id: slug as string,
                  data_type: ENV_CONFIG.DATA_TYPE,
                }}
              />
            </div>
          </div>
        </article>

        {/* content */}
        <article className="space-y-6">
          <h2 className="pl-3 border-l-[3px] border-l-blue-500 leading-5">
            Tóm tắt
          </h2>
          <div
            className="text-color-text-secondary-1"
            dangerouslySetInnerHTML={{ __html: movieData?.content }}
          ></div>
          <iframe
            src={
              `https://www.youtube.com/embed/` +
              movieData?.trailer_url?.split('=')?.[1]
            }
            title={movieData?.name}
            className="aspect-video w-full"
            loading="lazy"
            allowFullScreen
            frameBorder="0"
            allow="autoplay=0; encrypted-media"
          ></iframe>
        </article>

        {/* share */}
        <MovieButtonShares />

        {/* director */}
        <article className="space-y-6">
          <h2 className="pl-3 border-l-[3px] border-l-blue-500 leading-5">
            Đạo diễn
          </h2>
          <ul className="grid gap-4 grid-cols-2 sm:grid-cols-3">
            {movieData?.director?.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <div className="w-14 aspect-square">
                  <img
                    src={IMAGE_DEFAULT.avatar_notfound_image}
                    loading="lazy"
                    alt=""
                  />
                </div>
                <h4 className="flex-1 line-clamp-1">{item}</h4>
              </li>
            ))}
          </ul>
        </article>

        {/* actor */}
        <article className="space-y-6">
          <h2 className="pl-3 border-l-[3px] border-l-blue-500 leading-5">
            Diễn viên
          </h2>
          <ul className="grid gap-4 grid-cols-2 sm:grid-cols-3">
            {movieData?.actor?.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <div className="w-14 aspect-square">
                  <img
                    src={IMAGE_DEFAULT.avatar_notfound_image}
                    loading="lazy"
                    alt=""
                  />
                </div>
                <h4 className="flex-1 line-clamp-1">{item}</h4>
              </li>
            ))}
          </ul>
        </article>
      </div>
      {/* comment */}
      <CommentContainer
        data_id={slug as string}
        data_type={ENV_CONFIG.DATA_TYPE}
      />
    </>
  )
}

export default MovideIdPage
