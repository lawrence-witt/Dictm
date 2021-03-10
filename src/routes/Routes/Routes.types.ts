import { RouteProps } from 'react-router-dom';

export interface CustomRouteProps extends RouteProps {
    name: 'media' | 'categories' | 'settings';
}