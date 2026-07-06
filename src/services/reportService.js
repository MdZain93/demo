/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import supabase from '../lib/supabaseClient';

export const getReports = async () => {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_date', { ascending: false });

  if (error) throw new Error('Failed to load reports from database.');

  return data.map((r) => ({
    id: r.id,
    name: r.name,
    module: r.module,
    createdBy: r.created_by,
    createdDate: r.created_date,
    format: r.format,
  }));
};

export const createReport = async (reportData, creator) => {
  const newReport = {
    id: `REP-${800 + Date.now() % 10000}`,
    name: reportData.name,
    module: reportData.module,
    created_by: creator.name || 'John Doe',
    created_date: new Date().toISOString().split('T')[0],
    format: reportData.format || 'PDF',
  };

  const { data, error } = await supabase
    .from('reports')
    .insert(newReport)
    .select()
    .single();

  if (error) throw new Error('Failed to create report in database.');

  return {
    id: data.id,
    name: data.name,
    module: data.module,
    createdBy: data.created_by,
    createdDate: data.created_date,
    format: data.format,
  };
};
