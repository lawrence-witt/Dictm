import { createSelector } from 'reselect';
import { RouteComponentProps } from 'react-router-dom';

import { RootState } from '../../store';

import { NavMenuLists, stems } from './types';

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
*  By default, perform a simple index check versus previous location on the stem of the pathname.
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

    const leftAnimate = { dir: 'left', active: true };
    const rightAnimate = { dir: 'right', active: true };
    const noAnimate = { dir: 'left', active: false};

    if (!previous?.params.stem || !current.params.stem) return noAnimate;

    const { stem: prevStem, categoryId: prevId } = previous.params;
    const { stem: currStem, categoryId: currId } = current.params;

    const stemComparison = (
        previous: typeof stems[number],
        current: typeof stems[number]
    ) => ({
        ...leftAnimate,
        dir: getDirectionByStemIndex(previous, current)
    });

    const categoryComparison = (
        pId: string,
        cId: string
    ) => ({
        ...leftAnimate,
        dir: getDirectionByCategoryIndex(pId, cId, categories)
    });

    switch(current.params.stem) {
        case "recordings":
        case "notes":
        case "settings":
            return stemComparison(prevStem, currStem);
        case "categories": {
            if (currId) {
                if (!prevId) return leftAnimate;

                return categoryComparison(prevId, currId);
            } else {
                if (prevId) return rightAnimate;

                return stemComparison(prevStem, currStem);
            }
        }
        default: return noAnimate;
    }
}, direction => direction);