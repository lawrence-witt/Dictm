import { ThunkResult } from '../../store';
import { Location } from 'history';

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
): ThunkResult<void> => (
    dispatch
): void => {
    dispatch(actions.changeLocation({...location}));
}