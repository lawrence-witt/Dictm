import React from 'react';
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router-dom';
import { StaticContext } from 'react-router';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../redux/store';

import Media from '../../components/templates/Media/Media';
import Categories from '../../components/templates/Categories/Categories';
import Settings from '../../components/templates/Settings/Settings';

import Routes from '../Routes/Routes';

import { AppSwitchProps } from './AppSwitch.types';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    categories: state.categories
});

const connector = connect(mapState);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const renderRecordingsRoute = () => {
    return <Media context="recordings"/>;
}

const renderNotesRoute = () => {
    return <Media context="notes"/>;
}

const renderCategoriesRoute = (
    categories: RootState["categories"],
    routeProps: RouteComponentProps<any, StaticContext, unknown>
) => {
    const categoryId = routeProps.match.params.categoryId;

    if (!categoryId) return <Categories />;
    if (categories.byId[categoryId]) return <Media context="category" categoryId={categoryId}/>;

    return <Redirect to="/" />
}

const renderSettingsRoute = () => {
    return <Settings />;
}

const AppSwitch: React.FC<AppSwitchProps & ReduxProps> = (props) => {
    const {
        location,
        categories
    } = props;

    return (
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
    )
}

export default connector(AppSwitch);