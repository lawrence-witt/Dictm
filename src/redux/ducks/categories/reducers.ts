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
        case types.CATEGORIES_LOADED:
            return action.payload.categories.reduce((out: types.CategoriesState, category) => {
                out.byId[category.id] = category;
                out.allIds = [...out.allIds, category.id];
                return out;
            }, {byId: {}, allIds: []});
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
        case types.CATEGORY_OVERWRITTEN: {
            const { category } = action.payload;

            return {
                ...state,
                byId: {
                    ...state.byId,
                    [category.id]: category
                }
            }
        }
        case types.CATEGORY_IDS_ADDED: {
            const { id, type, ids } = action.payload;

            return {
                ...state,
                byId: {
                    ...state.byId,
                    [id]: {
                        ...state.byId[id],
                        relationships: {
                            ...state.byId[id].relationships,
                            [type]: {
                                ids: [...state.byId[id].relationships[type].ids, ...ids]
                            }
                        }
                    }
                }
            }
        }
        case types.CATEGORY_IDS_REMOVED: {
            const { id, type, ids } = action.payload;

            return {
                ...state,
                byId: {
                    ...state.byId,
                    [id]: {
                        ...state.byId[id],
                        relationships: {
                            ...state.byId[id].relationships,
                            [type]: {
                                ids: state.byId[id].relationships[type].ids.filter(id => !ids.includes(id))
                            }
                        }
                    }
                }
            }
        }
        case types.CATEGORY_DELETED: {
            const { id } = action.payload;

            const clone = {...state};

            delete clone.byId[id];
            clone.allIds = clone.allIds.filter(i => i !== id);

            return clone;
        }
        default:
            return state;
    }
}

export default categoriesReducer;