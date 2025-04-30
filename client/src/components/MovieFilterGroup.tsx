import {
  ophimOptionLists,
  ophimOptionSorts,
  yearsData,
} from '@/constants/option.constant'
import {
  ophimGetCategoriesApi,
  ophimGetCountriesApi,
} from '@/services/ophim.api'
import { useQuery } from '@tanstack/react-query'
import React, { memo, useMemo } from 'react'
import { BiSolidCategory } from 'react-icons/bi'
import { FaCalendarAlt, FaSort } from 'react-icons/fa'
import { FaEarthAfrica } from 'react-icons/fa6'
import { MdMovie } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

interface IFilterSubItem {
  name: string
  slug: string | number
}
interface IFilterItem {
  icon: React.ReactNode
  title: string
  subItems: IFilterSubItem[]
  filterName: string
  type: 'query' | 'slug'
}

const MovieFilterGroup = ({
  slug,
  searchParams,
  handleSearchParams,
}: {
  slug: string
  searchParams: URLSearchParams
  handleSearchParams: (name: string, value: string) => void
}) => {
  const navigate = useNavigate()

  const getOphimGetCategoriesApiResult = useQuery({
    queryKey: ['categories'],
    queryFn: async () => await ophimGetCategoriesApi(),
  })
  const getOphimGetCountriesApiResult = useQuery({
    queryKey: ['countries'],
    queryFn: async () => await ophimGetCountriesApi(),
  })

  const filterData = useMemo(() => {
    if (
      getOphimGetCategoriesApiResult.data?.data?.items &&
      getOphimGetCountriesApiResult.data?.data?.items
    ) {
      const years = yearsData()?.map((item) => ({
        name: item,
        slug: item,
      }))
      const categories = getOphimGetCategoriesApiResult.data?.data?.items
      const countries = getOphimGetCountriesApiResult.data?.data?.items

      const data: IFilterItem[] = [
        {
          icon: <BiSolidCategory />,
          title: 'Danh mục',
          subItems: [...ophimOptionLists],
          filterName: 'slug',
          type: 'slug',
        },
        {
          icon: <MdMovie />,
          title: 'Thể loại',
          subItems: [
            {
              name: 'Tất cả',
              slug: '',
            },
            ...categories,
          ],
          filterName: 'category',
          type: 'query',
        },
        {
          icon: <FaEarthAfrica />,
          title: 'Quốc gia',
          subItems: [
            {
              name: 'Tất cả',
              slug: '',
            },
            ...countries,
          ],
          filterName: 'country',
          type: 'query',
        },
        {
          icon: <FaCalendarAlt />,
          title: 'Năm',
          subItems: [
            {
              name: 'Tất cả',
              slug: '',
            },
            ...years,
          ],
          filterName: 'year',
          type: 'query',
        },
        {
          icon: <FaSort />,
          title: 'Sắp xếp',
          subItems: [
            {
              name: 'Tất cả',
              slug: '',
            },
            ...ophimOptionSorts,
          ],
          filterName: 'sort_field',
          type: 'query',
        },
      ]

      return data
    }
  }, [getOphimGetCategoriesApiResult.data, getOphimGetCountriesApiResult.data])

  return (
    <article className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {filterData?.map((item) => (
        <div key={item?.title}>
          <div className="flex items-center gap-2 text-color-text-secondary-1">
            <span className="text-base">{item.icon}</span>
            <span className="text-13">{item.title}</span>
          </div>
          <select
            name={item?.title}
            id={item?.title}
            value={
              (item.type === 'slug'
                ? slug
                : searchParams.get(item.filterName as string)) || ''
            }
            onChange={(e) => {
              handleSearchParams(`page`, `1`)
              if (item.type === 'query') {
                handleSearchParams(item.filterName as string, e.target.value)
                navigate({
                  pathname: `/danh-muc/` + slug,
                  search: searchParams.toString(),
                })
                return
              }
              if (item.type === 'slug') {
                navigate({
                  pathname: `/danh-muc/` + e.target.value,
                  search: searchParams.toString(),
                })
                return
              }
            }}
            className="mt-2 w-full rounded bg-[rgb(34,34,34)] text-color-text-secondary-2 px-3 py-1.5 text-13"
          >
            {item.subItems.map((item: IFilterSubItem) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      ))}
    </article>
  )
}

export default memo(MovieFilterGroup)
