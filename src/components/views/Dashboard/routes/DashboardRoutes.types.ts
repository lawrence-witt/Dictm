import { StaticContext } from 'react-router';
import { RouteProps, RouteComponentProps } from 'react-router-dom';

type CustomComponentProps = RouteComponentProps<{categoryId: 'string'}, StaticContext, unknown>;

export interface CustomRouteProps extends RouteProps {
    name: 'recordings' | 'notes' | 'categories' | 'settings';
    render(routeProps: CustomComponentProps): JSX.Element;
} 