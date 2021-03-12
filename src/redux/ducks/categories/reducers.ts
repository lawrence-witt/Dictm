import {
    CategoriesState,
    CategoriesActionTypes,
    CATEGORY_ADDED
} from './types';

import mockCategoriesData from '../../_data/categoriesData';

const initialState: CategoriesState = mockCategoriesData.reduce((state: CategoriesState, cat) => {
    state.byId[cat.id] = cat;
    state.allIds.push(cat.id);
    return state;
}, {byId: {}, allIds: []});

const categoriesReducer = (
    state = initialState, 
    action: CategoriesActionTypes
): CategoriesState => {
    switch(action.type) {
        case CATEGORY_ADDED:
            const { category } = action.payload;
            
            return {
                byId: {
                    ...state.byId,
                    [category.id]: category
                },
                allIds: [category.id, ...state.allIds]
            }
        default:
            return state;
    }
}

export default categoriesReducer;