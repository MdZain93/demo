/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { isRouteAllowed } from '../../utils/roleAccess';

export function RoleBasedRoute({ children, path }) {
  const { role, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Check if current role has permission to access this path
  const targetPath = path || location.pathname;
  const permitted = isRouteAllowed(role, targetPath);

  if (!permitted) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default RoleBasedRoute;
