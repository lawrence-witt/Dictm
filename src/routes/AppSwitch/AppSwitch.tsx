import React from 'react';
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router-dom';
import { StaticContext } from 'react-router';

import Media from '../../components/templates/Media/Media';
import Categories from '../../components/templates/Categories/Categories';
import Settings from '../../components/templates/Settings/Settings';

import Routes from '../Routes/Routes';

import { AppSwitchProps } from './AppSwitch.types';

export const testCategories = {
    "abc": {
        media: []
    },
    "def": {
        media: []
    },
    "keys": ["abc", "def"]
}

const renderMediaRoute = () => {
    return <Media />;
}

const renderCategoriesRoute = (
    routeContext: typeof testCategories,
    routeProps: RouteComponentProps<any, StaticContext, unknown>
) => {
    const categoryId = routeProps.match.params.categoryId;

    if (!categoryId) return <Categories />;
    if (categoryId in routeContext) return <Media />;

    return <Redirect to="/" />
}

const renderSettingsRoute = () => {
    return <Settings />;
}

const AppSwitch: React.FC<AppSwitchProps> = (props) => {
    const {
        location
    } = props;

    return (
        <Switch location={location}>
            {Routes.map(({name, ...rest}) => (
                <Route
                    key={name}
                    render={(routeProps) => {
                        return {
                            media: renderMediaRoute,
                            categories: () => renderCategoriesRoute(testCategories, routeProps),
                            settings: renderSettingsRoute
                        }[name]();
                    }}
                    {...rest}
                />
            ))}
            <Redirect to="/recordings"/>
        </Switch>
    )
}

export default AppSwitch;