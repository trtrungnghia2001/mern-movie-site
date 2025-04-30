import { IMovieDetail } from '@/types/ophim.type'
import clsx from 'clsx'
import React, { memo } from 'react'

const MoviePlay = ({
  episode,
  handleSearchParams,
  movieData,
  server,
}: {
  movieData: IMovieDetail
  server: string
  episode: string
  handleSearchParams: (key: string, value: string) => void
}) => {
  return (
    <>
      {/* video */}
      <article>
        <iframe
          src={
            movieData?.episodes?.[Number(server)]?.server_data?.[
              Number(episode)
            ]?.link_embed
          }
          title={movieData?.name}
          className="aspect-video w-full"
          loading="lazy"
          allowFullScreen
          frameBorder="0"
          allow="autoplay=0; encrypted-media"
        ></iframe>
      </article>

      {/* episode */}
      <article className="space-y-6">
        <h2 className="pl-3 border-l-[3px] border-l-blue-500 leading-5">
          Chọn tập phim
        </h2>
        <ul className="flex flex-wrap gap-2">
          {movieData?.episodes?.[Number(server)]?.server_data?.map(
            (item, index) => (
              <button
                key={index}
                onClick={() =>
                  handleSearchParams('episode', index as unknown as string)
                }
                className={clsx(
                  `bg-[rgb(102,102,102)] hover:bg-blue-500 text-13 text-white inline-block px-3 py-1 rounded-sm`,
                  Number(episode) === index && `bg-blue-500`,
                )}
              >
                Tập {item?.name}
              </button>
            ),
          )}
        </ul>
      </article>

      {/* server */}
      <article className="space-y-6">
        <h2 className="pl-3 border-l-[3px] border-l-blue-500 leading-5">
          Chọn server
        </h2>
        <ul className="flex flex-wrap gap-2">
          {movieData?.episodes?.map((item, index) => (
            <button
              key={index}
              onClick={() =>
                handleSearchParams('server', index as unknown as string)
              }
              className={clsx(
                `bg-[rgb(102,102,102)] hover:bg-blue-500 text-13 text-white inline-block px-3 py-1 rounded-sm`,
                Number(server) === index && `bg-blue-500`,
              )}
            >
              {item?.server_name}
            </button>
          ))}
        </ul>
      </article>
    </>
  )
}

export default memo(MoviePlay)
