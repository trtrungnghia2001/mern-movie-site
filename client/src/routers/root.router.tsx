import HomePage from '@/pages/home-page'
import MovideIdPage from '@/pages/movie-id-page'
import SearchPage from '@/pages/search-page'
import React, { memo } from 'react'
import { useRoutes } from 'react-router-dom'

const RootRouter = () => {
  const router = useRoutes([
    {
      index: true,
      element: <HomePage />,
    },
    {
      path: 'danh-muc',
      element: <SearchPage />,
    },
    {
      path: 'danh-muc/:slug',
      element: <SearchPage />,
    },
    {
      path: 'the-loai/:slug',
      element: <SearchPage />,
    },
    {
      path: 'quoc-gia/:slug',
      element: <SearchPage />,
    },
    {
      path: 'tim-kiem',
      element: <SearchPage />,
    },
    {
      path: 'movie/:slug',
      element: <MovideIdPage />,
    },
  ])
  return router
}

export default memo(RootRouter)
