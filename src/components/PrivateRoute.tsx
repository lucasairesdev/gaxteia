import { Navigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import type { ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
} 