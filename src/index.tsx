import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

const rootHtml = (
    <React.StrictMode>
        <App />
    </React.StrictMode>
)

ReactDOM.render(rootHtml, document.getElementById('root'));