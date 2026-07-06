/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getComplianceData, resolveComplianceIssue } from '../../services/complianceService';

export const fetchComplianceData = createAsyncThunk(
  'compliance/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getComplianceData();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const resolveIssue = createAsyncThunk(
  'compliance/resolveIssue',
  async ({ id, owner }, { rejectWithValue }) => {
    try {
      const data = await resolveComplianceIssue(id, owner);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  summary: null,
  issues: [],
  missingDocuments: [],
  expiredCertificates: [],
  trend: [],
  loading: false,
  error: null
};

const complianceSlice = createSlice({
  name: 'compliance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComplianceData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComplianceData.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.summary;
        state.issues = action.payload.issues;
        state.missingDocuments = action.payload.missingDocuments;
        state.expiredCertificates = action.payload.expiredCertificates;
        state.trend = action.payload.trend;
      })
      .addCase(fetchComplianceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch compliance details';
      })
      .addCase(resolveIssue.fulfilled, (state, action) => {
        const idx = state.issues.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) {
          state.issues[idx] = action.payload;
        }
        if (state.summary) {
          state.summary.openViolations = Math.max(0, state.summary.openViolations - 1);
          state.summary.resolvedIssues += 1;
          state.summary.complianceScore = Math.min(100, state.summary.complianceScore + 2);
        }
      });
  }
});

export default complianceSlice.reducer;
