import React from 'react';
import { hot } from 'react-hot-loader';

import TouchSurface from './components/base/surfaces/TouchSurface';
/* import useMergedStyles from './components/base/styleconfig/useMergedStyles'; */

import CompAppBar from './components/composed/CompAppBar';
import CompTabBar from './components/composed/CompTapBar';

const testStyle = {
    width: '200px',
    height: '125px',
    background: 'slateblue'
};

const App: React.FC = (): React.ReactElement => {

    return (
        <div style={{height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
            <CompAppBar />
            <TouchSurface tag="button" style={testStyle}>
                hello
            </TouchSurface>
            <CompTabBar />
        </div>
    )
};

export default hot(module)(App);