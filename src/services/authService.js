/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import supabase from '../lib/supabaseClient';

export const login = async (email, password) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .ilike('email', email)
    .eq('password', password)
    .single();

  if (error || !data) {
    throw new Error('Invalid email or password. Please use one of the demo credentials shown below.');
  }

  const token = `mock-jwt-token-for-${String(data.role || 'user').replace(/\s+/g, '-').toLowerCase()}`;
  return {
    user: {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      department: data.department,
      avatar: data.avatar,
    },
    token,
  };
};

export const forgotPassword = async (email) => {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .ilike('email', email)
    .single();

  if (error || !data) {
    throw new Error('Email address not registered in system.');
  }
  return { success: true, message: 'Password reset link sent to your email.' };
};

export const resetPassword = async (token, newPassword) => {
  return { success: true, message: 'Your password has been successfully updated.' };
};
