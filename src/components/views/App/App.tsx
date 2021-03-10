import React from 'react';
import { hot } from 'react-hot-loader';

import { makeStyles } from '@material-ui/core/styles';

import AppSwitch from '../../../routes/AppSwitch/AppSwitch';

import ToolBar from '../../organisms/ToolBar/ToolBar';
import NavBar from '../../organisms/NavBar/NavBar';
import NavMenu from '../../organisms/NavMenu/NavMenu';
import Editor from '../../organisms/Editor/Editor';

import useToggle from '../../../utils/hooks/useToggle';

const useStyles = makeStyles(() => ({
    fixedBase: {
        display: 'flex',
        height: '100%',
        width: '100%',
        position: 'fixed'
    },
    pageBase: {
        height: '100%',
        width: '100%',
        minWidth: 300,
        display: 'flex',
        flexDirection: 'column'
    }
}));

const App: React.FC = (): React.ReactElement => {
    const classes = useStyles();

    const [num] = React.useState(new Array(10).fill(1));
    const [isMenuOpen, toggleMenu] = useToggle(false);

    return (
        <div className={classes.fixedBase}>
            <NavMenu 
                isMenuOpen={isMenuOpen}
                toggleMenu={toggleMenu}
            />
            <div className={classes.pageBase}>
                <ToolBar
                    toggleMenu={toggleMenu}
                />
                <AppSwitch />
                <Editor />
                <NavBar />
            </div>
        </div>
    )
};

export default hot(module)(App);