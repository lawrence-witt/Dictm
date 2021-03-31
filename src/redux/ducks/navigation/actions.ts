import * as types from './types';

/* Nav Tool Actions */

export const openNavMenu = (): types.NavMenuOpenedAction => ({
    type: types.NAV_MENU_OPENED
});

export const closeNavMenu = (): types.NavMenuClosedAction => ({
    type: types.NAV_MENU_CLOSED
});