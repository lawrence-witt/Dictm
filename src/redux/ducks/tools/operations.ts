import { ThunkAction } from 'redux-thunk';

import { RootState } from '../../store';

import * as types from './types';
import * as actions from './actions';

/* Nav Tool Operations */

/** 
*  Summary:
*  Toggle the open state of the nav menu.
*/

export const toggleNavMenu = (): ToggleNavMenuThunkAction => (
    dispatch,
    getState
): void => {
    const { isOpen } = getState().tools.nav.menu;

    dispatch(isOpen ? actions.closeNavMenu() : actions.openNavMenu());
}

type ToggleNavMenuThunkAction = ThunkAction<void, RootState, unknown, 
    types.NavMenuOpenedAction | 
    types.NavMenuClosedAction
>