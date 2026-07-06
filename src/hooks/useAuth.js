/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logout, updateProfile } from '../features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, role, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const handleLogin = async (email, password) => {
    return dispatch(loginUser({ email, password })).unwrap();
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleUpdateProfile = (profileData) => {
    dispatch(updateProfile(profileData));
  };

  // Helper utility checks for permissions
  const hasRole = (allowedRoles) => {
    if (!role) return false;
    if (role === 'Administrator') return true; // Admins can access everything
    return allowedRoles.includes(role);
  };

  return {
    user,
    token,
    role,
    isAuthenticated,
    loading,
    error,
    login: handleLogin,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
    hasRole
  };
};

export default useAuth;
