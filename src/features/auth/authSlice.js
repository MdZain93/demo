/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import supabase from '../../lib/supabaseClient';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .ilike('email', email)
        .eq('password', password)
        .single();

      if (error || !user) {
        throw new Error('Invalid email or password. Please use one of the demo credentials shown below.');
      }

      const token = `mock-jwt-token-for-${String(user.role || 'user').replace(/\s+/g, '-').toLowerCase()}`;
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          department: user.department,
          avatar: user.avatar,
        },
        token,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to load employees from Supabase
export const fetchEmployees = createAsyncThunk(
  'auth/fetchEmployees',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw new Error(error.message);
      return data || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk to load sent emails from Supabase
export const fetchSentEmails = createAsyncThunk(
  'auth/fetchSentEmails',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('sent_emails')
        .select('*')
        .order('timestamp', { ascending: false });
      if (error) throw new Error(error.message);
      return (data || []).map((e) => ({
        id: e.id,
        to: e.to_email,
        toName: e.to_name,
        role: e.role,
        department: e.department,
        password: e.password,
        sentBy: e.sent_by,
        subject: e.subject,
        timestamp: e.timestamp,
      }));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  user: null,
  token: null,
  role: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  employees: [],
  sentEmails: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    updateProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
      const index = (state.employees || []).findIndex((e) => e.email === state.user?.email);
      if (index !== -1) {
        state.employees[index] = { ...state.employees[index], ...action.payload };
      }
      if (state.user?.id) {
        supabase.from('users').update(action.payload).eq('id', state.user.id).then();
      }
    },
    addEmployee: (state, action) => {
      const nameParts = String(action.payload.name || '').split(' ');
      const avatar = nameParts.map((n) => n[0] || '').join('').toUpperCase().substring(0, 2);
      const exists = (state.employees || []).some(
        (e) => String(e.email || '').toLowerCase() === String(action.payload.email || '').toLowerCase()
      );
      if (exists) return;

      const newEmp = {
        id: `u${Date.now()}`,
        avatar: avatar || 'EM',
        ...action.payload,
      };
      state.employees.push(newEmp);

      supabase.from('users').insert({
        id: newEmp.id,
        email: newEmp.email,
        password: newEmp.password,
        name: newEmp.name,
        role: newEmp.role,
        department: newEmp.department,
        avatar: newEmp.avatar,
      }).then();
    },
    logSentEmail: (state, action) => {
      if (!Array.isArray(state.sentEmails)) {
        state.sentEmails = [];
      }
      const emailRecord = {
        id: `mail-${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.sentEmails.unshift(emailRecord);

      supabase.from('sent_emails').insert({
        id: emailRecord.id,
        to_email: emailRecord.to,
        to_name: emailRecord.toName,
        role: emailRecord.role,
        department: emailRecord.department,
        password: emailRecord.password,
        sent_by: emailRecord.sentBy,
        subject: emailRecord.subject,
        timestamp: emailRecord.timestamp,
      }).then();
    },
    fireEmployee: (state, action) => {
      if (Array.isArray(state.employees)) {
        state.employees = state.employees.filter((emp) => emp.id !== action.payload);
      }
      supabase.from('users').delete().eq('id', action.payload).then();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.user.role;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Authentication failed';
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.employees = action.payload;
      })
      .addCase(fetchSentEmails.fulfilled, (state, action) => {
        state.sentEmails = action.payload;
      });
  },
});

export const { logout, clearAuthError, updateProfile, addEmployee, logSentEmail, fireEmployee } = authSlice.actions;
export default authSlice.reducer;
