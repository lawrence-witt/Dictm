import { RouteProps, RouteComponentProps } from 'react-router-dom';

export interface CustomRouteProps extends RouteProps {
    name: 'home' | 'local' | 'new';
    path: string;
    render(routeProps: RouteComponentProps): JSX.Element;
} 