/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'egrcp-root',
  storage,
  whitelist: ['auth', 'ui', 'procurement', 'vendors', 'risk', 'compliance', 'notifications'] // Persist key states for a true SaaS feel
};

export default persistConfig;
