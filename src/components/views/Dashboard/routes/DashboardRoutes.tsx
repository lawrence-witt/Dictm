import React from 'react';

import { CustomRouteProps } from './DashboardRoutes.types';

import Content from '../frames/Content/Content';
import Settings from '../frames/Settings/Settings';

const RecordingsRoute: CustomRouteProps = {
    name: "recordings",
    exact: true,
    path: "/recordings",
    render: function RecordingsContent(): JSX.Element {
        return <Content context="recordings" />;
    }
}

const NotesRoute: CustomRouteProps = {
    name: "notes",
    exact: true,
    path: "/notes",
    render: function NotesContent(): JSX.Element {
        return <Content context="notes"/>;
    }
}

const CategoriesRoute: CustomRouteProps = {
    name: "categories",
    exact: true,
    path: "/categories/:categoryId?",
    render: function CategoriesContent({match}): JSX.Element {
        return <Content context="categories" categoryId={match.params.categoryId} />;
    }
}

const SettingsRoute: CustomRouteProps = {
    name: "settings",
    exact: true,
    path: "/settings",
    render: function SettingsTemplate(): JSX.Element {
        return <Settings />;
    }
}

const routes = [
    RecordingsRoute,
    NotesRoute,
    CategoriesRoute,
    SettingsRoute
]

export default routes;