/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import supabase from '../lib/supabaseClient';

export const getDashboardStats = async () => {
  const { data, error } = await supabase
    .from('dashboard_stats')
    .select('data')
    .eq('id', 1)
    .single();

  if (error || !data) {
    throw new Error('Failed to load dashboard stats from database.');
  }

  return data.data;
};
