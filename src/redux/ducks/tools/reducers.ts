import { combineReducers } from 'redux';

import * as types from './types';

/* Nav Menu Reducer */

const initialMenuState: types.NavMenuState = {
    isOpen: false
}

const navMenuReducer = (
    state = initialMenuState,
    action: types.NavMenuActionTypes
): types.NavMenuState => {
    switch(action.type) {
        case types.NAV_MENU_OPENED:
            return {
                isOpen: true
            }
        case types.NAV_MENU_CLOSED:
            return {
                isOpen: false
            }
        default: return state;
    }
};

/* Search Tool Reducer */

const initialSearchState: types.SearchToolState = {
    isOpen: false,
    term: ""
}

const searchToolReducer = (
    state = initialSearchState,
    action: types.SearchToolActionTypes
): types.SearchToolState => {
    switch(action.type) {
        case types.SEARCH_TOOL_OPENED:
            return {
                ...state,
                isOpen: true
            }
        case types.SEARCH_TERM_SET:
            return {
                ...state,
                term: action.payload.term
            }
        case types.SEARCH_TOOL_CLOSED:
        case types.DELETE_TOOL_OPENED:
            return initialSearchState;
        default:
            return state;
    }
}

/* Delete Tool Reducer */

const initialDeleteState: types.DeleteToolState = {
    isOpen: false,
    isDeleting: false,
    recordings: [],
    notes: [],
    categories: []
}

const deleteToolReducer = (
    state = initialDeleteState,
    action: types.DeleteToolActionTypes
): types.DeleteToolState => {
    switch(action.type) {
        case types.DELETE_TOOL_OPENED:
            return {
                ...state,
                isOpen: true
            }
        case types.DELETE_TOOL_RESOURCE_TOGGLED: {
            const { bucket, id } = action.payload;

            const bucketClone = [...state[bucket]];

            const idx = bucketClone.findIndex(i => i === id);

            if (idx === -1) {
                bucketClone.push(id);
            } else {
                bucketClone.splice(idx, 1);
            }

            return {
                ...state,
                [bucket]: bucketClone
            }
        }
        case types.DELETE_TOOL_SET_DELETING:
            return {
                ...state,
                isDeleting: true
            }
        case types.DELETE_TOOL_UNSET_DELETING:
            return {
                ...state,
                isDeleting: false
            }
        case types.DELETE_TOOL_DELETED:
            return {
                ...initialDeleteState,
                isOpen: state.isOpen,
                isDeleting: false
            }
        case types.DELETE_TOOL_CLOSED:
        case types.SEARCH_TOOL_OPENED:
            return initialDeleteState;
        default:
            return state;
    }
}

/* Root Reducer */

const reducer = combineReducers({
    menu: navMenuReducer,
    search: searchToolReducer,
    delete: deleteToolReducer
});

export default reducer;