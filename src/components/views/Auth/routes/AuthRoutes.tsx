import React from 'react';

import AuthHome from '../frames/Home/AuthHome';
import AuthLocal from '../frames/Local/AuthLocal';
import AuthNew from '../frames/New/AuthNew';

import { CustomRouteProps } from './AuthRoutes.types';

const HomeRoute: CustomRouteProps = {
    name: "home",
    exact: true,
    path: '/auth',
    render: function AuthHomeFrame() {
        return <AuthHome />;
    }
}

const LocalRoute: CustomRouteProps = {
    name: "local",
    exact: true,
    path: '/auth/local',
    render: function AuthLocalFrame() {
        return <AuthLocal />;
    }
}

const NewRoute: CustomRouteProps = {
    name: "new",
    exact: true,
    path: '/auth/new',
    render: function AuthNewFrame() {
        return <AuthNew />;
    }
}

export const routes = [
    HomeRoute,
    LocalRoute,
    NewRoute
];

export const paths = routes.map(r => r.path);