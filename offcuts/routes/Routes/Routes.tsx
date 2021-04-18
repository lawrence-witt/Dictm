import { CustomRouteProps } from './Routes.types';

const RecordingsRoute: CustomRouteProps = {
    name: "recordings",
    exact: true,
    path: "/recordings"
}

const NotesRoute: CustomRouteProps = {
    name: "notes",
    exact: true,
    path: "/notes"
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
    RecordingsRoute,
    NotesRoute,
    CategoriesRoute,
    SettingsRoute
]

export default Routes;