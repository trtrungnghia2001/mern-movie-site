import clsx from 'clsx'
import React, { useState } from 'react'
import { IoChevronDown } from 'react-icons/io5'

const AccordionComponent = ({
  children,
  title,
}: {
  title: React.ReactNode
  children: React.ReactNode
}) => {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={`overflow-hidden relative transition ease-in-out duration-300`}
    >
      <div
        className="cursor-pointer select-none flex items-center justify-between"
        onClick={() => setOpen(!open)}
      >
        {title}
        <IoChevronDown />
      </div>
      <div className={clsx(open ? `h-full` : `h-0`)}>{children}</div>
    </div>
  )
}

export default AccordionComponent
