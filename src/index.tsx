import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core/styles'

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { BreakContextProvider } from './utils/hooks/useBreakpoints';

import App from './App';

const theme = createMuiTheme({});
const { lg, xl, ...rest } = theme.breakpoints.values;

const rootHtml = (
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <BreakContextProvider breakpoints={[{...rest}]}>
                <CssBaseline />
                <App />
            </BreakContextProvider>
        </ThemeProvider>
    </React.StrictMode>
)

ReactDOM.render(rootHtml, document.getElementById('root'));