import React, { memo } from 'react'
import Wrapper from './Wrapper'
import RootSidebarRight from './RootSidebarRight'

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Wrapper className="my-4 rounded shadow-xl flex flex-col md:flex-row items-stretch bg-color-bg-container">
      <section className="overflow-hidden w-full p-4 lg:p-7">
        {children}
      </section>
      <RootSidebarRight />
    </Wrapper>
  )
}

export default memo(RootLayout)
