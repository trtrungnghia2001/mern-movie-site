import { user_links } from '@/features/authentication/constants/links.constant'
import clsx from 'clsx'
import React, { memo } from 'react'
import { NavLink } from 'react-router-dom'

const AuthSidebarLeft = () => {
  return (
    <section className="hidden md:block h-screen md:max-w-[250px] w-full p-4 lg:p-7 space-y-4">
      {user_links.map((item) => (
        <NavLink
          key={item.title}
          to={item.path}
          className={({ isActive }) =>
            clsx(
              `flex items-center gap-3 text-color-text-secondary-1 hover:text-white`,
              isActive && `text-white`,
            )
          }
        >
          <span>{item.icon}</span>
          <span>{item.title}</span>
        </NavLink>
      ))}
    </section>
  )
}

export default memo(AuthSidebarLeft)
