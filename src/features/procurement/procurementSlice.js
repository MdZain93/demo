/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getRequests,
  getRequestById,
  createRequest,
  addComment,
  updateRequestStatus
} from '../../services/procurementService';

export const fetchRequests = createAsyncThunk(
  'procurement/fetchRequests',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getRequests();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchRequestById = createAsyncThunk(
  'procurement/fetchRequestById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await getRequestById(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const submitNewRequest = createAsyncThunk(
  'procurement/submitNewRequest',
  async ({ requestData, creator }, { rejectWithValue }) => {
    try {
      const data = await createRequest(requestData, creator);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const submitComment = createAsyncThunk(
  'procurement/submitComment',
  async ({ id, commentText, user }, { rejectWithValue }) => {
    try {
      const data = await addComment(id, commentText, user);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const processApproval = createAsyncThunk(
  'procurement/processApproval',
  async ({ id, status, user, comment }, { rejectWithValue }) => {
    try {
      const data = await updateRequestStatus(id, status, user, comment);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  requests: [],
  selectedRequest: null,
  loading: false,
  error: null,
  submitLoading: false,
  submitSuccess: false
};

const procurementSlice = createSlice({
  name: 'procurement',
  initialState,
  reducers: {
    clearSubmitSuccess: (state) => {
      state.submitSuccess = false;
    },
    clearSelectedRequest: (state) => {
      state.selectedRequest = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Requests
      .addCase(fetchRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load procurement requests';
      })
      // Fetch Request By ID
      .addCase(fetchRequestById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequestById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRequest = action.payload;
      })
      .addCase(fetchRequestById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load request details';
      })
      // Submit New Request
      .addCase(submitNewRequest.pending, (state) => {
        state.submitLoading = true;
        state.submitSuccess = false;
      })
      .addCase(submitNewRequest.fulfilled, (state, action) => {
        state.submitLoading = false;
        state.submitSuccess = true;
        state.requests.unshift(action.payload);
      })
      .addCase(submitNewRequest.rejected, (state, action) => {
        state.submitLoading = false;
        state.error = action.payload || 'Failed to submit request';
      })
      // Submit Comment & Process Approval (both update the selected request and list)
      .addCase(submitComment.fulfilled, (state, action) => {
        state.selectedRequest = action.payload;
        const index = state.requests.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
      })
      .addCase(processApproval.fulfilled, (state, action) => {
        state.selectedRequest = action.payload;
        const index = state.requests.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
      });
  }
});

export const { clearSubmitSuccess, clearSelectedRequest } = procurementSlice.actions;
export default procurementSlice.reducer;
