import React from 'react'
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom'

import { RootLayout } from './features/shared/layouts/RootLayout'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { HomePage } from './features/shared/pages/Home'
import { DashboardPage } from './features/shared/pages/Dashboard'
import { NotFoundPage } from './features/shared/pages/NotFound'
import { UnauthenticatedRoute } from './features/auth/components/UnauthenticatedRoute'
import { AuthenticatedRoute } from './features/auth/components/AuthenticatedRoute'
import { LoginPage } from './features/auth/pages/Login'
import { SignUpPage } from './features/auth/pages/SignUp'
import { CreateProjectPage } from './features/projects/pages/CreateProject'
import { RootProviders } from './features/shared/providers/RootProviders'

export const AppRoutes = {
  Home: '/',
  Login: '/login',
  SignUp: '/signup',
  Dashboard: '/dashboard',
  CreateProject: '/dashboard/projects/new',
}

const routes = createRoutesFromElements(
  <Route path={AppRoutes.Home} element={<RootLayout />}>
    <Route index element={<UnauthenticatedRoute route={HomePage} />} />
    <Route path={AppRoutes.Login} element={<UnauthenticatedRoute route={LoginPage} />} />
    <Route path={AppRoutes.SignUp} element={<UnauthenticatedRoute route={SignUpPage} />} />

    <Route path={AppRoutes.Dashboard} element={<AuthenticatedRoute route={DashboardPage} />} />
    <Route
      path={AppRoutes.CreateProject}
      element={<AuthenticatedRoute route={CreateProjectPage} />}
    />
    <Route path='*' element={<NotFoundPage />} />
  </Route>,
)

const router = createBrowserRouter(routes)

export function Router() {
  return (
    <RootProviders>
      <RouterProvider router={router} />
    </RootProviders>
  )
}
