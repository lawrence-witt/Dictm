import { createSelector } from 'reselect';

import { RootState } from '../../store';

/* Select nested navigation lists */

const createNavItem = (
    id: string, 
    primary: string, 
    divider: boolean, 
    to: string | undefined
) => ({
    id,
    primary,
    divider,
    to
});

export const getNavLists = createSelector((user: RootState["user"], cats: RootState["categories"]) => {
    const main = {
        id: "main",
        name: user.name,
        items: [
            createNavItem("recordings", "Recordings", false, undefined),
            createNavItem("notes", "Notes", false, undefined),
            createNavItem("categories", "Categories", false, "categories"),
            createNavItem("settings", "Settings", true, undefined),
            createNavItem("signout", "Sign Out", false, undefined)
        ]
    }

    const categories = {
        id: "categories",
        name: "Categories",
        items: cats.allIds.map(categoryId => {
            const category = cats.byId[categoryId];
            return createNavItem(category.id, category.attributes.title, false, undefined);
        })
    }

    return {
        main,
        categories
    }
}, navLists => navLists);