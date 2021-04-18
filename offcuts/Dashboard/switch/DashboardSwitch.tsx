import React from 'react';
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router-dom';
import { StaticContext } from 'react-router';
import { connect, ConnectedProps } from 'react-redux';

import { animated } from 'react-spring';

import { makeStyles } from '@material-ui/core';

import { RootState } from '../../../../redux/store';
import { navigationSelectors } from '../../../../redux/ducks/navigation';

import Media from '../../../../components/templates/Media/Media';
import Categories from '../../../../components/templates/Categories/Categories';
import Settings from '../../../../components/templates/Settings/Settings';

import useUniqueTransition from '../../../../lib/hooks/useUniqueTransition';

import Routes from '../routes/DashboardRoutes';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    categories: state.categories,
    location: state.navigation.history.current,
    transition: navigationSelectors.getTemplateAnimation(
        state.categories, 
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
}))

const renderRecordingsRoute = () => {
    return <Media context="recordings"/>;
}

const renderNotesRoute = () => {
    return <Media context="notes"/>;
}

const renderCategoriesRoute = (
    categories: RootState["categories"],
    routeProps: RouteComponentProps<{categoryId: 'string'}, StaticContext, unknown>
) => {
    const categoryId = routeProps.match.params.categoryId;

    if (!categoryId) return <Categories />;
    if (categories.byId[categoryId]) return <Media context="category" categoryId={categoryId}/>;

    return <Redirect to="/" />
}

const renderSettingsRoute = () => {
    return <Settings />;
}

const DashboardSwitch: React.FC<ReduxProps> = (props) => {
    const {
        location,
        transition,
        categories
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
                        {Routes.map(({name, ...rest}) => (
                            <Route
                                key={name}
                                render={(routeProps) => {
                                    return {
                                        recordings: renderRecordingsRoute,
                                        notes: renderNotesRoute,
                                        categories: () => renderCategoriesRoute(categories, routeProps),
                                        settings: renderSettingsRoute
                                    }[name]();
                                }}
                                {...rest}
                            />
                        ))}
                        <Redirect to="/recordings"/>
                    </Switch>
                </animated.div>
            ))}
        </div>
    )
}

export default connector(DashboardSwitch);