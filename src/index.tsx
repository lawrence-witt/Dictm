import React from 'react';
import ReactDOM from 'react-dom';

import { GlobalStyles } from './Global.styles';
import { ThemeProvider } from './components/base/theme/provider';

import App from './App';

const rootHtml = (
    <React.StrictMode>
        <ThemeProvider>
            <GlobalStyles />
            <App />
        </ThemeProvider>
    </React.StrictMode>
)

ReactDOM.render(rootHtml, document.getElementById('root'));