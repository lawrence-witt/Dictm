import React from 'react';

import clsx from 'clsx';

import { animated, useTransition } from 'react-spring';

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import HomePanel from './Home/HomePanel';
import LocalUsersPanel from './LocalUsers/LocalUsersPanel';
import NewUserPanel from './NewUser/NewUserPanel';

import * as types from './AuthPanel.types';

/* Styled */

const useStyles = makeStyles(theme => ({
    frame: {
        position: 'relative',
        width: '100%',
        flex: 1,
        overflowX: "hidden"
    },
    slide: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3),
        }
    },
    home: {
        justifyContent: "center"
    },
    localUsers: {},
    newUser: {}
}))

/* Components */

const AuthPanelSwitch: React.FC<types.AuthPanelSwitchProps> = (props) => {
    const { panel, pushPanel } = props;

    switch(panel) {
        case "home":
            return <HomePanel pushPanel={pushPanel} />
        case "localUsers":
            return <LocalUsersPanel />
        case "newUser":
            return <NewUserPanel />
        default:
            return null;
    }
}

const AnimatedBox = animated(Box);

const AuthPanel: React.FC<types.AuthPanelProps> = (props) => {
    const {
        panel,
        pushPanel
    } = props;

    const classes = useStyles();

    const left = panel.current !== "home";

    const panelTransition = useTransition(panel.current, {
        initial: {transform: 'translateX(0%)'},
        from: { transform: `translateX(${left ? '' : '-'}100%)`},
        enter: { transform: 'translateX(0%)'},
        leave: { transform: `translateX(${left ? '-' : ''}100%)`}
    });

    return (
        <div className={classes.frame}>
            {panelTransition((style, item) => (
                <AnimatedBox 
                    style={style}
                    className={clsx(classes.slide, classes[item])}
                >
                    <AuthPanelSwitch 
                        panel={item} 
                        pushPanel={pushPanel} 
                    />
                </AnimatedBox>
            ))}
        </div>
    )
}

export default AuthPanel;