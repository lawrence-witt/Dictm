import { ThunkAction } from 'redux-thunk';

import { RootState } from '../../store';

import * as types from './types';
import * as actions from './actions';

/* Search Tool Operations */

/* 
*   Summary:
*   Toggle the open state of the search tool.
*/

export const toggleSearchTool = (): ToggleSearchToolThunkAction => (
    dispatch,
    getState
): void => {
    const { isOpen } = getState().tools.search;

    dispatch(isOpen ? actions.closeSearchTool() : actions.openSearchTool());
};

type ToggleSearchToolThunkAction = ThunkAction<void, RootState, unknown, 
    types.SearchToolOpenedAction |
    types.SearchToolClosedAction
>

/* 
*   Summary:
*   Update the value of the search term.
*/

export const setSearchTerm = (
    term: string
): SetSearchTermThunkAction => (
    dispatch
): void => {
    dispatch(actions.setSearchTerm(term));
}

type SetSearchTermThunkAction = ThunkAction<void, undefined, unknown, types.SearchTermSetAction>;

/* Delete Tool Operations */

