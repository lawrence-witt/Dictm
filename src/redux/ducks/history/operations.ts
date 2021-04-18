import { ThunkAction } from 'redux-thunk';
import { Location } from 'history';

import * as types from './types';
import * as actions from './actions';

/** 
*  Summary:
*  Change the current location object.
*
*  Description:
*  Move history.current to history.prev.
*  Insert the new location object at history.current.
*/

export const changeLocation = (
    location: Location
): ChangeLocationThunkAction => (
    dispatch
): void => {
    dispatch(actions.changeLocation({...location}));
}

type ChangeLocationThunkAction = ThunkAction<void, undefined, unknown, types.LocationChangedAction>;