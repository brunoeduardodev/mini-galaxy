import React from 'react'
import { Navigate } from 'react-router-dom'
import { useCurrentUser } from '../../shared/hooks/useCurrentUser'
import { AppRoutes } from '/client/Router'

type Props = {
  route: () => React.JSX.Element
}

export function UnauthenticatedRoute({ route: Route }: Props) {
  const user = useCurrentUser()

  if (user) {
    return <Navigate to={AppRoutes.Dashboard} replace />
  }

  return <Route />
}
