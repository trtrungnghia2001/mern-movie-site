// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
// import Swiper core and required modules
import { Autoplay } from 'swiper/modules'

import { IMovie } from '@/types/ophim.type'
import React, { memo } from 'react'
import MovieBannerSideItem from './MovieBannerSideItem'

const MovieBannerSide = ({ datas }: { datas: IMovie[] }) => {
  return (
    <article>
      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        slidesPerView={1}
        spaceBetween={20}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
        }}
      >
        {datas?.map((item) => (
          <SwiperSlide key={item?._id}>
            <MovieBannerSideItem data={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </article>
  )
}

export default memo(MovieBannerSide)
