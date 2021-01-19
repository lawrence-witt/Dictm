import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import App from './App';

// https://material-ui.com/customization/default-theme/

const rootHtml = (
    <React.StrictMode>
        <CssBaseline />
        <App />
    </React.StrictMode>
)

ReactDOM.render(rootHtml, document.getElementById('root'));