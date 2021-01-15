import React from 'react';
import { hot } from 'react-hot-loader';

import BaseSurface from './components/base/surfaces/BaseSurface';

import CompAppBar from './components/composed/CompAppBar';
import CompTabBar from './components/composed/CompTapBar';

const App: React.FC = (): React.ReactElement => {

    return (
        <div style={{height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
            <CompAppBar />
            <CompTabBar />
        </div>
    )
};

export default hot(module)(App);