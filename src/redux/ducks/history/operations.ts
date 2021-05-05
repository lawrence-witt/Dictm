import { ThunkResult } from '../../store';
import { Location } from 'history';

import { toolOperations, toolHelpers } from '../tools';

import * as actions from './actions';

/** 
*  Summary:
*  Change the current location object.
*
*  Description:
*  Move `history.current` to `history.prev`.
*  Insert the new location object at `history.current`.
*  Perform route change side effects.
*/

export const changeLocation = (
    location: Location
): ThunkResult<void> => (
    dispatch,
    getState
): void => {
    const { stem } = toolHelpers.extractParams(location.pathname);

    const { tools } = getState();

    if (tools.delete.isOpen) dispatch(toolOperations.toggleDeleteTool());
    if (stem === "settings" && tools.search.isOpen) dispatch(toolOperations.toggleSearchTool());

    dispatch(actions.changeLocation({...location}));
}