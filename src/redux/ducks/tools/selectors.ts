import { createSelector } from 'reselect';
import { RouteComponentProps } from 'react-router-dom';

import { RootState } from '../../store';

import { NavMenuLists } from './types';

/* Select nested navigation lists */

const createNavItem = (
    id: string,
    icon: string | undefined,
    primary: string, 
    divider: boolean, 
    to: string | undefined,
    onClick: (() => void) | undefined
) => ({
    id,
    icon: icon,
    primary,
    divider,
    to,
    onClick
});

export const getNavLists = createSelector((
    user: RootState["user"], 
    cats: RootState["categories"],
    push: RouteComponentProps["history"]["push"]
): NavMenuLists => {
    const main = {
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

    const categories = {
        id: "categories",
        name: "Categories",
        items: cats.allIds.map(categoryId => {
            const category = cats.byId[categoryId];
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
        main,
        categories
    }
}, navLists => navLists);