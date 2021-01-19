import React from 'react';
import { hot } from 'react-hot-loader';

import AppBar from './components/composed/AppBar';
import NavBar from './components/composed/NavBar';

const App: React.FC = (): React.ReactElement => {

    return (
        <>
            <AppBar />
            <NavBar />
        </>
    )
};

export default hot(module)(App);