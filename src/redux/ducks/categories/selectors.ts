import { createSelector } from 'reselect';

import { RootState } from '../../store';

export const getCategoryTitles = createSelector((categories: RootState["categories"]) => {
    return categories.allIds.map(id => ({
        id,
        title: categories.byId[id].attributes.title
    }))
}, categoryTitles => categoryTitles);