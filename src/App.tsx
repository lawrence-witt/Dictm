import React from 'react';
import { hot } from 'react-hot-loader';

import AppBar from './components/AppBar';
import IconButton from './components/buttons/IconButton';
import MenuIcon from './components/icons/MenuIcon';
import * as Text from './components/Typography';

const App: React.FC = (): React.ReactElement => {
    return (
        <AppBar>
            <IconButton>
                <MenuIcon />
            </IconButton>
            <Text.H4 shade="light" state="focussed">App</Text.H4>
        </AppBar>
    )
};

export default hot(module)(App);