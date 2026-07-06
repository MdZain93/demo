/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import supabase from '../lib/supabaseClient';

const mapRequest = (r) => ({
  id: r.id,
  title: r.title,
  department: r.department,
  requestedBy: r.requested_by,
  vendor: r.vendor,
  amount: r.amount,
  status: r.status,
  riskLevel: r.risk_level,
  createdDate: r.created_date,
  requiredDate: r.required_date,
  priority: r.priority,
  category: r.category,
  description: r.description,
  attachments: r.attachments || [],
  comments: r.comments || [],
  approvalHistory: r.approval_history || [],
  auditLogs: r.audit_logs || [],
});

export const getRequests = async () => {
  const { data, error } = await supabase
    .from('procurement_requests')
    .select('*')
    .order('created_date', { ascending: false });

  if (error) throw new Error('Failed to load procurement requests from database.');
  return data.map(mapRequest);
};

export const getRequestById = async (id) => {
  const { data, error } = await supabase
    .from('procurement_requests')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) throw new Error('Procurement request not found');
  return mapRequest(data);
};

export const createRequest = async (requestData, creator) => {
  const { data: existing } = await supabase
    .from('procurement_requests')
    .select('id')
    .order('id', { ascending: false })
    .limit(1);

  const lastNum = existing && existing.length > 0
    ? parseInt(existing[0].id.replace('PR-', ''), 10)
    : 5000;

  const newId = `PR-${lastNum + 1}`;
  const now = new Date().toISOString();

  const newRequest = {
    id: newId,
    title: requestData.title,
    department: creator.department || requestData.department || 'IT',
    requested_by: creator.name || 'John Doe',
    vendor: requestData.vendor,
    amount: parseFloat(requestData.amount),
    status: 'Submitted',
    risk_level: requestData.riskLevel || 'Low',
    created_date: now.split('T')[0],
    required_date: requestData.requiredDate || now.split('T')[0],
    priority: requestData.priority || 'Medium',
    category: requestData.category || 'Operations',
    description: requestData.description,
    attachments: requestData.attachment ? [requestData.attachment] : [],
    comments: [],
    approval_history: [
      {
        step: 'Submission',
        user: creator.name || 'John Doe',
        role: creator.role || 'Employee',
        action: 'Submitted',
        timestamp: now,
        comment: 'Initial request submission',
      },
    ],
    audit_logs: [
      {
        timestamp: now,
        user: creator.name || 'John Doe',
        action: 'Created request and submitted for approval',
      },
    ],
  };

  const { data, error } = await supabase
    .from('procurement_requests')
    .insert(newRequest)
    .select()
    .single();

  if (error) throw new Error('Failed to create procurement request in database.');
  return mapRequest(data);
};

export const addComment = async (id, commentText, user) => {
  const { data: row, error: fetchErr } = await supabase
    .from('procurement_requests')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchErr || !row) throw new Error('Request not found');

  const now = new Date().toISOString();
  const newComment = {
    id: `c-${Date.now()}`,
    author: user.name,
    role: user.role,
    text: commentText,
    timestamp: now,
  };

  const updatedComments = [...(row.comments || []), newComment];
  const updatedAuditLogs = [
    { timestamp: now, user: user.name, action: `Added a comment: "${commentText.substring(0, 30)}..."` },
    ...(row.audit_logs || []),
  ];

  const { data, error } = await supabase
    .from('procurement_requests')
    .update({ comments: updatedComments, audit_logs: updatedAuditLogs })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error('Failed to add comment');
  return mapRequest(data);
};

export const updateRequestStatus = async (id, status, user, comment = '') => {
  const { data: row, error: fetchErr } = await supabase
    .from('procurement_requests')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchErr || !row) throw new Error('Request not found');

  const now = new Date().toISOString();
  const oldStatus = row.status;

  const newApproval = {
    step: `${status} Review`,
    user: user.name,
    role: user.role,
    action: status,
    timestamp: now,
    comment: comment || `Status updated from ${oldStatus} to ${status}`,
  };

  const newAudit = {
    timestamp: now,
    user: user.name,
    action: `Updated status from ${oldStatus} to ${status}`,
  };

  const { data, error } = await supabase
    .from('procurement_requests')
    .update({
      status,
      approval_history: [...(row.approval_history || []), newApproval],
      audit_logs: [newAudit, ...(row.audit_logs || [])],
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error('Failed to update request status');
  return mapRequest(data);
};
