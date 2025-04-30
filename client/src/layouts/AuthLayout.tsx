import React, { memo } from 'react'
import Wrapper from './Wrapper'
import AuthSidebarLeft from './AuthSidebarLeft'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Wrapper className="my-4 rounded shadow-xl flex items-start bg-color-bg-container">
      <AuthSidebarLeft />
      <section className="border-l border-color-border min-h-screen overflow-hidden flex-1 p-4 lg:p-7">
        {children}
      </section>
    </Wrapper>
  )
}

export default memo(AuthLayout)
