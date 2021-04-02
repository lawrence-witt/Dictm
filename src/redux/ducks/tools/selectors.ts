import { createSelector } from 'reselect';

import { RootState } from '../../store';

/* Delete Tool Selectors */

export const getDeleteQuantity = createSelector((
    deleteState: RootState["tools"]["delete"]
) => {
    const { recordings, notes, categories } = deleteState;

    return [recordings, notes, categories].reduce((count: number, type) => {
        return count + Object.keys(type).length;
    }, 0);
}, quantity => quantity);

export const getDeleteContext = createSelector((
    currentHistory: RootState["navigation"]["history"]["current"]
) => {
    const { stem, categoryId } = currentHistory.params;

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

export const getDeleteToggledStatus = createSelector((
    deleteState: RootState["tools"]["delete"],
    bucket: "recordings" | "notes" | "categories",
    id: string
) => {
    return Boolean(deleteState[bucket][id]);
}, isToggled => isToggled)