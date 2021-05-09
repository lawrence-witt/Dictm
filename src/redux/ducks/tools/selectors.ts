import { createSelector } from 'reselect';
import { RouteComponentProps } from 'react-router-dom';

import * as helpers from './helpers';
import * as types from './types';

import { RootState } from '../../store';

/* 
*  Page Selectors
*/

export const getPageTitle = createSelector((
    location: RootState["history"]["current"],
    categories: RootState["content"]["categories"]
) => {
    return helpers.extractPageTitle(location, categories);
}, title => title);

export const getToolVisibility = createSelector((
    location: RootState["history"]["current"]
) => {
    const { stem, categoryId } = helpers.extractParams(location.pathname);
    return {
        replay: Boolean(stem === "categories" && categoryId || stem === "recordings" || stem === "notes"),
        search: stem !== "settings",
        delete: stem !== "settings"
    }
}, visibility => visibility);

/* 
*   Animation Selectors
*/

/** 
*  Summary:
*  Determines the animation activity and direction for the next Dashboard frame.
*
*  Description:
*  By default, perform a simple index check versus previous location on the stem of the pathname.
*  Where a categoryId is included, check the index versus previous location in categories.allIds.
*/

export const getDashboardAnimation = createSelector((
    categories: RootState["content"]["categories"],
    history: RootState["history"]
): { dir: 'left' | 'right'; active: boolean; } => {
    const { 
        getDirectionByStemIndex, 
        getDirectionByCategoryIndex,
        extractParams
    } = helpers;

    const leftAnimate = { dir: 'left' as const, active: true };
    const rightAnimate = { dir: 'right' as const, active: true };
    const noAnimate = { dir: 'left' as const, active: false};

    const { previous, current } = history;

    const prevParams =  previous && extractParams(previous.pathname);
    const currParams = extractParams(current.pathname);

    if (!prevParams?.stem || !currParams.stem) return noAnimate;

    const { stem: prevStem, categoryId: prevId } = prevParams;
    const { stem: currStem, categoryId: currId } = currParams;

    const stemComparison = (
        previous: typeof types.stems[number],
        current: typeof types.stems[number]
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

    switch(currParams.stem) {
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
}, animation => animation);

/* 
*   Navigation Selectors
*/

/** 
*  Summary:
*  Creates nested lists for use by the NavMenu component.
*
*  Description:
*  Currently creates a 'main' and 'categories' list.
*  Assigns the primary click action of each item in the list, and its display properties.
*/

export const getNavLists = createSelector((
    profile: RootState["user"]["profile"], 
    categories: RootState["content"]["categories"],
    push: RouteComponentProps["history"]["push"],
    signOut: () => void
): types.NavMenuLists => {
    const { createNavItem } = helpers;

    const mainList = {
        id: "main",
        name: profile?.attributes.name || "",
        items: [
            createNavItem("recordings", "recordings", "Recordings", false, undefined, () => push('/recordings')),
            createNavItem("notes", "notes", "Notes", false, undefined, () => push('/notes')),
            createNavItem("categories", "categories", "Categories", false, "categories", () => push('/categories')),
            createNavItem("settings", "settings", "Settings", true, undefined, () => push('/settings')),
            createNavItem("signout", "signout", "Sign Out", false, undefined, signOut)
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

/** 
*  Summary:
*  Derives a tab identifier from current history location.
*/

export const getNavBarTab = createSelector((
    currentHistory: RootState["history"]["current"]
) => {
    const { stem, categoryId } = helpers.extractParams(currentHistory.pathname);

    switch(stem) {
        case "recordings":
        case "notes":
            return stem;
        case "categories":
            if (!categoryId) return stem;
        default:
            return "";
    }
}, tab => tab);

/* 
*   Delete Tool Selectors 
*/

/** 
*  Summary:
*  Count how many resources are pending deletion.
*/

export const getDeleteQuantity = createSelector((
    deleteState: RootState["tools"]["delete"]
) => {
    const { recordings, notes, categories } = deleteState;

    return [recordings, notes, categories].reduce((count: number, bucket) => {
        return count + bucket.length;
    }, 0);
}, quantity => quantity);

/** 
*  Summary:
*  Derive the type of resources pending deletion from browser location.
*/

export const getDeleteContext = createSelector((
    currentHistory: RootState["history"]["current"]
) => {
    const { stem, categoryId } = helpers.extractParams(currentHistory.pathname);

    switch(stem) {
        case "recordings":
        case "notes":
            return stem;
        case "categories":
            if (categoryId) return "items";
            return stem;
        default:
            return "items";
    }
}, context => context);

/** 
*  Summary:
*  Check whether a specific resource is pending deletion.
*/

export const getDeleteToggledStatus = createSelector((
    deleteState: RootState["tools"]["delete"],
    bucket: "recordings" | "notes" | "categories",
    id: string
) => {
    return deleteState[bucket].includes(id);
}, isToggled => isToggled)