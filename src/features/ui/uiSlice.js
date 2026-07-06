/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: true,
  themeMode: 'light',
  globalSearch: '',
  pageTitle: 'GRC Hub Overview'
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleThemeMode: (state) => {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
    },
    setThemeMode: (state, action) => {
      state.themeMode = action.payload;
    },
    setGlobalSearch: (state, action) => {
      state.globalSearch = action.payload;
    },
    setPageTitle: (state, action) => {
      state.pageTitle = action.payload;
    }
  }
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleThemeMode,
  setThemeMode,
  setGlobalSearch,
  setPageTitle
} = uiSlice.actions;

export default uiSlice.reducer;
