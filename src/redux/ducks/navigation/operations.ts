import { ThunkAction } from 'redux-thunk';
import { Location, Action } from 'history';

import { RootState } from '../../store';

import * as types from './types';
import * as actions from './actions';

/* Nav Menu Operations */

/** 
*  Summary:
*  Toggle the open state of the navigation menu.
*/

export const toggleNavMenu = (): ToggleNavMenuThunkAction => (
    dispatch,
    getState
): void => {
    const { isOpen } = getState().navigation.menu;

    dispatch(isOpen ? actions.closeNavMenu() : actions.openNavMenu());
}

type ToggleNavMenuThunkAction = ThunkAction<void, RootState, unknown, 
    types.NavMenuOpenedAction | 
    types.NavMenuClosedAction
>;

/* Nav History Operations */

/** 
*  Summary:
*  Change the current location object.
*
*  Description:
*  Move history.current to history.prev.
*  Insert the new location object at history.current.
*/

export const changeLocation = (
    location: Location,
    action: Action
): ChangeLocationThunkAction => (
    dispatch
) => {
    dispatch(actions.changeLocation(location, action));
}

type ChangeLocationThunkAction = ThunkAction<void, undefined, unknown, types.NavLocationChangedAction>;