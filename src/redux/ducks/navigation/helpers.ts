import { matchPath } from 'react-router-dom';
import { RootState } from '../../store';

import { Params, stems } from './types';

export const extractParams = (
    pathname: string
): Params => {
    const match = matchPath<
        {stem: typeof stems[number], categoryId: string}
    >(pathname, {
        path: '/:stem/:categoryId?',
        exact: true,
        strict: true
    });

    return {
        stem: match && stems.includes(match.params.stem) ? match.params.stem : undefined,
        categoryId: match?.params.categoryId
    }
}

export const extractPageTitle = (
    params: Params,
    categories: RootState["categories"]
): string => {
    const { stem, categoryId } = params;
        
    const capFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    const normalisedStem = stem || 'invalid';

    switch(normalisedStem) {
        case "recordings":
        case "notes":
        case "settings":
            return capFirstLetter(normalisedStem);
        case "categories":
            if (!categoryId) return capFirstLetter(normalisedStem);

            const category = categories.byId[categoryId];

            if (category) return category.attributes.title;
        case "invalid":
        default:
            return "Redirecting...";
    }
}