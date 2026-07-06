/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ROLE_PERMISSIONS } from './constants';

export const isRouteAllowed = (role, path) => {
  if (!role) return false;
  if (role === 'Administrator') return true; // Administrators can access all modules

  const allowedPaths = ROLE_PERMISSIONS[role] || [];
  
  // Direct match or parent match (e.g. /procurement matches /procurement/:id)
  return allowedPaths.some((allowedPath) => {
    if (allowedPath === path) return true;
    if (path.startsWith(allowedPath + '/')) return true;
    return false;
  });
};

export const getDashboardRedirect = (role) => {
  switch (role) {
    case 'Employee':
      return '/dashboard';
    case 'Procurement Manager':
      return '/dashboard';
    case 'Compliance Officer':
      return '/dashboard';
    case 'Auditor':
      return '/dashboard';
    case 'Administrator':
      return '/dashboard';
    default:
      return '/login';
  }
};
