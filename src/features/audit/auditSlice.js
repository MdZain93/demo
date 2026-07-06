/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAuditLogs, logAuditActivity } from '../../services/auditService';

export const fetchAuditLogs = createAsyncThunk(
  'audit/fetchLogs',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAuditLogs();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addAuditLog = createAsyncThunk(
  'audit/addLog',
  async ({ user, role, action, module, description, ip }, { rejectWithValue }) => {
    try {
      const data = await logAuditActivity(user, role, action, module, description, ip);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  logs: [],
  loading: false,
  error: null
};

const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load audit logs';
      })
      .addCase(addAuditLog.fulfilled, (state, action) => {
        state.logs.unshift(action.payload);
      });
  }
});

export default auditSlice.reducer;
