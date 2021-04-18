import React from 'react';

import { CustomRouteProps } from './DashboardRoutes.types';

import Content from '../frames/Content/Content';
import Settings from '../frames/Settings/Settings';

const RecordingsRoute: CustomRouteProps = {
    name: "recordings",
    exact: true,
    path: "/recordings",
    render: function RecordingsContent() {
        return <Content context="recordings" />;
    }
}

const NotesRoute: CustomRouteProps = {
    name: "notes",
    exact: true,
    path: "/notes",
    render: function NotesContent() {
        return <Content context="notes"/>;
    }
}

const CategoriesRoute: CustomRouteProps = {
    name: "categories",
    exact: true,
    path: "/categories/:categoryId?",
    render: function CategoriesContent({match}) {
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

export const routes = [
    RecordingsRoute,
    NotesRoute,
    CategoriesRoute,
    SettingsRoute
]

export const paths = routes.map(r => r.path);