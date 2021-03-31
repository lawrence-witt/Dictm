import { combineReducers } from 'redux';

import * as types from './types';

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

const reducer = combineReducers({
    menu: menuReducer
});

export default reducer;