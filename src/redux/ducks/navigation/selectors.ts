import { createSelector } from 'reselect';
import { matchPath, RouteComponentProps } from 'react-router-dom';

import { RootState } from '../../store';

import { NavMenuLists } from './types';

/* Nav Menu Selectors */

const createNavItem = (
    id: string,
    icon: string | undefined,
    primary: string, 
    divider: boolean, 
    to: string | undefined,
    onClick: (() => void) | undefined
) => ({
    id,
    icon,
    primary,
    divider,
    to,
    onClick
});

/** 
*  Summary:
*  Creates nested lists for use by the NavMenu component.
*
*  Description:
*  Currently creates a 'main' and 'categories' list.
*  Assigns the primary click action of each item in the list, and its display properties.
*
*  @param {object} user The user state in the Redux store.
*  @param {object} categories The categories state in the Redux store.
*  @param {function} push The history.push method passed from react-router-dom.
*
*  @returns {object} The formatted navigation lists.
*/

export const getNavLists = createSelector((
    user: RootState["user"], 
    categories: RootState["categories"],
    push: RouteComponentProps["history"]["push"]
): NavMenuLists => {
    const mainList = {
        id: "main",
        name: user.name,
        items: [
            createNavItem("recordings", "recordings", "Recordings", false, undefined, () => push('/recordings')),
            createNavItem("notes", "notes", "Notes", false, undefined, () => push('/notes')),
            createNavItem("categories", "categories", "Categories", false, "categories", () => push('/categories')),
            createNavItem("settings", "settings", "Settings", true, undefined, () => push('/settings')),
            createNavItem("signout", "signout", "Sign Out", false, undefined, undefined)
        ]
    }

    const categoriesList = {
        id: "categories",
        name: "Categories",
        items: categories.allIds.map(categoryId => {
            const category = categories.byId[categoryId];
            return createNavItem(
                category.id,
                undefined,
                category.attributes.title, 
                false, 
                undefined, 
                () => push('/categories/'+categoryId)
            );
        })
    }

    return {
        main: mainList,
        categories: categoriesList
    }
}, navLists => navLists);

/* Nav History Selectors */

const matchOptions = {
    path: '/:stem/:categoryId?',
    exact: true,
    strict: true
}

const stems = ['recordings', 'notes', 'categories', 'settings'] as const;

/** 
*  Summary:
*  Determine the page title for the next template.
*
*  Description:
*  By default, simply use the stem of the location.
*  Where a categoryId is included, look it up the in categories Redux state.
*
*  @param {object} categories The categories state in the Redux store.
*  @param {string} pathname The pathname of the current location.
*
*  @returns {string} The title of the next page.
*/

export const getPageTitle = createSelector((
    categories: RootState["categories"],
    pathname: string
) => {
    const match = matchPath<
        {stem: typeof stems[number], categoryId: string}
    >(pathname, matchOptions);

    if (!match || !stems.includes(match.params.stem)) {
        return "Redirecting...";
    }

    switch (match.params.stem) {
        case "recordings":
            return "Recordings";
        case "notes":
            return "Notes";
        case "categories": {
            const categoryId = match.params.categoryId;

            if (!categoryId) return "Categories";

            const category = categories.byId[categoryId];

            if (category) return category.attributes.title;
        }
        case "settings": {
            return "Settings";
        }
        default:
            return "Redirecting...";
    }
}, pageTitle => pageTitle);

/** 
*  Summary:
*  Derives an animation direction by comparing stem indexes.
*
*  @param {string} prev The stem of the previous location.
*  @param {string} curr The stem of the current location.
*
*  @returns {string} The animation direction.
*/

const getDirectionByStemIndex = (
    prev: typeof stems[number],
    curr: typeof stems[number]
): 'left' | 'right' => {
    const prevIndex = stems.indexOf(prev);
    const currIndex = stems.indexOf(curr);

    return currIndex >= prevIndex ? 'left' : 'right';
}

/** 
*  Summary:
*  Derives an animation direction by comparing categoryId indexes.
*
*  @param {string} prev The categoryId of the previous location.
*  @param {string} curr The categoryId of the current location.
*  @param {object} categories The categories state in the Redux store.
*
*  @returns {string} The animation direction.
*/

const getDirectionByCategoryIndex = (
    prev: string,
    curr: string,
    categories: RootState["categories"]
): 'left' | 'right' => {
    const prevIndex = categories.allIds.indexOf(prev);
    const currIndex = categories.allIds.indexOf(curr);

    return currIndex > prevIndex ? 'left' : 'right';
}

/** 
*  Summary:
*  Determines the animation activity and direction for the next template.
*
*  Description:
*  By default, perform a simple index check versus previous location on the root of the pathname.
*  Where a categoryId is included, check the index versus previous location in categories.allIds.
*
*  @param {object} categories The categories state in the Redux store.
*  @param {object} history The history state in the Redux store.
*
*  @returns {object} An object with the props 'dir' and 'active'. 
*/

export const getTemplateAnimation = createSelector((
    categories: RootState["categories"],
    history: RootState["navigation"]["history"]
) => {
    const { previous, current } = history;

    const prevMatch = matchPath<
        {stem: typeof stems[number], categoryId: string}
    >(previous?.location.pathname || "", matchOptions);

    const currMatch = matchPath<
        {stem: typeof stems[number], categoryId: string}
    >(current.location.pathname, matchOptions);

    const leftAnimate = { dir: 'left', active: true };
    const rightAnimate = { dir: 'right', active: true };
    const noAnimate = { dir: 'left', active: false};

    if (
        !prevMatch ||
        !currMatch ||
        !stems.includes(prevMatch.params.stem) ||
        !stems.includes(currMatch.params.stem)
    ) return noAnimate;

    const stemComparison = () => ({
        ...leftAnimate,
        dir: getDirectionByStemIndex(
            prevMatch.params.stem,
            currMatch.params.stem
        )
    });

    const categoryComparison = (
        prevId: string,
        currId: string
    ) => ({
        ...leftAnimate,
        dir: getDirectionByCategoryIndex(
            prevId,
            currId,
            categories
        )
    });

    switch(currMatch.params.stem) {
        case "recordings":
        case "notes":
        case "settings":
            return stemComparison();
        case "categories": {
            const prevId = prevMatch.params.categoryId;
            const currId = currMatch.params.categoryId;

            if (currId) {
                if (!prevId) return leftAnimate;

                return categoryComparison(prevId, currId);
            } else {
                if (prevId) return rightAnimate;

                return stemComparison();
            }
        }
        default: return noAnimate;
    }
}, direction => direction);