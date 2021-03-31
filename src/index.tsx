import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';

import { ConnectedRouter } from 'connected-react-router';

import store, { history } from './redux/store';

import ThemeProvider from './utils/providers/ThemeProvider';
import BreakpointsProvider from './utils/providers/BreakpointsProvider';

import App from './components/views/App/App';

const rootHtml = (
  <ReduxProvider store={store}>
    <ConnectedRouter history={history}>
      <ThemeProvider>
        <BreakpointsProvider>
          <App />
        </BreakpointsProvider>
      </ThemeProvider>
    </ConnectedRouter>
  </ReduxProvider>
)

ReactDOM.render(rootHtml, document.getElementById('root'));