import MovieSearchItem from '@/features/authentication/components/MovieSearchItem'
import { ophimGetSearchMovieApi } from '@/services/ophim.api'
import { IMovie } from '@/types/ophim.type'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import React, { useState } from 'react'
import { IoSearch } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useDebounce } from 'use-debounce'

const InputSearch = () => {
  const [text, setText] = useState('')
  const [debounce] = useDebounce(text, 1000)
  const searchResult = useQuery({
    queryKey: ['search', debounce],
    queryFn: async () => await ophimGetSearchMovieApi(`keyword=` + debounce),
    enabled: !!debounce,
  })

  const [show, setShow] = useState(false)
  const navigate = useNavigate()
  return (
    <div className={clsx(['relative w-full text-xs'])}>
      <div className="border border-color-border rounded-full flex items-center gap-2 pl-4 text-13">
        <IoSearch />
        <input
          onFocus={() => setShow(true)}
          onBlur={() => setShow(false)}
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            if (!show) {
              setShow(true)
            }
          }}
          onClick={() => {
            if (!show) {
              setShow(true)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && text) {
              navigate(`/tim-kiem?keyword=${text}`)
              setShow(false)
            }
          }}
          type="text"
          className="bg-transparent border-none outline-none py-1.5 w-full"
          placeholder="Find movie..."
        />
      </div>
      {show && (
        <ul className="mt-0.5 z-20 no-scrollbar absolute top-full left-0 right-0 bg-color-bg-container rounded shadow max-h-60 overflow-y-auto">
          {searchResult.data?.data?.items?.map((item: IMovie) => (
            <li key={item?.slug}>
              <MovieSearchItem data={item} />
            </li>
          ))}
          {searchResult.isLoading && (
            <li className="flex gap-2 p-1.5">Loading...</li>
          )}
          {!searchResult.isLoading &&
            searchResult.data?.data?.items?.length === 0 && (
              <li className="flex gap-2 p-1.5">Not found results</li>
            )}
        </ul>
      )}
    </div>
  )
}

export default InputSearch
