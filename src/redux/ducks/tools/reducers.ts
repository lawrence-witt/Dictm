import { combineReducers } from 'redux';

import * as types from './types';

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
            return {
                isOpen: false,
                term: ""
            }
        default:
            return state;
    }
}

/* Delete Tool Reducer */

const reducer = combineReducers({
    search: searchToolReducer
});

export default reducer;