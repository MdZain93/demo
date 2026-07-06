/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRiskStats, getRiskRegister, addRisk, updateRiskStatus } from '../../services/riskService';

export const fetchRiskStatsAndRegister = createAsyncThunk(
  'risk/fetchRiskStatsAndRegister',
  async (_, { rejectWithValue }) => {
    try {
      const stats = await getRiskStats();
      const register = await getRiskRegister();
      return { stats, register };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createRiskItem = createAsyncThunk(
  'risk/createRiskItem',
  async (riskItem, { rejectWithValue }) => {
    try {
      const data = await addRisk(riskItem);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const changeRiskStatus = createAsyncThunk(
  'risk/changeStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const data = await updateRiskStatus(id, status);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  summary: null,
  riskMatrix: [],
  register: [],
  categories: [],
  loading: false,
  error: null,
  addSuccess: false
};

const riskSlice = createSlice({
  name: 'risk',
  initialState,
  reducers: {
    clearAddSuccess: (state) => {
      state.addSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRiskStatsAndRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRiskStatsAndRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.stats.summary;
        state.riskMatrix = action.payload.stats.riskMatrix;
        state.categories = action.payload.stats.categories;
        state.register = action.payload.register;
      })
      .addCase(fetchRiskStatsAndRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch risk data';
      })
      .addCase(createRiskItem.fulfilled, (state, action) => {
        state.register.unshift(action.payload);
        state.addSuccess = true;
        
        // Recalculate summary metrics dynamically
        if (state.summary) {
          state.summary.totalRisks += 1;
          const sevKey = `${String(action.payload.severity || 'Low').toLowerCase()}Risks`;
          if (state.summary[sevKey] !== undefined) {
            state.summary[sevKey] += 1;
          }
        }
      })
      .addCase(changeRiskStatus.fulfilled, (state, action) => {
        const index = state.register.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.register[index] = action.payload;
        }
      });
  }
});

export const { clearAddSuccess } = riskSlice.actions;
export default riskSlice.reducer;
