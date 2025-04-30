import { ophimGetImage } from '@/services/ophim.api'
import { IMovie } from '@/types/ophim.type'
import React, { memo } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const MovieSearchItem = ({ data }: { data: IMovie }) => {
  const navigate = useNavigate()
  return (
    <Link
      to={`/movie/` + data.slug}
      onMouseDown={(e) => {
        e.preventDefault()
        navigate(`/movie/` + data.slug)
      }}
      className="flex gap-2 p-1.5 bg-color-bg-item hover:bg"
    >
      <div className="aspect-video w-8">
        <img
          src={ophimGetImage(data.thumb_url)}
          alt={ophimGetImage(data.thumb_url)}
          loading="lazy"
        />
      </div>
      <div className="flex-1">{data.name}</div>
    </Link>
  )
}

export default memo(MovieSearchItem)
