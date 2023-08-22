import React, { Suspense } from 'react';

import { Provider } from 'store';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';
import Sidebar from 'layouts/Sidebar';

function App() {
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#212121',
      },
      secondary: {
        main: '#FEBF0F',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Provider>
        <Suspense fallback="loading">
          <Sidebar />
        </Suspense>
      </Provider>
    </ThemeProvider>
  );
}

export default React.memo(App);
