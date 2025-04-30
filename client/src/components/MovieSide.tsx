// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
// import Swiper core and required modules
import { memo } from 'react'
import { IMovie } from '@/types/ophim.type'
import MovieCard from './MovieCard'
import { Link } from 'react-router-dom'
import MovieCardSkeleton from './MovieCardSkeleton'

const MovieSide = ({
  datas,
  path,
  title,
  isLoading,
}: {
  datas: IMovie[]
  title: string
  path?: string
  isLoading: boolean
}) => {
  return (
    <article className="border-b border-b-color-border pb-6">
      {/* header */}
      <div className="flex items-center justify-between gap-4 py-4">
        <h2 className="pl-3 border-l-[3px] border-l-blue-500 leading-5 flex-1">
          {title}
        </h2>
        <Link
          to={path as string}
          className="text-[10px] px-2 py-1 rounded bg-blue-500 text-white block"
        >
          Xem them
        </Link>
      </div>
      {/* list */}
      <div className="overflow-hidden">
        <div className="grid gap-5 grid-cols-5">
          {isLoading &&
            Array(5)
              .fill(0)
              .map((_, index) => <MovieCardSkeleton key={index} />)}
        </div>
        {!isLoading && datas?.length === 0 && (
          <div className="text-center py-6">Không tìm thấy kết quả nào.</div>
        )}
        {!isLoading && datas?.length > 0 && (
          <Swiper
            slidesPerView={2}
            spaceBetween={20}
            breakpoints={{
              640: {
                slidesPerView: 3,
              },
              768: {
                slidesPerView: 4,
              },
              1024: {
                slidesPerView: 5,
              },
            }}
          >
            {datas?.map((item) => (
              <SwiperSlide key={item?._id}>
                <MovieCard data={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </article>
  )
}

export default memo(MovieSide)
