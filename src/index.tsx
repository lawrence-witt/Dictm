import React from 'react';
import ReactDOM from 'react-dom';

import { GlobalStyles } from './Global.styles';
import App from './App';

const rootHtml = (
    <React.StrictMode>
        <GlobalStyles />
        <App />
    </React.StrictMode>
)

ReactDOM.render(rootHtml, document.getElementById('root'));