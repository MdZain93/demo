/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import supabase from '../lib/supabaseClient';

export const getAuditLogs = async () => {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) throw new Error('Failed to load audit logs from database.');

  return data.map((log) => ({
    id: log.id,
    user: log.user_name,
    role: log.role,
    action: log.action,
    module: log.module,
    description: log.description,
    ipAddress: log.ip_address,
    timestamp: log.timestamp,
  }));
};

export const logAuditActivity = async (user, role, action, module, description, ip = '127.0.0.1') => {
  const newLog = {
    id: `AUD-${9000 + Date.now() % 10000}`,
    user_name: user,
    role,
    action,
    module,
    description,
    ip_address: ip,
    timestamp: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('audit_logs')
    .insert(newLog)
    .select()
    .single();

  if (error) throw new Error('Failed to log audit activity in database.');

  return {
    id: data.id,
    user: data.user_name,
    role: data.role,
    action: data.action,
    module: data.module,
    description: data.description,
    ipAddress: data.ip_address,
    timestamp: data.timestamp,
  };
};
