/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import supabase from '../lib/supabaseClient';

export const getComplianceData = async () => {
  const { data: config } = await supabase
    .from('compliance_data_config')
    .select('data')
    .eq('id', 1)
    .single();

  const { data: issues, error: issErr } = await supabase
    .from('compliance_issues')
    .select('*');

  if (issErr || !config) throw new Error('Failed to load compliance data from database.');

  const mappedIssues = (issues || []).map((i) => ({
    id: i.id,
    requirement: i.requirement,
    entity: i.entity,
    status: i.status,
    dueDate: i.due_date,
    owner: i.owner,
    severity: i.severity,
  }));

  return {
    ...config.data,
    issues: mappedIssues,
  };
};

export const getComplianceIssues = async () => {
  const { data, error } = await supabase.from('compliance_issues').select('*');
  if (error) throw new Error('Failed to load compliance issues from database.');

  return (data || []).map((i) => ({
    id: i.id,
    requirement: i.requirement,
    entity: i.entity,
    status: i.status,
    dueDate: i.due_date,
    owner: i.owner,
    severity: i.severity,
  }));
};

export const resolveComplianceIssue = async (id, ownerName) => {
  const { data, error } = await supabase
    .from('compliance_issues')
    .update({ status: 'Compliant' })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error('Compliance issue not found');

  return {
    id: data.id,
    requirement: data.requirement,
    entity: data.entity,
    status: data.status,
    dueDate: data.due_date,
    owner: data.owner,
    severity: data.severity,
  };
};
