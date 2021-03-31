import { combineReducers } from 'redux';

import * as types from './types';

/* Nav Menu Reducer */

const initialMenuState: types.NavMenuState = {
    isOpen: false
}

const menuReducer = (
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

/* Nav History Reducer */

const initialHistoryState: types.NavHistoryState = {
    previous: undefined,
    current: {
        location: {
            key: "initialKey",
            pathname: window.location.pathname,
            search: "",
            state: "",
            hash: ""
        },
        action: "POP"
    }
}

const historyReducer = (
    state = initialHistoryState,
    action: types.NavHistoryActionTypes
): types.NavHistoryState => {
    switch (action.type) {
        case types.NAV_LOCATION_CHANGED:
            return {
                previous: state.current,
                current: {
                    location: action.payload.location,
                    action: action.payload.action
                }
            }
        default: return state;
    }
}

const reducer = combineReducers({
    menu: menuReducer,
    history: historyReducer
});

export default reducer;