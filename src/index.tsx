import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as StoreProvider } from 'react-redux';

import { BrowserRouter } from 'react-router-dom';

import store from './redux/store';

import ThemeProvider from './lib/providers/ThemeProvider';
import BreakpointsProvider from './lib/providers/BreakpointsProvider';

import App from './components/views/App/App';

const rootHtml = (
  <StoreProvider store={store}>
    <BrowserRouter>
      <ThemeProvider>
        <BreakpointsProvider>
          <App />
        </BreakpointsProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StoreProvider>
)

ReactDOM.render(rootHtml, document.getElementById('root'));