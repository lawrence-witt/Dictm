import React from 'react';
import ReactDOM from 'react-dom';

import { Provider as StoreProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

import ThemeProvider from './lib/providers/ThemeProvider';
import BreakpointsProvider from './lib/providers/BreakpointsProvider';

import store from './redux/store';

import Root from './root/Root';

const rootHtml = (
  <StoreProvider store={store}>
    <BrowserRouter>
      <ThemeProvider>
        <BreakpointsProvider>
          <SnackbarProvider>
            <Root />
          </SnackbarProvider>
        </BreakpointsProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StoreProvider>
)

ReactDOM.render(rootHtml, document.getElementById('root'));