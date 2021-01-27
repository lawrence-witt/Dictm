import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core/styles'

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { BreakContextProvider } from './utils/hooks/useBreakpoints';

import App from './App';

/* const theme = createMuiTheme({}); */
const theme = createMuiTheme({
    palette: {
      primary: {
        light: '#8133f1',
        main: '#6200EE',
        dark: '#4400a6'
      },
      secondary: {
        light: '#35e1d0',
        main: '#03DAC5',
        dark: '#029889'
      },
    },
  });

const { lg, xl, ...rest } = theme.breakpoints.values;

const rootHtml = (
    <ThemeProvider theme={theme}>
        <Router>
            <BreakContextProvider breakpoints={[{...rest}]}>
                <CssBaseline />
                <App />
            </BreakContextProvider>
        </Router>
    </ThemeProvider>
)

ReactDOM.render(rootHtml, document.getElementById('root'));