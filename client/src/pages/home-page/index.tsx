import MovieBannerSide from '@/components/MovieBannerSide'
import MovieSide from '@/components/MovieSide'
import { ophimGetListMovieApi } from '@/services/ophim.api'
import { useQuery } from '@tanstack/react-query'

const HomePage = () => {
  const getBannerMovieResult = useQuery({
    queryKey: ['home', 'banner'],
    queryFn: async () =>
      await ophimGetListMovieApi('phim-moi', `sort_field=chieurap`),
  })
  const getNewMovieResult = useQuery({
    queryKey: ['home', 'phim-moi', 'noi-bat'],
    queryFn: async () =>
      await ophimGetListMovieApi('phim-moi', `sort_field=view`),
  })
  const getNewUpdatedTheatricalMoviesResult = useQuery({
    queryKey: ['home', 'phim-chieu-rap', 'cap-nhat'],
    queryFn: async () =>
      await ophimGetListMovieApi('phim-chieu-rap', `sort_field=year`),
  })
  const getNewSeriesMovieResult = useQuery({
    queryKey: ['home', 'phim-bo', 'cap-nhat'],
    queryFn: async () =>
      await ophimGetListMovieApi('phim-bo', `sort_field=year`),
  })
  const getNewUpdatedRetailMoviesResult = useQuery({
    queryKey: ['home', 'phim-le', 'cap-nhat'],
    queryFn: async () =>
      await ophimGetListMovieApi('phim-le', `sort_field=year`),
  })

  return (
    <>
      <div className="space-y-6">
        <MovieBannerSide datas={getBannerMovieResult.data?.data?.items} />
        <MovieSide
          datas={getNewMovieResult.data?.data?.items}
          title="Phim mới nổi bật"
          path={`danh-muc/phim-moi?sort_field=view`}
          isLoading={getNewMovieResult.isLoading}
        />
        <MovieSide
          datas={getNewUpdatedTheatricalMoviesResult.data?.data?.items}
          title="Phim chiếu rạp mới cập nhật"
          path={`danh-muc/phim-chieu-rap?sort_field=year`}
          isLoading={getNewUpdatedTheatricalMoviesResult.isLoading}
        />
        <MovieSide
          datas={getNewSeriesMovieResult.data?.data?.items}
          title="Phim bộ mới cập nhật"
          path={`danh-muc/phim-bo?sort_field=year`}
          isLoading={getNewSeriesMovieResult.isLoading}
        />
        <MovieSide
          datas={getNewUpdatedRetailMoviesResult.data?.data?.items}
          title="Phim lẻ mới cập nhật"
          path={`danh-muc/phim-le?sort_field=year`}
          isLoading={getNewUpdatedRetailMoviesResult.isLoading}
        />
      </div>
    </>
  )
}

export default HomePage
