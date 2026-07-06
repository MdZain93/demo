/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import supabase from '../lib/supabaseClient';

export const getNotifications = async () => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_date', { ascending: false });

  if (error) throw new Error('Failed to load notifications from database.');

  return data.map((n) => ({
    id: n.id,
    title: n.title,
    message: n.message,
    type: n.type,
    priority: n.priority,
    read: n.read,
    createdDate: n.created_date,
  }));
};

export const markAsRead = async (id) => {
  await supabase.from('notifications').update({ read: true }).eq('id', id);
  return getNotifications();
};

export const markAllNotificationsAsRead = async () => {
  await supabase.from('notifications').update({ read: true }).neq('read', true);
  return getNotifications();
};

export const addNotification = async (title, message, type, priority) => {
  const newNotif = {
    id: `NOT-${String(Date.now() % 10000).padStart(3, '0')}`,
    title,
    message,
    type,
    priority,
    read: false,
    created_date: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('notifications')
    .insert(newNotif)
    .select()
    .single();

  if (error) throw new Error('Failed to add notification in database.');

  return {
    id: data.id,
    title: data.title,
    message: data.message,
    type: data.type,
    priority: data.priority,
    read: data.read,
    createdDate: data.created_date,
  };
};
