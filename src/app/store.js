/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import persistConfig from './persistConfig';

// Import reducers
import authReducer from '../features/auth/authSlice';
import uiReducer from '../features/ui/uiSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import procurementReducer from '../features/procurement/procurementSlice';
import vendorReducer from '../features/vendors/vendorSlice';
import riskReducer from '../features/risk/riskSlice';
import complianceReducer from '../features/compliance/complianceSlice';
import auditReducer from '../features/audit/auditSlice';
import reportReducer from '../features/reports/reportSlice';
import notificationReducer from '../features/notifications/notificationSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  dashboard: dashboardReducer,
  procurement: procurementReducer,
  vendors: vendorReducer,
  risk: riskReducer,
  compliance: complianceReducer,
  audit: auditReducer,
  reports: reportReducer,
  notifications: notificationReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist non-serializable actions
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
          'persist/FLUSH'
        ]
      }
    })
});

export const persistor = persistStore(store);
export default store;
