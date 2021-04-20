import { createSelector } from 'reselect';

import { RootState } from '../../../store';

export const getCategoriesByTitle = createSelector((categories: RootState["content"]["categories"]) => {
    return categories.allIds.map(id => ({
        id,
        title: categories.byId[id].attributes.title
    }))
}, categoryData => categoryData);