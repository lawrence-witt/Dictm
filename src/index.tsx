import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import ThemeProvider from './utils/providers/ThemeProvider';
import BreakpointsProvider from './utils/providers/BreakpointsProvider';

import App from './App';

const rootHtml = (
  <Router>
    <ThemeProvider>
      <BreakpointsProvider>
        <App />
      </BreakpointsProvider>
    </ThemeProvider>
  </Router>
)

ReactDOM.render(rootHtml, document.getElementById('root'));