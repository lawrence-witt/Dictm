import * as types from './types';

const initialState: types.CategoriesState = {
    byId: {},
    allIds: []
}

const categoriesReducer = (
    state = initialState, 
    action: types.CategoriesActionTypes
): types.CategoriesState => {
    switch(action.type) {
        case types.CATEGORIES_LOADED: {
            const { categories } = action.payload;

            return categories.reduce((out: types.CategoriesState, category) => {
                out.byId[category.id] = category;
                out.allIds = [...out.allIds, category.id];
                return out;
            }, {byId: {}, allIds: []});
        }
        case types.CATEGORY_CREATED: {
            const { category } = action.payload;
            
            return {
                byId: {
                    ...state.byId,
                    [category.id]: category
                },
                allIds: [category.id, ...state.allIds]
            }
        }
        case types.CATEGORIES_OVERWRITTEN: {
            const { categories } = action.payload;
            const clonedState = { ...state, byId: {...state.byId} };

            return categories.reduce((out, category) => {
                out.byId[category.id] = category;
                return out;
            }, clonedState);
        }
        case types.CATEGORIES_DELETED: {
            const { ids } = action.payload;

            const clonedState = {
                byId: {...state.byId}, 
                allIds: [...state.allIds]
            };

            ids.forEach(id => delete clonedState.byId[id]);
            clonedState.allIds = clonedState.allIds.filter(id => !ids.includes(id));

            return clonedState;
        }
        case types.CATEGORIES_CLEARED:
            return initialState;
        default:
            return state;
    }
}

export default categoriesReducer;