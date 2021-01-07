import React from 'react';
import ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader';

import App from './App';

const HotApp = hot(module)(App);

const rootHtml = (
    <React.StrictMode>
        <HotApp />
    </React.StrictMode>
)

ReactDOM.render(rootHtml, document.getElementById('root'));