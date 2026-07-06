/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getReports, createReport } from '../../services/reportService';

export const fetchReports = createAsyncThunk(
  'reports/fetchReports',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getReports();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const generateNewReport = createAsyncThunk(
  'reports/generate',
  async ({ reportData, creator }, { rejectWithValue }) => {
    try {
      const data = await createReport(reportData, creator);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  reports: [],
  loading: false,
  error: null,
  generateSuccess: false
};

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearGenerateSuccess: (state) => {
      state.generateSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load reports';
      })
      .addCase(generateNewReport.pending, (state) => {
        state.loading = true;
        state.generateSuccess = false;
      })
      .addCase(generateNewReport.fulfilled, (state, action) => {
        state.loading = false;
        state.generateSuccess = true;
        state.reports.unshift(action.payload);
      })
      .addCase(generateNewReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to generate report';
      });
  }
});

export const { clearGenerateSuccess } = reportSlice.actions;
export default reportSlice.reducer;
