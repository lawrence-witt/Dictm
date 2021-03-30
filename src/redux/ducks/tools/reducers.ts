import { combineReducers } from 'redux';

import * as types from './types';

/* Nav Tool Reducer */

const initialNavState: types.NavToolState = {
    menu: {
        isOpen: false
    }
}

const navReducer = (
    state = initialNavState,
    action: types.NavToolActionTypes
): types.NavToolState => {
    switch(action.type) {
        case types.NAV_MENU_OPENED:
            return {
                ...state,
                menu: {
                    ...state.menu,
                    isOpen: true
                }
            }
        case types.NAV_MENU_CLOSED:
            return {
                ...state,
                menu: {
                    ...state.menu,
                    isOpen: false
                }
            }
        default: return state;
    }
}

/* Search Tool Reducer*/

/* Delete Tool Reducer*/

const toolsReducer = combineReducers({
    nav: navReducer
})

export default toolsReducer;