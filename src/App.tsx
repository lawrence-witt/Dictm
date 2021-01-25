import React from 'react';
import { hot } from 'react-hot-loader';

import IconButton from '@material-ui/core/IconButton';
import { makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';

import PageBar from './components/DashBoard/PageBar';
import NavBar from './components/DashBoard/NavBar';
import NavMenu from './components/DashBoard/NavMenu/NavMenu';
import RecordingCard from './components/Cards/RecordingCard';

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
                {/* <PageBar
                    toggleMenu={toggleMenu}
                /> */}
                <RecordingCard />
                <NavBar />
            </div>
        </div>
    )
};

export default hot(module)(App);