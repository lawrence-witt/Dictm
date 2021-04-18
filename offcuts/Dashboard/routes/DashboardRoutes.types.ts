import { RouteProps } from 'react-router-dom';

export interface CustomRouteProps extends RouteProps {
    name: 'recordings' | 'notes' | 'categories' | 'settings';
}