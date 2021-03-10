import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';

import store from './redux/store';

import ThemeProvider from './utils/providers/ThemeProvider';
import BreakpointsProvider from './utils/providers/BreakpointsProvider';

import App from './components/views/App/App';

const rootHtml = (
  <Router>
    <ReduxProvider store={store}>
      <ThemeProvider>
        <BreakpointsProvider>
          <App />
        </BreakpointsProvider>
      </ThemeProvider>
    </ReduxProvider>
  </Router>
)

ReactDOM.render(rootHtml, document.getElementById('root'));