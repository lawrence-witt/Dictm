import React from 'react';
import { hot } from 'react-hot-loader';

import { makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';

import PageBar from './components/composed/PageBar';
import NavBar from './components/composed/NavBar';
import NavMenu from './components/composed/NavMenu/NavMenu';

import useToggle from './utils/hooks/useToggle';

const useStyles = makeStyles(() => ({
    fixedBase: {
        display: 'flex',
        height: '100%',
        width: '100%',
        position: 'fixed'
    },
    pageBase: {
        transform: 'scaleY(1)', // for fixed bars to latch on to
        height: '100%',
        flex: 1
    }
}));

const App: React.FC = (): React.ReactElement => {
    const classes = useStyles();

    const [isMenuOpen, toggleMenu] = useToggle(false);

    return (
        <div className={classes.fixedBase}>
            <NavMenu 
                isMenuOpen={isMenuOpen}
                toggleMenu={toggleMenu}
            />
            <div className={classes.pageBase}>
                <PageBar
                    toggleMenu={toggleMenu}
                />
                <NavBar />
            </div>
        </div>
    )
};

export default hot(module)(App);