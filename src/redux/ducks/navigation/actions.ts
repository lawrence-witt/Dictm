import * as types from './types';

/* Nav Menu Actions */

export const openNavMenu = (): types.NavMenuOpenedAction => ({
    type: types.NAV_MENU_OPENED
});

export const closeNavMenu = (): types.NavMenuClosedAction => ({
    type: types.NAV_MENU_CLOSED
});

/* Nav History Actions */

export const changeLocation = (
    pathname: string,
    title: string,
    params: types.Params
): types.NavLocationChangedAction => ({
    type: types.NAV_LOCATION_CHANGED,
    payload: {
        pathname,
        title,
        params
    }
})