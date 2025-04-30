import { useRoutes } from 'react-router-dom'
import AuthProtectedRouter from '@/features/authentication/contexts/AuthProtectedRouter'
import AuthRouter from './auth.router'
import RootLayout from '@/layouts/RootLayout'
import RootRouter from './root.router'
import AuthLayout from '@/layouts/AuthLayout'
const MainRouter = () => {
  const router = useRoutes([
    {
      index: true,
      path: '/*',
      element: (
        <RootLayout>
          <RootRouter />
        </RootLayout>
      ),
    },
    {
      path: 'me/*',
      element: (
        <AuthProtectedRouter>
          <AuthLayout>
            <AuthRouter />
          </AuthLayout>
        </AuthProtectedRouter>
      ),
    },
  ])
  return router
}

export default MainRouter
