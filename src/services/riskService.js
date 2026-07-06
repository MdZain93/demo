/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import supabase from '../lib/supabaseClient';

export const getRiskStats = async () => {
  const { data: config } = await supabase
    .from('risk_data_config')
    .select('data')
    .eq('id', 1)
    .single();

  const { data: register, error: regErr } = await supabase
    .from('risk_register')
    .select('*');

  if (regErr || !config) throw new Error('Failed to load risk data from database.');

  return {
    ...config.data,
    register: register || [],
  };
};

export const getRiskRegister = async () => {
  const { data, error } = await supabase.from('risk_register').select('*');
  if (error) throw new Error('Failed to load risk register from database.');
  return data || [];
};

export const addRisk = async (riskItem) => {
  const score = riskItem.probability * riskItem.impact;
  let severity = 'Low';
  if (score >= 15) severity = 'Critical';
  else if (score >= 10) severity = 'High';
  else if (score >= 5) severity = 'Medium';

  const newRisk = {
    id: `RSK-${String(Date.now() % 10000).padStart(3, '0')}`,
    title: riskItem.title,
    category: riskItem.category,
    probability: parseInt(riskItem.probability),
    impact: parseInt(riskItem.impact),
    score,
    severity,
    owner: riskItem.owner || 'Marcus Vance',
    status: 'Open',
  };

  const { data, error } = await supabase
    .from('risk_register')
    .insert(newRisk)
    .select()
    .single();

  if (error) throw new Error('Failed to add risk in database.');
  return data;
};

export const updateRiskStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('risk_register')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error('Risk item not found');
  return data;
};
