/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDashboardStats } from '../../services/dashboardService';

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getDashboardStats();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  kpis: null,
  procurementTrend: [],
  departmentSpending: [],
  riskTrend: [],
  complianceTrend: [],
  loading: false,
  error: null
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.kpis = action.payload.kpis;
        state.procurementTrend = action.payload.procurementTrend;
        state.departmentSpending = action.payload.departmentSpending;
        state.riskTrend = action.payload.riskTrend;
        state.complianceTrend = action.payload.complianceTrend;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch dashboard statistics';
      });
  }
});

export default dashboardSlice.reducer;
