import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';

import { animated } from 'react-spring';

import { makeStyles } from '@material-ui/core';

import { RootState } from '../../../../redux/store';
import { navigationSelectors } from '../../../../redux/ducks/navigation';

import useUniqueTransition from '../../../../lib/hooks/useUniqueTransition';

import routes from '../routes/DashboardRoutes';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    location: state.navigation.history.current,
    transition: navigationSelectors.getTemplateAnimation(
        state.content.categories, 
        state.navigation.history
    )
});

const connector = connect(mapState);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const useStyles = makeStyles(() => ({
    contentBase: {
        width: '100%',
        height: '100%',
        position: 'relative'
    },
    contentFrame: {
        width: '100%',
        height: '100%',
        position: 'absolute'
    }
}));

const DashboardSwitch: React.FC<ReduxProps> = (props) => {
    const {
        location,
        transition
    } = props;

    const classes = useStyles();

    const { dir, active } = transition;

    const left = dir === "left";

    const templateTransition = useUniqueTransition("pathname", location, {
        initial: {transform: 'translateX(0%)'},
        from: active && { transform: `translateX(${left ? '' : '-'}100%)`},
        enter: { transform: 'translateX(0%)'},
        leave: active && { transform: `translateX(${left ? '-' : ''}100%)`}
    });

    return (
        <div className={classes.contentBase}>
            {templateTransition((style, location) => (
                <animated.div className={classes.contentFrame} style={style}>
                    <Switch location={location}>
                        {routes.map(({name, ...rest}) => (
                            <Route key={name} {...rest} />
                        ))}
                        <Redirect to="/recordings"/>
                    </Switch>
                </animated.div>
            ))}
        </div>
    )
}

export default connector(DashboardSwitch);