import { Location } from 'history';
import { matchPath } from 'react-router-dom';
import { RootState } from '../../store';

import * as types from './types';

/** 
*  Summary:
*  Creates a link item for the Nav Menu.
*/

export const createNavItem = (
    id: string,
    icon: string | undefined,
    primary: string, 
    divider: boolean, 
    to: string | undefined,
    onClick: (() => void) | undefined
): types.NavMenuItem => ({
    id,
    icon,
    primary,
    divider,
    to,
    onClick
});

/** 
*  Summary:
*  Derives an menu animation direction by comparing stem indexes.
*/

export const getDirectionByStemIndex = (
    prevStem: typeof types.stems[number],
    currStem: typeof types.stems[number]
): 'left' | 'right' => {
    const prevIndex = types.stems.indexOf(prevStem);
    const currIndex = types.stems.indexOf(currStem);

    return currIndex >= prevIndex ? 'left' : 'right';
}

/** 
*  Summary:
*  Derives a menu animation direction by comparing category id indexes.
*/

export const getDirectionByCategoryIndex = (
    prevId: string,
    currId: string,
    categories: RootState["content"]["categories"]
): 'left' | 'right' => {
    const prevIndex = categories.allIds.indexOf(prevId);
    const currIndex = categories.allIds.indexOf(currId);

    return currIndex > prevIndex ? 'left' : 'right';
}

/** 
*  Summary:
*  Extracts the location parameters required to render a Dashboard slide.
*/

export const extractParams = (
    pathname: string
): types.Params => {
    const match = matchPath<
        {stem: typeof types.stems[number], categoryId: string}
    >(pathname, {
        path: '/:stem/:categoryId?',
        exact: true,
        strict: true
    });

    return {
        stem: match && types.stems.includes(match.params.stem) ? match.params.stem : undefined,
        categoryId: match?.params.categoryId
    }
}

/** 
*  Summary:
*  Derives the title of the Dashboard page from the current location parameters.
*/

export const extractPageTitle = (
    location: Location,
    categories: RootState["content"]["categories"]
): string => {
    const { stem, categoryId } = extractParams(location.pathname);
        
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