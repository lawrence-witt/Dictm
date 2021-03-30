import React from 'react';
import { hot } from 'react-hot-loader';
import { useLocation } from 'react-router-dom';
import { a } from 'react-spring';

import { makeStyles } from '@material-ui/core/styles';

import AppSwitch from '../../../routes/AppSwitch/AppSwitch';

import ToolBar from '../../sections/ToolBar/ToolBar';
import NavBar from '../../sections/NavBar/NavBar';
import NavMenu from '../../sections/NavMenu/NavMenu';
import Editor from '../../sections/Editor/Editor';

import useUniqueTransition from '../../../utils/hooks/useUniqueTransition'

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
    },
    templateBase: {
        width: '100%',
        height: '100%',
        position: 'relative'
    },
    templateFrame: {
        width: '100%',
        height: '100%',
        position: 'absolute'
    }
}));

const App: React.FC = (): React.ReactElement => {
    const classes = useStyles();

    const location = useLocation();
    const left = true;

    const templateTransition = useUniqueTransition("pathname", location, {
        initial: {transform: "translateX(0%)"},
        from: {transform: `translateX(${left ? 100 : -100}%)`},
        enter: {transform: "translateX(0%)"},
        leave: {transform: `translateX(${left ? -100 : 100}%)`}
    });

    return (
        <div className={classes.fixedBase}>
            <NavMenu/>
            <div className={classes.pageBase}>
                <ToolBar
                    toggleMenu={() => ({})}
                />
                <div className={classes.templateBase}>
                    {templateTransition((style, location) => (
                        <a.div className={classes.templateFrame} style={style}>
                            <AppSwitch location={location}/>
                        </a.div>
                    ))}
                </div>
                <Editor />
                <NavBar />
            </div>
        </div>
    )
};

export default hot(module)(App);