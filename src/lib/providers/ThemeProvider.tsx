import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core/styles'

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

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

const ThemeProvider: React.FC = ({children}) => {
    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </MuiThemeProvider>
    )
};

export default ThemeProvider;