/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getVendors,
  getVendorById,
  onboardVendor,
  updateVendorDocument
} from '../../services/vendorService';

export const fetchVendors = createAsyncThunk(
  'vendors/fetchVendors',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getVendors();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchVendorById = createAsyncThunk(
  'vendors/fetchVendorById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await getVendorById(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createOnboardVendor = createAsyncThunk(
  'vendors/onboard',
  async (vendorData, { rejectWithValue }) => {
    try {
      const data = await onboardVendor(vendorData);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const renewVendorDoc = createAsyncThunk(
  'vendors/renewDoc',
  async ({ vendorId, docName, expiryDate, status }, { rejectWithValue }) => {
    try {
      const data = await updateVendorDocument(vendorId, docName, expiryDate, status);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  vendors: [],
  selectedVendor: null,
  loading: false,
  error: null,
  onboardSuccess: false
};

const vendorSlice = createSlice({
  name: 'vendors',
  initialState,
  reducers: {
    clearOnboardSuccess: (state) => {
      state.onboardSuccess = false;
    },
    clearSelectedVendor: (state) => {
      state.selectedVendor = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = action.payload;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load vendors';
      })
      .addCase(fetchVendorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVendor = action.payload;
      })
      .addCase(fetchVendorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load vendor profile';
      })
      .addCase(createOnboardVendor.fulfilled, (state, action) => {
        state.vendors.unshift(action.payload);
        state.onboardSuccess = true;
      })
      .addCase(renewVendorDoc.fulfilled, (state, action) => {
        state.selectedVendor = action.payload;
        const idx = state.vendors.findIndex((v) => v.id === action.payload.id);
        if (idx !== -1) {
          state.vendors[idx] = action.payload;
        }
      });
  }
});

export const { clearOnboardSuccess, clearSelectedVendor } = vendorSlice.actions;
export default vendorSlice.reducer;
