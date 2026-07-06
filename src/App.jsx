/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Redux config
import store, { persistor } from './app/store';

// Material UI custom theme configurations
import { getTheme } from './theme/theme';

// Application Routes
import AppRoutes from './routes/AppRoutes';
import AppLoader from './components/common/AppLoader';

// Custom lightweight PersistGate
function AppPersistGate({ children, loading }) {
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    const handleRehydrate = () => {
      const state = persistor.getState();
      if (state.bootstrapped) {
        setBootstrapped(true);
      }
    };

    const unsubscribe = persistor.subscribe(handleRehydrate);
    
    // Check initial state
    if (persistor.getState().bootstrapped) {
      setBootstrapped(true);
    }
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  if (!bootstrapped) {
    return loading;
  }

  return children;
}

export function App() {
  return (
    <Provider store={store}>
      <AppPersistGate loading={<AppLoader message="Hydrating state stores..." />}>
        <ThemeWrapper />
      </AppPersistGate>
    </Provider>
  );
}

// Inner wrapper component to access Redux UI states for dynamic theme switches (Light/Dark)
function ThemeWrapper() {
  const themeMode = useSelector((state) => state.ui?.themeMode || 'light');
  const customTheme = React.useMemo(() => getTheme(themeMode), [themeMode]);

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
