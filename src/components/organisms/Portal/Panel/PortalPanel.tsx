import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import clsx from 'clsx';

import { animated, useTransition } from 'react-spring';

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import { RootState } from '../../../../redux/store';

import HomePanel from './Home/HomePanel';
import LocalUsersPanel from './LocalUsers/LocalUsersPanel';
import NewUserPanel from './NewUser/NewUserPanel';

import * as types from './PortalPanel.types';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    panel: state.auth.panel
});

const connector = connect(mapState);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

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
    local: {},
    new: {}
}));

const AuthPanelSwitch: React.FC<types.PortalPanelSwitchProps> = ({panel}) => {
    switch(panel) {
        case "home":
            return <HomePanel />
        case "local":
            return <LocalUsersPanel />
        case "new":
            return <NewUserPanel />
        default:
            return null;
    }
}

const AnimatedBox = animated(Box);

const PortalPanel: React.FC<ReduxProps> = (props) => {
    const {
        panel
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
                    />
                </AnimatedBox>
            ))}
        </div>
    )
}

export default connector(PortalPanel);