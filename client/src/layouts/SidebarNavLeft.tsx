import AccordionComponent from '@/components/form/accordion-component'
import { IMAGE_DEFAULT } from '@/constants/image.constant'
import { ophimHeaderLinks } from '@/constants/option.constant'
import {
  ophimGetCategoriesApi,
  ophimGetCountriesApi,
} from '@/services/ophim.api'
import { IOphimCategory } from '@/types/ophim.type'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { memo } from 'react'
import { FaCaretRight } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'
import { Link, NavLink } from 'react-router-dom'

const SidebarNavLeft = ({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) => {
  const getOphimGetCategoriesApiResult = useQuery({
    queryKey: ['categories'],
    queryFn: async () => await ophimGetCategoriesApi(),
    enabled: !!open,
  })
  const getOphimGetCountriesApiResult = useQuery({
    queryKey: ['countries'],
    queryFn: async () => await ophimGetCountriesApi(),
    enabled: !!open,
  })
  if (!open) return <></>
  return (
    <section className="z-50 fixed inset-0 bg-black/50">
      <div onClick={onClose} className="absolute inset-0 -z-10"></div>
      <div className="z-10 max-w-[500px] w-full bg-color-bg-container text-color-text-secondary-1 h-screen overflow-y-auto overflow-x-hidden p-4 text-sm">
        <div className="flex items-center justify-between gap-4">
          <Link to={`/`} onClick={onClose} className="block w-36 md:w-44">
            <img src={IMAGE_DEFAULT.phimmoi_image} loading="lazy" alt="" />
          </Link>
          <button onClick={onClose}>
            <MdClose size={24} />
          </button>
        </div>
        <ul className="mt-4 flex flex-col gap-3">
          {ophimHeaderLinks.map((item) => (
            <li key={item.name}>
              <NavLink
                onClick={onClose}
                to={`/danh-muc/` + item.slug}
                className={({ isActive }) =>
                  clsx(
                    ` text-sm min-w-max block hover:text-white`,
                    isActive && `text-blue-500`,
                  )
                }
              >
                <h4>{item.name}</h4>
              </NavLink>
            </li>
          ))}
          {/* dropdown */}
          <li className="relative group min-w-max">
            <AccordionComponent title={<h4>Thể loại</h4>}>
              <ul className="grid grid-cols-2 sm:grid-cols-3">
                {getOphimGetCategoriesApiResult.data?.data?.items?.map(
                  (item: IOphimCategory) => (
                    <li key={item._id}>
                      <NavLink
                        onClick={onClose}
                        to={`/the-loai/` + item.slug}
                        className={({ isActive }) =>
                          clsx(
                            `flex items-center gap-1 p-4 py-2 hover:text-white`,
                            isActive && `text-blue-500`,
                          )
                        }
                      >
                        <FaCaretRight />
                        <span>{item.name}</span>
                      </NavLink>
                    </li>
                  ),
                )}
              </ul>
            </AccordionComponent>
          </li>
          {/* dropdown */}
          <li className="relative group min-w-max">
            <AccordionComponent title={<h4>Quốc gia</h4>}>
              <ul className="grid grid-cols-2 sm:grid-cols-3">
                {getOphimGetCountriesApiResult.data?.data?.items?.map(
                  (item: IOphimCategory) => (
                    <li key={item._id}>
                      <NavLink
                        onClick={onClose}
                        to={`/quoc-gia/` + item.slug}
                        className={({ isActive }) =>
                          clsx(
                            `flex items-center gap-1 p-4 py-2 hover:text-white`,
                            isActive && `text-blue-500`,
                          )
                        }
                      >
                        <FaCaretRight />
                        {item.name}
                      </NavLink>
                    </li>
                  ),
                )}
              </ul>
            </AccordionComponent>
          </li>
        </ul>
      </div>
    </section>
  )
}

export default memo(SidebarNavLeft)
