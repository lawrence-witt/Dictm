import { matchPath } from 'react-router-dom';

export const extractAuthSlide = (pathname: string): "local" | "new" | undefined => {
    const match = matchPath<{
        slide: 'local' | 'new';
    }>(pathname, {
        path: '/auth/:slide?',
        exact: true,
        strict: true
    });

    return match?.params.slide;
}