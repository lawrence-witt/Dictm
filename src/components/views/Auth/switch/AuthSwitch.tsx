import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';

import { animated } from 'react-spring';
import { makeStyles } from '@material-ui/core';

import { RootState } from '../../../../redux/store';
import { authSelectors } from '../../../../redux/ducks/auth';

import { routes } from '../routes/AuthRoutes';

import useUniqueTransition from '../../../../lib/hooks/useUniqueTransition';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    location: state.history.current,
    transition: authSelectors.getAuthAnimation(state.history)
});

const connector = connect(mapState);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const useStyles = makeStyles(theme => ({
    contentBase: {
        position: 'relative',
        width: '100%',
        flex: 1,
        overflowX: "hidden"
    },
    contentFrame: {
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
    }
}));

const AuthSwitch: React.FC<ReduxProps> = (props) => {
    const {
        location,
        transition
    } = props;

    const classes = useStyles();

    const active = true;
    const left = true;

    const frameTransition = useUniqueTransition("pathname", location, {
        initial: {transform: 'translateX(0%)'},
        from: active && { transform: `translateX(${left ? '' : '-'}100%)`},
        enter: { transform: 'translateX(0%)'},
        leave: active && { transform: `translateX(${left ? '-' : ''}100%)`}
    });

    return (
        <div className={classes.contentBase}>
            {frameTransition((style, location) => (
                <animated.div className={classes.contentFrame} style={style}>
                    <Switch location={location}>
                        {routes.map(({name, ...rest}) => (
                            <Route key={name} {...rest} />
                        ))}
                        <Redirect to="/auth" />
                    </Switch>
                </animated.div>
            ))}
        </div>
    )
}

export default connector(AuthSwitch);