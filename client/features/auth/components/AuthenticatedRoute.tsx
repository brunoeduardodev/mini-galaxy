import React from 'react'
import { Navigate } from 'react-router-dom'
import { useCurrentUser } from '../../shared/hooks/useCurrentUser'
import { AppRoutes } from '/client/Router'

type Props = {
  route: () => React.ReactNode
}

export function AuthenticatedRoute({ route: Route }: Props) {
  const user = useCurrentUser()

  if (!user) {
    return <Navigate to={AppRoutes.Login} replace />
  }

  return <Route />
}
