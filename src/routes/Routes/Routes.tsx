import { CustomRouteProps } from './Routes.types';

const MediaRoute: CustomRouteProps = {
    name: "media",
    exact: true,
    path: ["/recordings", "/notes"]
}

const CategoriesRoute: CustomRouteProps = {
    name: "categories",
    exact: true,
    path: "/categories/:categoryId?"
}

const SettingsRoute: CustomRouteProps = {
    name: "settings",
    exact: true,
    path: "/settings"
}

const Routes = [
    MediaRoute,
    CategoriesRoute,
    SettingsRoute
]

export default Routes;